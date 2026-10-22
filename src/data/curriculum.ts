import { Category, Lesson, Badge, DailyChallenge } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ai',
    name: 'AI Basics',
    tagline: 'Prompt engineering & practical LLM workflows',
    iconName: 'Cpu',
    gradient: 'from-violet-600 to-indigo-600',
    accentColor: '#8b5cf6'
  },
  {
    id: 'writing',
    name: 'Writing',
    tagline: 'Clear copy, persuasive emails & concise thoughts',
    iconName: 'PenTool',
    gradient: 'from-purple-600 to-pink-600',
    accentColor: '#c084fc'
  },
  {
    id: 'design',
    name: 'Design',
    tagline: 'UI/UX laws, visual hierarchy & color harmony',
    iconName: 'Palette',
    gradient: 'from-cyan-500 to-blue-600',
    accentColor: '#38bdf8'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    tagline: 'Time-boxing, cognitive focus & high-leverage habits',
    iconName: 'Zap',
    gradient: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b'
  },
  {
    id: 'general',
    name: 'General Knowledge',
    tagline: 'First principles, mental models & decision frameworks',
    iconName: 'Compass',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981'
  }
];

export const LESSONS: Lesson[] = [
  // AI BASICS
  {
    id: 'ai-prompt-rtc',
    categoryId: 'ai',
    title: 'The RTC Formula for Flawless Prompts',
    readTime: '3 min',
    summary: 'Why generic queries fail and how Role-Task-Context gives exact, high-precision answers.',
    sections: [
      {
        type: 'text',
        text: 'Most people treat AI chatbots like human search engines. They type single-line queries like "write a pitch deck" or "fix my code" and get bland, generic, or hallucinated responses.'
      },
      {
        type: 'rule',
        title: 'The RTC Framework',
        text: 'Structure every non-trivial prompt into 3 explicit layers:\n1. Role: Who is the AI simulating? ("Act as a senior frontend architect").\n2. Task: Imperative action verb with constraints ("Refactor this function to reduce time complexity to O(n)").\n3. Context: Inputs, target audience, format constraints ("Output clean TypeScript with zero external dependencies, followed by a 2-bullet summary").'
      },
      {
        type: 'example',
        title: 'Before & After Transformation',
        text: '❌ Poor: "Help me write an email to my manager asking to work remotely."\n\n✅ RTC Prompt: "Role: Executive career coach. Task: Write a concise 120-word email requesting 2 remote days per week. Context: I have hit all project milestones this quarter; highlight how uninterrupted sprint blocks will maintain team velocity. Tone: Professional and proactive."'
      },
      {
        type: 'text',
        text: 'By anchoring constraints up front, you avoid 80% of back-and-forth prompt iterations and guide the attention heads straight to domain-specific patterns.'
      }
    ],
    keyTakeaway: 'Always specify Role, Task, and Constraints before submitting your prompt.',
    xpReward: 35,
    quiz: [
      {
        id: 'ai-q1',
        question: 'Which crucial component is missing from: "Explain Docker containers to me"?',
        options: [
          'A subscription tier',
          'Target audience context and desired depth/analogy level',
          'Punctuation marks at the start',
          'A software license agreement'
        ],
        correctIndex: 1,
        explanation: 'The prompt does not state whether the explanation is for a 10-year-old, a business exec, or a senior DevOps engineer.'
      },
      {
        id: 'ai-q2',
        question: 'Why does setting an explicit "Role" improve LLM accuracy?',
        options: [
          'It clears the server cache window',
          'It primes the model attention weights toward domain-specific vocabulary and concepts',
          'It bypasses rate limit throttles',
          'It forces the model to use real-time internet search'
        ],
        correctIndex: 1,
        explanation: 'Role prompting sets the semantic space, steering probability distributions toward relevant professional terminology.'
      }
    ]
  },
  {
    id: 'ai-grounding-hallucinations',
    categoryId: 'ai',
    title: 'Taming AI Hallucinations With Grounding',
    readTime: '3 min',
    summary: 'Prevent models from fabricating citations, facts, and code by enforcing strict bounded context.',
    sections: [
      {
        type: 'text',
        text: 'Large language models are probabilistic token predictors, not database query engines. When asked about niche facts or obscure APIs, they often generate plausible-sounding falsehoods known as hallucinations.'
      },
      {
        type: 'rule',
        title: 'The Closed-Book Constraint',
        text: 'When accuracy matters, provide the source text directly inside the prompt and instruct the model: "Answer strictly using ONLY the provided text below. If the answer cannot be found in the excerpt, reply with \'Insufficient information\'."'
      },
      {
        type: 'example',
        title: 'Negative Constraint Directive',
        text: 'Include: "Do not extrapolate or assume unstated facts. Quote the exact line from the source that verifies each claim."'
      }
    ],
    keyTakeaway: 'Provide the reference context directly and mandate that the AI refuse to answer if unverified.',
    xpReward: 30,
    quiz: [
      {
        id: 'ai-h1',
        question: 'What is the primary cause of LLM hallucinations?',
        options: [
          'The model is trying to deceive the user',
          'The model predicts statistically probable tokens even when ground truth is absent',
          'The server is overheating',
          'The prompt contains more than 10 words'
        ],
        correctIndex: 1,
        explanation: 'LLMs generate text based on probability distributions of tokens rather than looking up verified real-world facts.'
      }
    ]
  },

  // WRITING
  {
    id: 'writing-bluf',
    categoryId: 'writing',
    title: 'BLUF: The Secret to High-Impact Communication',
    readTime: '3 min',
    summary: 'Bottom Line Up Front transforms verbose memos into clear, action-oriented directives.',
    sections: [
      {
        type: 'text',
        text: 'In professional and academic communication, readers decide whether to pay attention within 5 seconds. If you bury the key point in paragraph three, it will be skipped.'
      },
      {
        type: 'rule',
        title: 'Bottom Line Up Front (BLUF)',
        text: 'Originating in military briefings, BLUF inverts traditional academic storytelling:\n• Sentence 1: State the final decision, recommendation, or required action immediately.\n• Sentences 2-3: Provide the strongest supporting rationale or financial/time impact.\n• Final section: Next steps, explicit owner, and deadline.'
      },
      {
        type: 'example',
        title: 'Before & After Example',
        text: '❌ Typical: "We looked into various hosting providers over the last three weeks, evaluated AWS, GCP, and Cloudflare, attended several vendor demos, and concluded that..."\n\n✅ BLUF: "Recommendation: Migrate staging to Cloudflare Workers by Friday. This cuts monthly egress bills by 40% with zero downtime risk. Supporting breakdown below."'
      }
    ],
    keyTakeaway: 'Lead with the verdict or request, followed by concise supporting rationale.',
    xpReward: 30,
    quiz: [
      {
        id: 'w-q1',
        question: 'Where should the primary request or finding appear in a BLUF email?',
        options: [
          'In the very first sentence or opening line',
          'In the middle of the third paragraph',
          'Exclusively in an attached PDF',
          'In the email sign-off signature'
        ],
        correctIndex: 0,
        explanation: 'BLUF requires the bottom line to be presented immediately in line one.'
      },
      {
        id: 'w-q2',
        question: 'What is the main benefit of BLUF for busy readers?',
        options: [
          'It makes emails look longer and more impressive',
          'It allows readers to grasp the decision and act without decoding a wall of text',
          'It hides difficult news until the end',
          'It guarantees an automated response'
        ],
        correctIndex: 1,
        explanation: 'BLUF respects cognitive bandwidth and drives immediate alignment.'
      }
    ]
  },
  {
    id: 'writing-so-what',
    categoryId: 'writing',
    title: 'The "So What?" Razor for Persuasive Copy',
    readTime: '2 min',
    summary: 'Eliminate meaningless feature lists by continuously translating facts into tangible user benefits.',
    sections: [
      {
        type: 'text',
        text: 'Amateur writers list features; master communicators articulate outcomes. The fastest way to test your copy is the "So What?" Razor.'
      },
      {
        type: 'rule',
        title: 'The 3-Level Ladder',
        text: '• Feature: "Our app has local-first storage."\n• So What?: "Your data saves without a slow internet connection."\n• Ultimate Value: "You can study offline on the subway and never lose your streak."'
      }
    ],
    keyTakeaway: 'Never state a feature without explaining the emotional or practical benefit to the reader.',
    xpReward: 25,
    quiz: [
      {
        id: 'w-sw1',
        question: 'Applying the "So What?" Razor to "This battery is 5000mAh" yields:',
        options: [
          'It uses lithium polymer chemistry',
          'You can travel for two days without searching for a power outlet',
          'It weighs 140 grams',
          'It is manufactured in an automated plant'
        ],
        correctIndex: 1,
        explanation: 'Translating capacity into two full days of travel connects directly to user experience.'
      }
    ]
  },

  // DESIGN
  {
    id: 'design-603010',
    categoryId: 'design',
    title: 'The 60-30-10 Color Balance System',
    readTime: '3 min',
    summary: 'Stop guessing color palettes. Learn the interior design law that anchors modern UI aesthetics.',
    sections: [
      {
        type: 'text',
        text: 'Beginner UIs often suffer from "rainbow fatigue"—too many vibrant hues competing for visual attention, causing user confusion and eye strain.'
      },
      {
        type: 'rule',
        title: 'The 60-30-10 Ratio',
        text: '• 60% Dominant Base: Your canvas backdrop (e.g., deep obsidian #090D16 or cool slate #0F172A).\n• 30% Structural Secondary: Cards, sidebars, borders, and secondary text surfaces.\n• 10% Accent Powerhouse: Reserved exclusively for primary CTAs, active badges, and focus indicators (e.g. electric violet, cyan).'
      },
      {
        type: 'example',
        title: 'Why Accent Scarcity Works',
        text: 'When everything glows, nothing stands out. When only 10% of pixels carry vivid color, user eyes naturally gravitate toward the critical action button in milliseconds.'
      }
    ],
    keyTakeaway: 'Reserve high-saturation accent colors for only 10% of screen elements.',
    xpReward: 35,
    quiz: [
      {
        id: 'd-q1',
        question: 'Under the 60-30-10 rule, what should the 10% accent color be applied to?',
        options: [
          'The entire application background',
          'High-priority action buttons, badges, and progress milestones',
          'Every paragraph text block',
          'The footer copyright disclaimer'
        ],
        correctIndex: 1,
        explanation: 'Accent colors must remain scarce so primary CTAs and milestones stand out effortlessly.'
      },
      {
        id: 'd-q2',
        question: 'What is the primary visual risk of violating this ratio with too many bright colors?',
        options: [
          'Increased server download size',
          'Rainbow fatigue where the user cannot identify the main action',
          'CSS parser syntax failure',
          'Lower monitor refresh rate'
        ],
        correctIndex: 1,
        explanation: 'Competing high-saturation hues cause visual confusion and cognitive fatigue.'
      }
    ]
  },
  {
    id: 'design-touch-targets',
    categoryId: 'design',
    title: 'Mobile Ergonomics & 48px Touch Targets',
    readTime: '3 min',
    summary: 'Design interfaces that feel effortless on handheld touchscreens and prevent clumsy mistaps.',
    sections: [
      {
        type: 'text',
        text: 'Designing for mobile is not just shrinking a desktop website. Fingers are imprecise pointing instruments compared to mouse cursors.'
      },
      {
        type: 'rule',
        title: 'The 48x48 Rule & Thumb Zones',
        text: '• Minimum interactive tap target: 48x48 CSS pixels (or 44px min with padding).\n• Natural Thumb Zone: Place critical navigational tabs and primary buttons in the bottom half of the screen.\n• Safe Area Insets: Always accommodate gesture bars (`env(safe-area-inset-bottom)`).'
      }
    ],
    keyTakeaway: 'Ensure every interactive element has at least a 48px tap target and rests comfortably in the thumb reach zone.',
    xpReward: 30,
    quiz: [
      {
        id: 'd-tt1',
        question: 'What is the recommended minimum interactive tap target size for mobile UI buttons?',
        options: [
          '12x12 pixels',
          '24x24 pixels',
          '48x48 pixels',
          '120x120 pixels'
        ],
        correctIndex: 2,
        explanation: '48x48px (or 44px with margin) aligns with human finger pad contact area to avoid mistaps.'
      }
    ]
  },

  // PRODUCTIVITY
  {
    id: 'prod-two-minute',
    categoryId: 'productivity',
    title: 'The 2-Minute Rule to Crush Procrastination',
    readTime: '2 min',
    summary: 'Overcome cognitive friction and task-switching drag with David Allen’s micro-execution rule.',
    sections: [
      {
        type: 'text',
        text: 'Small unfinished tasks create disproportionate mental drag—a psychological phenomenon called the Zeigarnik Effect, where uncompleted chores silently drain working memory.'
      },
      {
        type: 'rule',
        title: 'The 2-Minute Gateway',
        text: 'If an incoming task takes less than 120 seconds to finish (e.g. archiving a file, responding with a quick confirmation, clearing a desk surface), execute it immediately instead of scheduling it.\n\nThe time spent tracking, cataloging, and worrying about a 90-second item far exceeds the effort of doing it on the spot.'
      }
    ],
    keyTakeaway: 'Execute sub-120-second chores immediately to prevent cognitive clutter.',
    xpReward: 25,
    quiz: [
      {
        id: 'p-q1',
        question: 'What is the core psychological reason to execute micro-tasks immediately?',
        options: [
          'It earns monetary dividends',
          'It eliminates the background cognitive drag of tracking unfinished items',
          'It eliminates the need for an alarm clock',
          'It speeds up typing speed'
        ],
        correctIndex: 1,
        explanation: 'Immediate resolution frees working memory from maintaining unresolved mental loops.'
      }
    ]
  },
  {
    id: 'prod-ultradian-rhythm',
    categoryId: 'productivity',
    title: 'Ultradian Sprints: Energy Over Time',
    readTime: '3 min',
    summary: 'Harness 90-minute biological focus peaks rather than grinding 8 hours in an unproductive haze.',
    sections: [
      {
        type: 'text',
        text: 'Human biology does not operate linearly. Just as sleep has 90-minute REM cycles, our waking brain cycles through ultradian rhythms of peak alert focus followed by fatigue.'
      },
      {
        type: 'rule',
        title: 'The 50/10 or 90/20 Protocol',
        text: '• Sprint Phase: 50 to 90 minutes of single-task deep focus with zero notifications.\n• Recovery Phase: 10 to 20 minutes of non-screen recovery (walk, hydrate, stare at the horizon).\n• Never compromise recovery: resting is where synaptic memory consolidation happens.'
      }
    ],
    keyTakeaway: 'Match intense intellectual sprints with genuine cognitive downtime.',
    xpReward: 30,
    quiz: [
      {
        id: 'p-ur1',
        question: 'During an ultradian rest break, which activity is most restorative for focus?',
        options: [
          'Scrolling fast social media feeds',
          'A short walk, hydration, or looking into the distance away from screens',
          'Answering 20 emails as fast as possible',
          'Playing a high-intensity mobile game'
        ],
        correctIndex: 1,
        explanation: 'True cognitive disengagement away from screens allows brain alertness systems to reset.'
      }
    ]
  },

  // GENERAL KNOWLEDGE
  {
    id: 'gen-first-principles',
    categoryId: 'general',
    title: 'First-Principles Thinking Demystified',
    readTime: '4 min',
    summary: 'Deconstruct thorny problems into irreducible physics instead of blindly copying what others do.',
    sections: [
      {
        type: 'text',
        text: 'Reasoning by analogy means copying what others do with slight tweaks. It generates incremental progress. First-principles thinking boils problems down to their most fundamental truths and reasons up from there.'
      },
      {
        type: 'rule',
        title: 'The 3-Step Deconstruction',
        text: '1. Identify current assumptions ("Starting an app requires $50k in server infrastructure").\n2. Break the problem into bedrock truths ("An app needs compute, state, and UI. Serverless platforms provide free tiers for small workloads").\n3. Reconstruct a solution from scratch using modern primitives.'
      },
      {
        type: 'example',
        title: 'Famous Historical Example',
        text: 'When Elon Musk bought rocket materials, aerospace contractors quoted tens of millions. He calculated the raw material cost of carbon fiber, aluminum, titanium, and fuel—discovering raw materials were only 2% of the quoted price. SpaceX built manufacturing in-house and cut launch costs by 90%.'
      }
    ],
    keyTakeaway: 'Challenge assumptions by separating immutable facts from inherited tradition.',
    xpReward: 40,
    quiz: [
      {
        id: 'g-q1',
        question: 'What is the main difference between reasoning by analogy and first principles?',
        options: [
          'Analogy copies existing patterns; first principles build up from bedrock truths',
          'First principles require an advanced mathematics degree',
          'Analogy is always illegal in business',
          'First principles only apply to astronomy'
        ],
        correctIndex: 0,
        explanation: 'Analogy relies on existing benchmarks, whereas first-principles builds up from fundamental realities.'
      },
      {
        id: 'g-q2',
        question: 'What is the first step when practicing first-principles thinking?',
        options: [
          'Hire an agency',
          'Identify and write down your existing assumptions',
          'Copy the market leader',
          'Apply for a trademark'
        ],
        correctIndex: 1,
        explanation: 'Clarifying assumptions is essential to separate what you know from what you have merely assumed.'
      }
    ]
  },
  {
    id: 'gen-inversion',
    categoryId: 'general',
    title: 'Inversion: Thinking Backwards to Win',
    readTime: '3 min',
    summary: 'Charlie Munger’s secret mental tool: Avoid stupidity rather than seeking brilliance.',
    sections: [
      {
        type: 'text',
        text: 'Mathematician Carl Jacobi famously advised: "Invert, always invert." Many hard problems are best solved when addressed backwards.'
      },
      {
        type: 'rule',
        title: 'How to Practice Inversion',
        text: 'Instead of asking: "How do I become an extraordinary student?", ask: "What behaviors guarantee I will fail my semester?"\nAnswers: Skipping sleep, leaving assignments to the last hour, never reviewing notes, constantly checking phone notifications.\nNow, systematically eliminate those failure modes.'
      }
    ],
    keyTakeaway: 'Avoiding obvious blunders yields higher compound returns than chasing brilliant strokes.',
    xpReward: 35,
    quiz: [
      {
        id: 'g-inv1',
        question: 'What is the core premise of Inversion as a mental model?',
        options: [
          'Always doing the exact opposite of what your parents say',
          'Identifying failure conditions and systematically eliminating them',
          'Reversing the order of words in an essay',
          'Relying entirely on intuition'
        ],
        correctIndex: 1,
        explanation: 'Inversion focuses on avoiding failure vectors, which is far more reliable than guessing brilliant shortcuts.'
      }
    ]
  }
];

export const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-ai-1',
    title: 'The Prompt Architect',
    categoryId: 'ai',
    description: 'Master the RTC framework and pass the prompt precision quiz with 100%.',
    targetXp: 35,
    completed: false,
    type: 'lesson',
    lessonRefId: 'ai-prompt-rtc'
  },
  {
    id: 'ch-design-1',
    title: 'Visual Balance Sprint',
    categoryId: 'design',
    description: 'Learn the 60-30-10 color allocation principle for mobile interfaces.',
    targetXp: 35,
    completed: false,
    type: 'lesson',
    lessonRefId: 'design-603010'
  },
  {
    id: 'ch-write-1',
    title: 'Bottom-Line Communication',
    categoryId: 'writing',
    description: 'Complete the BLUF writing breakdown and earn active communicator rank.',
    targetXp: 30,
    completed: false,
    type: 'lesson',
    lessonRefId: 'writing-bluf'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'First Spark',
    description: 'Completed your very first SkillSprint micro-lesson',
    icon: 'Flame',
    unlockedAt: null,
    requirement: '1 Completed Lesson',
    tier: 'bronze'
  },
  {
    id: 'badge-centurion',
    title: 'Century Club',
    description: 'Accumulated over 100 XP through deliberate practice',
    icon: 'Award',
    unlockedAt: null,
    requirement: '100 XP',
    tier: 'silver'
  },
  {
    id: 'badge-streak-fire',
    title: 'Daily Sprinter',
    description: 'Maintained a multi-day learning streak without missing a day',
    icon: 'Zap',
    unlockedAt: null,
    requirement: '2+ Day Streak',
    tier: 'silver'
  },
  {
    id: 'badge-polymath',
    title: 'The Polymath',
    description: 'Finished at least 3 lessons across distinct skill categories',
    icon: 'Layers',
    unlockedAt: null,
    requirement: '3 Categories Mastered',
    tier: 'gold'
  },
  {
    id: 'badge-quiz-ace',
    title: 'Quiz Ace',
    description: 'Scored 100% on 3 different lesson knowledge checks',
    icon: 'Target',
    unlockedAt: null,
    requirement: '3 Perfect Quizzes',
    tier: 'gold'
  },
  {
    id: 'badge-master-mind',
    title: 'Sprint Grandmaster',
    description: 'Reached Level 5 and accumulated over 400 XP',
    icon: 'Crown',
    unlockedAt: null,
    requirement: 'Level 5 (400 XP)',
    tier: 'diamond'
  }
];
