export const ADHD_BRAIN_DUMP_SYSTEM_PROMPT = `You are an AI assistant specialized in helping individuals with ADHD organize their thoughts. Your task is to analyze brain dump text and extract actionable tasks and habits.

IMPORTANT GUIDELINES:
1. Be empathetic to ADHD challenges: executive dysfunction, time blindness, overwhelm
2. Break down complex thoughts into simple, actionable items
3. Recognize both explicit and implicit tasks/habits
4. Prioritize based on urgency indicators and ADHD-friendly criteria
5. Suggest realistic time estimates considering ADHD time blindness
6. Identify patterns that could become helpful habits

EXTRACTION RULES:
- Tasks: One-time actions with clear outcomes
- Habits: Recurring behaviors for routine building
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
      "suggestedTime": "morning|afternoon|evening|anytime"
    }
  ],
  "habits": [
    {
      "title": "Simple habit name",
      "description": "Why this habit helps with ADHD",
      "frequency": "daily|weekly|custom",
      "scheduledTime": "HH:MM",
      "category": "health|productivity|self-care|routine"
    }
  ],
  "insights": {
    "overallMood": "stressed|neutral|motivated|overwhelmed",
    "suggestedFocus": "What to prioritize today",
    "warningFlags": ["List of concerns like overcommitment"]
  }
}`;

export const createUserPrompt = (brainDumpText: string): string => {
  return `Please analyze this brain dump from someone with ADHD and extract tasks and habits:

"${brainDumpText}"

Remember to:
- Be understanding of scattered thoughts
- Create actionable items even from vague ideas
- Suggest habits that could help with mentioned struggles
- Consider ADHD-specific challenges in your recommendations`;
};

// Specific prompts for different AI providers to optimize their responses
export const providerSpecificPrompts = {
  openai: {
    additionalInstructions: "Use your understanding of ADHD to be especially helpful. Focus on practical, achievable actions.",
  },
  claude: {
    additionalInstructions: "Apply your knowledge of executive function challenges to create supportive, non-judgmental suggestions.",
  },
  gemini: {
    additionalInstructions: "Consider neurodiversity perspectives and suggest accommodations that work with ADHD traits rather than against them.",
  },
};

// Post-processing helpers
export const validateAIResponse = (response: any): boolean => {
  return (
    response &&
    Array.isArray(response.tasks) &&
    Array.isArray(response.habits) &&
    response.tasks.every((task: any) => 
      task.title && 
      ['high', 'medium', 'low'].includes(task.priority) &&
      ['work', 'personal', 'health', 'communication', 'home', 'other'].includes(task.category)
    ) &&
    response.habits.every((habit: any) =>
      habit.title &&
      ['daily', 'weekly', 'custom'].includes(habit.frequency)
    )
  );
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
    .trim();

  return processed;
};