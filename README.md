# Brain Dump

Dump your thoughts in plain text and let an LLM sort them into tasks, habits and schedules.

**Version:** 0.1.0
**Status:** Active development

## What it does

Most planning tools want structured input: a title, a due date, a priority, a project. Thoughts do not arrive that way. This closes that gap.

Type out whatever's in your brain - messy, unstructured, stream of consciousness. The app uses AI (OpenAI, Claude, or Gemini) to parse your chaos and organize it into:
- Actionable tasks with priorities and time estimates
- Habits you want to build
- Calendar events
- Sleep schedule tracking

Then it gives you tools to actually follow through: task boards, habit streaks, and a clean interface that won't overwhelm you at 3pm when your brain is fried.

## Setup

**Requirements:**
- Node.js 16 or higher
- npm
- API key from OpenAI, Anthropic (Claude), or Google (Gemini)

**Installation:**

```bash
# Clone the repo
git clone https://github.com/mblauberg/brain-dump-app.git
cd brain-dump-app

# Install dependencies (uses legacy flag for React 19 peer deps)
npm install --legacy-peer-deps

# Create your environment file
cp .env.example .env

# Add your API key to .env
# REACT_APP_OPENAI_API_KEY=your-key-here
# OR REACT_APP_CLAUDE_API_KEY=your-key-here
# OR REACT_APP_GEMINI_API_KEY=your-key-here

# Start the dev server
npm start
```

Open http://localhost:3000. The app will guide you through configuring your AI provider on first launch.

**Build for production:**
```bash
npm run build
```

Outputs to `build/` directory. Deploy it anywhere that hosts static sites.

## How to use it

The main feature is the brain dump area at the top. Click in and type whatever you're thinking about:

```
need to email sarah about the project
also buy groceries tomorrow
and i should really start working out again 3x per week
sleep has been terrible lately
```

Hit submit. The AI processes it and creates:
- Task: "Email Sarah about the project" (medium priority, 15 min estimate)
- Task: "Buy groceries" (with tomorrow's date)
- Habit: "Work out" (3x per week frequency)
- Prompt to log your sleep quality

Everything appears in the sections below, where you can edit, complete, or reorganize it.

## Features

**Task management:**
- Visual cards showing priority, time estimate, and energy level
- Drag-and-drop kanban board
- Bulk operations (complete, delete, reschedule multiple tasks)
- Task templates for recurring work

**Habit tracking:**
- Daily check-ins with streak counters
- Completion history and statistics
- Works on mobile with quick-tap interface

**Sleep tracking:**
- Log your sleep quality (1-10 scale)
- Track when you actually went to bed vs when you planned to
- See patterns over time

**Calendar view:**
- Week or agenda view of upcoming tasks
- Habit reminders integrated with task schedule
- Color-coded by priority

The interface adapts based on your energy level and cognitive load. When you're tired or overwhelmed, it automatically hides details and shows fewer options.

## Tech stack

Built with React 19 and TypeScript. State management uses Zustand (simple, fast, no boilerplate). Styling is Tailwind CSS.

**Key dependencies:**
- `@dnd-kit` - Accessible drag and drop (for task boards)
- `@headlessui/react` - Unstyled accessible UI components
- `date-fns` - Date manipulation
- `@anthropic-ai/sdk` - Claude API integration
- `openai` - GPT-3.5/4 integration
- `@google/generative-ai` - Gemini integration

The AI integration is real and live. You need an API key to use the brain dump feature, but tasks and habits work fine without it.

## Configuration

After starting the app, go to Settings to configure:

**AI Settings:**
- Choose your provider (OpenAI, Claude, or Gemini)
- Enter your API key
- Select which model to use
- Toggle response caching (saves on API costs)

**Personal Settings:**
- Working hours and peak energy times
- Notification preferences
- Theme and accessibility options

The app stores everything locally in your browser. No backend, no database, no accounts.

## Common issues

**"npm install" fails:**
Use the `--legacy-peer-deps` flag. React 19 has some peer dependency conflicts that are safe to ignore.

**AI processing returns an error:**
Check that you've entered a valid API key in Settings. The free tier limits on AI providers can also cause issues if you've hit your quota.

**Tasks not saving:**
The app uses localStorage. If you're in incognito/private mode, data won't persist between sessions.

**Build warnings about unused variables:**
These are fixed in the latest commit. Run `git pull` to update.

## Development

**Run tests:**
```bash
npm test
```

**Type checking:**
```bash
npm run build
```

TypeScript errors will show up during the build process.

**Project structure:**
```
src/
├── components/      # React components
│   ├── Layout/      # App shell and navigation
│   ├── Tasks/       # Task management
│   ├── Habits/      # Habit tracking
│   ├── BrainDump/   # AI-powered input
│   ├── Glass/       # Reusable glassmorphism components
│   └── Sections/    # Page sections
├── services/        # AI integration and utilities
│   └── ai/          # Provider-specific implementations
├── stores/          # Zustand state management
└── types/           # TypeScript definitions
```

The main entry point is `App.tsx`, which renders `ScrollLayout`. Brain dump processing happens in `services/aiService.ts`.

## Contributing

This is a personal project, but if you want to submit a PR for bug fixes or features, go ahead. Open an issue first if it's a big change.

## Why this exists

Most productivity apps assume the organising is already done — that you arrive knowing what the task is, when it is due and how it ranks. The work of turning a tangle of half-formed thoughts into that structure is the part they leave to you, and it is the part that stops people using them.

So the input here is deliberately unstructured: one text box, no fields, no required format. Type it the way you thought it. The model does the parsing, and you keep the output.

The interface also adapts to declared energy level, hiding detail and reducing options when you have flagged that you are running low. Structure should not become another thing to maintain.

## License

MIT. Use it however you want.

---

MIT licensed. Built as a personal project.
