import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { getAIService } from '../../services/ai';
import { AIProvider } from '../../types';

const AISettings: React.FC = () => {
  const { userPreferences, updateUserPreferences } = useAppStore();
  const aiSettings = userPreferences.aiSettings;
  
  const [localSettings, setLocalSettings] = useState(aiSettings);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const aiService = getAIService();

  // Available models for each provider
  const modelOptions = {
    openai: [
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo (Recommended)', description: 'Most capable, 128k context' },
      { id: 'gpt-4', name: 'GPT-4', description: 'High quality, slower' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
    ],
    claude: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Recommended)', description: 'Most capable' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and efficient' },
    ],
    gemini: [
      { id: 'gemini-pro', name: 'Gemini Pro (Recommended)', description: 'Best for text tasks' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Multimodal capabilities' },
    ],
    none: []
  };

  useEffect(() => {
    // Load API key from environment if not set
    if (!localSettings.apiKey && localSettings.provider !== 'none') {
      const envKeys = {
        openai: process.env.REACT_APP_OPENAI_API_KEY,
        claude: process.env.REACT_APP_CLAUDE_API_KEY,
        gemini: process.env.REACT_APP_GEMINI_API_KEY,
      };
      
      const envKey = envKeys[localSettings.provider as keyof typeof envKeys];
      if (envKey) {
        setLocalSettings(prev => ({ ...prev, apiKey: envKey }));
      }
    }
  }, [localSettings.provider, localSettings.apiKey]);

  const handleProviderChange = (provider: AIProvider) => {
    const defaultModels = {
      openai: 'gpt-4-turbo-preview',
      claude: 'claude-3-opus-20240229',
      gemini: 'gemini-pro',
      none: ''
    };
    
    setLocalSettings(prev => ({
      ...prev,
      provider,
      model: defaultModels[provider],
      apiKey: ''
    }));
    setTestResult(null);
  };

  const handleSave = () => {
    updateUserPreferences({ aiSettings: localSettings });
    setTestResult({ success: true, message: 'Settings saved successfully!' });
  };

  const handleTest = async () => {
    if (!localSettings.apiKey || localSettings.provider === 'none') {
      setTestResult({ success: false, message: 'Please configure an API key first' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const testText = "I need to finish my project report by Friday, exercise more regularly, and remember to call my dentist for an appointment.";
      const response = await aiService.processText(testText, localSettings);
      
      if (response.tasks.length > 0 || response.habits.length > 0) {
        setTestResult({ 
          success: true, 
          message: `AI working! Found ${response.tasks.length} tasks and ${response.habits.length} habits.` 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: 'AI responded but no tasks or habits were extracted.' 
        });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const clearCache = () => {
    aiService.clearCache();
    setTestResult({ success: true, message: 'AI cache cleared successfully!' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Configuration</h3>
        
        {/* Provider Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'none', name: 'None', description: 'Use basic keyword extraction' },
              { id: 'openai', name: 'OpenAI', description: 'GPT-4 and GPT-3.5' },
              { id: 'claude', name: 'Claude', description: 'Anthropic\'s Claude' },
              { id: 'gemini', name: 'Gemini', description: 'Google\'s Gemini' },
            ].map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id as AIProvider)}
                className={`
                  relative rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${localSettings.provider === provider.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
                  </div>
                  <CpuChipIcon className="h-5 w-5 text-gray-400" />
                </div>
                {localSettings.provider === provider.id && (
                  <CheckCircleIcon className="absolute top-2 right-2 h-5 w-5 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        {localSettings.provider !== 'none' && (
          <>
            <div className="mb-6">
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="api-key"
                  value={localSettings.apiKey || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={`Enter your ${localSettings.provider} API key`}
                  className="block w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                id="model"
                value={localSettings.model}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, model: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {modelOptions[localSettings.provider as keyof typeof modelOptions].map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Settings */}
            <div className="mb-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Advanced Settings</h4>
              
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature: {localSettings.temperature}
                </label>
                <input
                  type="range"
                  id="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localSettings.temperature}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower values make output more focused, higher values more creative
                </p>
              </div>

              <div>
                <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Tokens: {localSettings.maxTokens}
                </label>
                <input
                  type="range"
                  id="maxTokens"
                  min="500"
                  max="4000"
                  step="100"
                  value={localSettings.maxTokens}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum length of AI response
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableCache"
                  checked={localSettings.enableCache}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, enableCache: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enableCache" className="ml-2 block text-sm text-gray-900">
                  Enable response caching (reduces API calls)
                </label>
              </div>
            </div>
          </>
        )}

        {/* Test Result */}
        {testResult && (
          <div className={`
            mb-6 p-4 rounded-md flex items-start
            ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
          `}>
            {testResult.success ? (
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Settings
          </button>
          
          {localSettings.provider !== 'none' && (
            <>
              <button
                onClick={handleTest}
                disabled={isTesting || !localSettings.apiKey}
                className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              
              <button
                onClick={clearCache}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Cache
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3 text-sm text-blue-700">
              <p className="font-medium mb-1">Getting API Keys:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                <li>Claude: <a href="https://console.anthropic.com/api" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com/api</a></li>
                <li>Gemini: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">makersuite.google.com/app/apikey</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;