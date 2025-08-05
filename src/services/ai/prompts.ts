export const ADHD_BRAIN_DUMP_SYSTEM_PROMPT = `You are an advanced AI assistant with hybrid reasoning capabilities, specialized in helping individuals with ADHD organize their scattered thoughts. Your task is to analyze brain dump text and extract actionable items across four categories: tasks, habits, calendar events, and sleep-related items.

🧠 USE YOUR ADVANCED REASONING:
- Apply deep thinking for complex, multi-layered thought patterns
- Use step-by-step reasoning to untangle overwhelming mental loads
- Leverage your understanding of executive function challenges
- Apply adaptive thinking to different communication styles

IMPORTANT GUIDELINES:
1. Be deeply empathetic to ADHD challenges: executive dysfunction, time blindness, overwhelm, rejection sensitivity
2. Break down complex, scattered thoughts into simple, digestible actionable items
3. Recognize both explicit mentions and implicit needs in all categories
4. Prioritize based on urgency indicators AND emotional weight (ADHD-friendly criteria)
5. Suggest realistic time estimates that account for ADHD time blindness and task-switching costs
6. Identify behavioral patterns that could become supportive habits
7. Detect time-sensitive appointments, deadlines, and social commitments
8. Pay special attention to sleep-related concerns (critical for ADHD management)
9. Notice emotional states and stress indicators that affect task prioritization
10. Consider hyperfocus vs. understimulation when categorizing energy levels

EXTRACTION RULES:
- Tasks: One-time actions with clear outcomes
- Habits: Recurring behaviors for routine building
- Events: Time-specific appointments, meetings, or scheduled activities
- Sleep: Bedtime goals, sleep schedule adjustments, sleep-related tasks
- Each item should be concise and actionable
- Include emotional context when relevant (high stress, excitement, etc.)
- Flag items that might be procrastination triggers

OUTPUT FORMAT:
You must respond with valid JSON in this exact format:
{
  "tasks": [
    {
      "title": "Clear, actionable task title",
      "description": "Optional additional context",
      "priority": "high|medium|low",
      "category": "work|personal|health|communication|home|other",
      "timeEstimate": "15min|30min|45min|1hr|2hr|3hr+",
      "energyLevel": "high|medium|low",
      "dueDate": "YYYY-MM-DD (if mentioned or implied)"
    }
  ],
  "habits": [
    {
      "title": "Simple habit name",
      "description": "Why this habit helps with ADHD",
      "frequency": "daily|weekly|custom",
      "scheduledTime": "HH:MM (if specific time mentioned)"
    }
  ],
  "events": [
    {
      "title": "Event or appointment name",
      "startTime": "YYYY-MM-DD HH:MM",
      "endTime": "YYYY-MM-DD HH:MM",
      "type": "appointment|meeting|deadline|social|other",
      "isFixed": true
    }
  ],
  "sleepSchedules": [
    {
      "bedtime": "HH:MM",
      "wakeTime": "HH:MM",
      "date": "YYYY-MM-DD (today if not specified)",
      "goal": "Description of sleep goal or concern"
    }
  ],
  "insights": {
    "overallMood": "stressed|neutral|motivated|overwhelmed",
    "suggestedFocus": "What to prioritize today",
    "warningFlags": ["List of concerns like overcommitment"],
    "sleepConcerns": ["Any sleep-related issues mentioned"]
  }
}`;

export const createUserPrompt = (
  brainDumpText: string, 
  extractionTypes: { tasks: boolean; habits: boolean; events: boolean; sleep: boolean }
): string => {
  const enabledTypes = Object.entries(extractionTypes)
    .filter(([_, enabled]) => enabled)
    .map(([type, _]) => type)
    .join(', ');
    
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
    
  return `🧠 ADVANCED REASONING TASK: Analyze this ADHD brain dump with deep understanding

EXTRACT THESE TYPES: ${enabledTypes}

BRAIN DUMP TEXT:
"${brainDumpText}"

CONTEXT:
- Today is ${todayFormatted} (${today})
- This person has ADHD - their thoughts may be scattered, non-linear, or overwhelming
- They need your advanced reasoning to make sense of their mental chaos

REASONING INSTRUCTIONS:
1. 🔍 DEEP ANALYSIS: Read between the lines - what are they REALLY worried about?
2. ⏰ TIME SENSITIVITY: Calculate specific dates for relative time references
3. 💭 EMOTIONAL WEIGHT: Notice stress, anxiety, excitement - these affect priority
4. 🧩 EXECUTIVE FUNCTION: Break overwhelming items into manageable pieces
5. 🔄 PATTERN RECOGNITION: Spot habits that could help with mentioned struggles
6. 😴 SLEEP PRIORITY: ADHD + poor sleep = disaster, so prioritize sleep items
7. 🎯 REALISTIC EXPECTATIONS: Time estimates that account for ADHD tax
8. 💯 STRENGTHS-BASED: Frame everything positively, avoid judgment

USE YOUR ADVANCED CAPABILITIES:
- Multi-step reasoning for complex scheduling
- Contextual understanding of ADHD challenges
- Adaptive responses to communication style
- Deep thinking for implicit needs and concerns`;
};

// Model-specific prompts optimized for 2025 AI capabilities
export const providerSpecificPrompts = {
  openai: {
    additionalInstructions: "Leverage your GPT-4.1 reasoning capabilities and o3/o4-mini logic to deeply understand ADHD thought patterns. Use step-by-step reasoning to break down overwhelming thoughts. Apply your coding expertise to create systematic, logical approaches to task organization.",
  },
  claude: {
    additionalInstructions: "Use your Claude 4 hybrid reasoning and extended thinking mode to provide nuanced, empathetic understanding of ADHD struggles. Apply your code execution capabilities to think through complex scheduling logic. Consider the full emotional and cognitive context.",
  },
  gemini: {
    additionalInstructions: "Apply your Gemini 2.5 thinking capabilities and adaptive reasoning to understand neurodivergent perspectives. Use your 1M+ token context to maintain awareness of complex, interconnected thoughts. Focus on strengths-based, accommodation-friendly approaches.",
  },
};

// Enhanced validation for the new response format
export const validateAIResponse = (response: any): boolean => {
  try {
    return (
      response &&
      typeof response === 'object' &&
      Array.isArray(response.tasks) &&
      Array.isArray(response.habits) &&
      Array.isArray(response.events) &&
      Array.isArray(response.sleepSchedules) &&
      response.tasks.every((task: any) => 
        task.title && 
        typeof task.title === 'string' &&
        ['high', 'medium', 'low'].includes(task.priority) &&
        ['work', 'personal', 'health', 'communication', 'home', 'other'].includes(task.category) &&
        ['15min', '30min', '45min', '1hr', '2hr', '3hr+'].includes(task.timeEstimate) &&
        ['high', 'medium', 'low'].includes(task.energyLevel)
      ) &&
      response.habits.every((habit: any) =>
        habit.title &&
        typeof habit.title === 'string' &&
        ['daily', 'weekly', 'custom'].includes(habit.frequency)
      ) &&
      response.events.every((event: any) =>
        event.title &&
        typeof event.title === 'string' &&
        event.startTime &&
        event.endTime &&
        typeof event.isFixed === 'boolean'
      ) &&
      response.sleepSchedules.every((schedule: any) =>
        schedule.bedtime &&
        schedule.wakeTime &&
        typeof schedule.bedtime === 'string' &&
        typeof schedule.wakeTime === 'string'
      )
    );
  } catch (error) {
    return false;
  }
};

// ADHD-specific text preprocessing
export const preprocessBrainDump = (text: string): string => {
  // Normalize scattered thoughts
  let processed = text
    // Add periods to lines that don't end with punctuation
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.match(/[.!?]$/)) {
        return trimmed + '.';
      }
      return trimmed;
    })
    .join(' ')
    // Remove excessive spaces
    .replace(/\s+/g, ' ')
    // Fix common ADHD typing patterns (repeated punctuation, etc.)
    .replace(/([.!?])\1+/g, '$1')
    // Normalize time expressions
    .replace(/\btomorrow\b/gi, 'tomorrow')
    .replace(/\bnext week\b/gi, 'next week')
    .replace(/\btonight\b/gi, 'tonight')
    .trim();

  return processed;
};

// Helper to create fallback response if AI fails
export const createFallbackResponse = (text: string) => {
  return {
    tasks: [{
      title: "Review brain dump notes",
      description: "Process the thoughts you wrote down",
      priority: "medium" as const,
      category: "personal" as const,
      timeEstimate: "15min" as const,
      energyLevel: "low" as const
    }],
    habits: [],
    events: [],
    sleepSchedules: [],
    insights: {
      overallMood: "neutral" as const,
      suggestedFocus: "Take time to organize your thoughts",
      warningFlags: ["AI processing unavailable - manual review needed"],
      sleepConcerns: []
    }
  };
};

// Model-specific configuration for optimal performance (Updated 2025)
export const AI_MODEL_CONFIGS = {
  openai: {
    models: [
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        description: 'Flagship model with major coding improvements, up to 1M token context',
        maxTokens: 1000000,
        costPer1kTokens: { input: 0.003, output: 0.012 }
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 Mini',
        description: 'High-performance small model, 83% cost reduction vs GPT-4o',
        maxTokens: 128000,
        costPer1kTokens: { input: 0.000075, output: 0.0003 }
      },
      {
        id: 'gpt-4.1-nano',
        name: 'GPT-4.1 Nano',
        description: 'Fastest, cheapest model for low-latency tasks',
        maxTokens: 64000,
        costPer1kTokens: { input: 0.00005, output: 0.0002 }
      },
      {
        id: 'o3',
        name: 'OpenAI o3',
        description: 'Most powerful reasoning model, state-of-the-art on coding/math/science',
        maxTokens: 200000,
        costPer1kTokens: { input: 0.015, output: 0.06 }
      },
      {
        id: 'o4-mini',
        name: 'OpenAI o4-mini',
        description: 'Efficient reasoning model for complex multi-step problems',
        maxTokens: 128000,
        costPer1kTokens: { input: 0.001, output: 0.004 }
      }
    ],
    defaultModel: 'gpt-4.1-mini'
  },
  claude: {
    models: [
      {
        id: 'claude-opus-4',
        name: 'Claude Opus 4',
        description: 'Most powerful model for complex coding and AI agents with hybrid reasoning',
        maxTokens: 500000,
        costPer1kTokens: { input: 0.025, output: 0.125 }
      },
      {
        id: 'claude-sonnet-4',
        name: 'Claude Sonnet 4',
        description: 'High-performance workhorse balancing quality, cost, and speed',
        maxTokens: 200000,
        costPer1kTokens: { input: 0.003, output: 0.015 }
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet (Legacy)',
        description: 'Previous generation, still excellent for most tasks',
        maxTokens: 200000,
        costPer1kTokens: { input: 0.003, output: 0.015 }
      }
    ],
    defaultModel: 'claude-sonnet-4'
  },
  gemini: {
    models: [
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Most intelligent model with thinking capabilities, 1M+ token context',
        maxTokens: 1000000,
        costPer1kTokens: { input: 0.002, output: 0.008 }
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Cost-efficient with adaptive thinking, #2 on LMarena leaderboard',
        maxTokens: 1000000,
        costPer1kTokens: { input: 0.0001, output: 0.0004 }
      },
      {
        id: 'gemini-2.5-pro-deep-think',
        name: 'Gemini 2.5 Pro Deep Think',
        description: 'Experimental enhanced reasoning mode for highly complex problems',
        maxTokens: 1000000,
        costPer1kTokens: { input: 0.005, output: 0.02 }
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Production-ready workhorse model for developers',
        maxTokens: 1000000,
        costPer1kTokens: { input: 0.000075, output: 0.0003 }
      },
      {
        id: 'gemini-2.0-pro',
        name: 'Gemini 2.0 Pro',
        description: 'Experimental with strongest coding performance, 2M token context',
        maxTokens: 2000000,
        costPer1kTokens: { input: 0.00125, output: 0.005 }
      }
    ],
    defaultModel: 'gemini-2.5-flash'
  }
};