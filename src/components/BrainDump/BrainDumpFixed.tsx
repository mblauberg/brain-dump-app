import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PaperAirplaneIcon, FireIcon } from '@heroicons/react/24/outline';
import { GlassContainer, GlassButton } from '../Glass';
import { useAppStore } from '../../stores/useAppStore';
import { processBrainDumpText } from '../../services/aiService';

interface BrainDumpFixedProps {
  energyLevel?: 'high' | 'medium' | 'low';
  onProcessingComplete?: (results: any) => void;
}

const BrainDumpFixed: React.FC<BrainDumpFixedProps> = ({
  energyLevel = 'medium',
  onProcessingComplete,
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [showRecentEntries, setShowRecentEntries] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { addTask, addHabit, brainDumpEntries, addBrainDumpEntry } = useAppStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Load recent entries
  useEffect(() => {
    const recent = brainDumpEntries
      .slice(-3)
      .map(entry => entry.content)
      .filter(text => text.length > 0);
    setRecentEntries(recent);
  }, [brainDumpEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setProcessingStatus('Analyzing your thoughts...');

    try {
      // Create brain dump entry
      addBrainDumpEntry({
        content: input.trim(),
      });

      setProcessingStatus('Extracting tasks and habits...');

      // Process with AI service
      const result = await processBrainDumpText(input.trim());

      // Add extracted tasks
      result.tasks.forEach((task: any) => {
        addTask({
          title: task.title,
          description: task.description || '',
          category: task.category || 'other',
          priority: task.priority || 'medium',
          status: 'not_started',
          energyLevel: task.energyLevel || 'medium',
          timeEstimate: task.timeEstimate || '30 minutes',
        });
      });

      // Add extracted habits
      result.habits.forEach((habit: any) => {
        addHabit({
          title: habit.name || habit.title || 'Unnamed Habit',
          description: habit.description || '',
          frequency: habit.frequency || 'daily',
          scheduledTime: undefined,
          isActive: true,
        });
      });

      setProcessingStatus('Organized! Check your tasks and habits below.');
      onProcessingComplete?.(result);

      // Clear input after successful processing
      setInput('');
      
      // Reset status after a delay
      setTimeout(() => {
        setProcessingStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error processing brain dump:', error);
      setProcessingStatus('Something went wrong. Try again or check your AI settings.');
      
      setTimeout(() => {
        setProcessingStatus('');
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickInsert = (text: string) => {
    const newText = input ? `${input}\n${text}` : text;
    setInput(newText);
    setShowRecentEntries(false);
    
    // Focus textarea after insertion
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 0);
  };

  const getCognitiveHint = () => {
    if (input.length === 0) {
      return "What's swirling around in your mind? Just dump it all here - I'll help organize it.";
    }
    if (input.length < 20) {
      return "Keep going! The more details you share, the better I can help organize your thoughts.";
    }
    if (input.length > 200) {
      return "Great detail! Ready to process when you are.";
    }
    return "Looking good! Add more thoughts or hit process to organize.";
  };

  return (
    <div className="sticky top-20 z-40 mb-8">
      <GlassContainer
        variant="medium"
        cognitiveLoad="standard"
        energyLevel={energyLevel}
        elevation="elevated"
        className="transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Brain Dump Central</h1>
              <p className="text-sm text-gray-600">Your mind palace organizer</p>
            </div>
          </div>
          
          {/* Recent Entries Toggle */}
          {recentEntries.length > 0 && (
            <GlassButton
              variant="ghost"
              size="sm"
              energyLevel={energyLevel}
              onClick={() => setShowRecentEntries(!showRecentEntries)}
              aria-label="Toggle recent entries"
            >
              Recent
            </GlassButton>
          )}
        </div>

        {/* Recent Entries Quick Access */}
        {showRecentEntries && recentEntries.length > 0 && (
          <div className="mb-4 p-4 bg-primary-50/50 rounded-lg border border-primary-200/30">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent brain dumps:</h3>
            <div className="space-y-1">
              {recentEntries.map((entry, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickInsert(entry)}
                  className="block w-full text-left text-xs text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-white/50 transition-colors"
                >
                  {entry.length > 60 ? `${entry.substring(0, 60)}...` : entry}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brain Dump Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind? Tasks to do, habits to build, random thoughts - dump it all here and I'll help organize it..."
              className={`w-full min-h-[120px] max-h-[300px] px-4 py-3 
                glass-morphism-light backdrop-blur-md
                border border-white/30 rounded-lg resize-none
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                focus:border-primary-400 focus:bg-white/80
                transition-all duration-200
                ${energyLevel === 'high' ? 'focus:scale-[1.01]' : ''}
                ${energyLevel === 'low' ? 'transition-all duration-400' : ''}
              `}
              disabled={isProcessing}
              aria-label="Brain dump input"
              aria-describedby="brain-dump-hint"
            />
            
            {/* Character count and energy indicator */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {input.length} chars
              </span>
              {energyLevel === 'high' && input.length > 50 && (
                <span className="text-xs text-orange-500 animate-gentle-pulse flex items-center">
                  <FireIcon className="w-3 h-3 mr-1" />
                  High energy detected
                </span>
              )}
            </div>
          </div>

          {/* Cognitive Hint */}
          <p id="brain-dump-hint" className="text-sm text-gray-600 italic">
            {processingStatus || getCognitiveHint()}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                energyLevel={energyLevel}
                loading={isProcessing}
                disabled={!input.trim() || isProcessing}
                icon={<PaperAirplaneIcon className="h-5 w-5" />}
              >
                {isProcessing ? 'Processing...' : 'Organize My Thoughts'}
              </GlassButton>
              
              {input.trim() && (
                <GlassButton
                  type="button"
                  variant="ghost"
                  size="md"
                  energyLevel={energyLevel}
                  onClick={() => setInput('')}
                  disabled={isProcessing}
                >
                  Clear
                </GlassButton>
              )}
            </div>

            {/* Energy Level Indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Energy:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                energyLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                energyLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {energyLevel}
              </span>
            </div>
          </div>
        </form>

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-4 p-3 bg-primary-50/50 rounded-lg border border-primary-200/30">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-primary-700">{processingStatus}</span>
            </div>
          </div>
        )}
      </GlassContainer>
    </div>
  );
};

export default BrainDumpFixed;