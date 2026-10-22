import { GoogleGenAI } from '@google/genai';

export interface AssistantResponse {
  answer: string;
  source: 'Curated Knowledge Base' | 'Gemini AI' | 'OpenAI API';
  suggestedAction?: string;
  categoryTag?: string;
}

interface KnowledgeEntry {
  triggers: string[];
  category: string;
  answer: string;
  suggestion: string;
}

const VAULT: KnowledgeEntry[] = [
  {
    triggers: ['prompt', 'formula', 'rtc', 'role', 'chatgpt', 'gemini', 'llm', 'few-shot', 'system prompt'],
    category: 'AI Basics',
    answer: `### The RTC Prompt Engineering Blueprint
To get reliable, high-tier output from any LLM, never ask bare questions. Anchor these 3 components:

1. **Role**: Prime the latent semantic space.
   • *"Act as a senior TypeScript developer and performance auditor."*
2. **Task**: Imperative instruction with strict boundaries.
   • *"Refactor the following memoized component to eliminate unnecessary re-renders."*
3. **Context & Constraints**: Explicit format, tone, and what to omit.
   • *"Return strictly the updated TypeScript code followed by a 3-bullet rationale. Do not write filler introductory text."*

**Pro-Tip**: Add a negative constraint (e.g., *"If you are uncertain about a library method, state 'Unverified' instead of guessing"*).`,
    suggestion: 'Try running a test prompt right now using Role + Task + Constraints.'
  },
  {
    triggers: ['write', 'email', 'bluf', 'copy', 'persuade', 'memo', 'message', 'active voice'],
    category: 'Writing',
    answer: `### The BLUF (Bottom Line Up Front) Technique
In the modern workplace, readers skim. If your core ask isn't visible in 4 seconds, attention drops by 80%.

**The 3-Step Structure**:
• **Line 1 (The Verdict)**: *"Request: Approve $1,200 travel budget for the AI Dev Summit by Friday 5 PM."*
• **Lines 2-4 (High-Leverage Proof)**: *"Attending gives us hands-on access to the upcoming API alpha, saving our team an estimated 2 weeks of engineering spike time."*
• **Line 5 (Owner & Next Step)**: *"I will handle booking as soon as you reply with 'Approved'."*

Avoid starting with: *"I hope this email finds you well"*, or 3 paragraphs of backstory.`,
    suggestion: 'Draft your next urgent message with the main request in the very first 10 words.'
  },
  {
    triggers: ['design', 'color', '60-30-10', 'ui', 'contrast', 'dark mode', 'typography', 'spacing'],
    category: 'Design',
    answer: `### The 60-30-10 Color Allocation System
Professional dark-mode aesthetics depend on scarcity, not an explosion of neon colors.

• **60% Dominant Base**: Neutral deep canvas (e.g., #090D16 obsidian).
• **30% Structural Secondary**: Card surfaces, border dividers, and muted text (#0F172A slate & indigo tint).
• **10% High-Voltage Accent**: Electric Violet or Cyan reserved strictly for:
  - Primary Call-To-Action buttons
  - Active navigation state indicator
  - Milestone unlock badges

**Golden Rule**: If you make everything glow, nothing has visual importance.`,
    suggestion: 'Inspect your favorite mobile app: notice how only 1-2 elements per screen use high saturation.'
  },
  {
    triggers: ['procrastinat', 'focus', 'productivity', 'pomodoro', 'time', 'distraction', '2-minute', 'habit'],
    category: 'Productivity',
    answer: `### The 2-Minute Gateway & Ultradian Sprints
To eliminate cognitive inertia:

1. **The 2-Minute Gateway**: If a chore takes under 120 seconds (replying with a date, filing a paper, committing code), execute it right now. The mental tax of keeping it in memory is greater than doing it.
2. **50/10 Ultradian Sprints**:
   - 50 minutes of solitary single-tasking with phone in another room.
   - 10 minutes of non-screen recovery (drink water, walk, look 20+ feet away).
3. **The Interruption Scratchpad**: Keep a physical piece of paper next to you. When a random urge pops into your head ("look up that shoe brand"), write it down and stay in flow.`,
    suggestion: 'Start a 25-minute sprint right now on your single highest-leverage task.'
  },
  {
    triggers: ['first principles', 'mental model', 'inversion', 'thinking', 'logic', 'problem', 'decision'],
    category: 'General Knowledge',
    answer: `### First-Principles & Inversion Thinking
Master thinkers do not reason by analogy ("everybody else does it this way").

**Two Core Mental Tools**:
1. **First Principles (Deconstruct to Physics)**:
   - Ask: *"What are the irreducible truths here?"*
   - Strip away convention, tradition, and inherited assumptions.
2. **Inversion (Avoid Stupidity)**:
   - Instead of asking *"How do I make my app a massive hit?"*, ask *"What guarantees this project will be abandoned in 2 weeks?"*
   - Answers: Scope creep, messy spaghetti code, neglecting mobile ergonomics, never shipping.
   - Systematically avoid those failure modes.`,
    suggestion: 'List 3 assumptions you are making about your current project and test their validity.'
  }
];

export async function askLearningAssistant(
  query: string,
  userApiKey?: string
): Promise<AssistantResponse> {
  const clean = query.trim().toLowerCase();

  // 1. If user provided their own key (OpenAI sk- or Gemini)
  if (userApiKey && userApiKey.trim()) {
    const key = userApiKey.trim();

    // Check if it's a Gemini Key
    if (key.startsWith('AIza') || key.length >= 35) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are SkillSprint's high-impact learning tutor for students and beginners. Answer with practical, structured, bulleted advice in 150 words or less.\n\nUser Question: ${query}`
        });

        if (response.text) {
          return {
            answer: response.text,
            source: 'Gemini AI',
            suggestedAction: 'Save this insight or test it immediately in your daily sprint.',
            categoryTag: 'AI Powered'
          };
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to curated vault:', err);
      }
    }

    // Check if it's an OpenAI key
    if (key.startsWith('sk-')) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are SkillSprint\'s expert skill tutor for students. Answer with practical, high-impact bulleted advice in under 140 words.'
              },
              { role: 'user', content: query }
            ],
            max_tokens: 220,
            temperature: 0.7
          })
        });

        if (res.ok) {
          const data = await res.json();
          const answer = data.choices?.[0]?.message?.content;
          if (answer) {
            return {
              answer,
              source: 'OpenAI API',
              suggestedAction: 'Apply this method to today\'s learning challenge.',
              categoryTag: 'Live LLM'
            };
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to curated vault:', err);
      }
    }
  }

  // 2. Curated Heuristic Matcher (100% Offline, Instant, Private)
  for (const entry of VAULT) {
    if (entry.triggers.some(t => clean.includes(t))) {
      return {
        answer: entry.answer,
        source: 'Curated Knowledge Base',
        suggestedAction: entry.suggestion,
        categoryTag: entry.category
      };
    }
  }

  // 3. Fallback smart framework
  return {
    answer: `### Core Skill Sprint Framework for "${query.slice(0, 35)}..."
When tackling any new concept or skill, apply the **3-Prong Sprint Loop**:

1. **Irreducible Principle**: Strip the skill to its minimum viable mechanism.
2. **Immediate Frictionless Drill**: Run a 5-minute timed test with rapid feedback.
3. **Retention Anchor**: Teach the core takeaway in 2 sentences to another person.

*Try asking about specific topics:* **"Prompt Formula"**, **"BLUF Writing"**, **"60-30-10 Design"**, **"Beat Procrastination"**, or **"First Principles"**.`,
    source: 'Curated Knowledge Base',
    suggestedAction: 'Pick one of our interactive lessons in the Learn tab to dive deeper.',
    categoryTag: 'SkillSprint Vault'
  };
}
