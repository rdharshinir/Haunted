// ─── Topic & Challenge Database ───

export const TOPICS = [
  {
    id: 1,
    title: "What is an API?",
    keywords: ["interface","request","response","server","client","communicate","endpoint","data","service","connect"],
    hint: "Think about how two software systems talk to each other.",
    tanglishKey: "api",
  },
  {
    id: 2,
    title: "What is a for-loop?",
    keywords: ["repeat","iterate","loop","counter","condition","index","array","times","each","cycle"],
    hint: "Think about doing the same task multiple times.",
    tanglishKey: "forloop",
  },
  {
    id: 3,
    title: "What is machine learning?",
    keywords: ["data","pattern","learn","predict","train","model","algorithm","experience","improve","classify"],
    hint: "Think about how computers can learn from examples.",
    tanglishKey: "ml",
  },
  {
    id: 4,
    title: "What is a database?",
    keywords: ["store","data","table","query","record","organize","retrieve","information","structured","sql"],
    hint: "Think about where apps keep their information.",
    tanglishKey: "database",
  },
  {
    id: 5,
    title: "What is version control (Git)?",
    keywords: ["track","changes","commit","branch","history","collaborate","merge","repository","code","version"],
    hint: "Think about tracking changes in your code over time.",
    tanglishKey: "git",
  },
];

export const BOSS_CHALLENGES = [
  {
    id: "boss-1",
    unlocksAfterTopic: 3,
    title: "Build a BMI Calculator",
    description: "Write the logic for a BMI calculator that takes weight (kg) and height (cm), calculates BMI, and classifies the result as Underweight, Normal, Overweight, or Obese.",
    timeLimit: 300, // 5 minutes
    badge: {
      name: "Logic Architect",
      emoji: "🏗️",
      color: "#f59e0b",
      description: "Built a working BMI calculator under pressure",
    },
    requirements: [
      "Use the correct BMI formula: weight / (height_in_m)²",
      "Handle at least 4 BMI categories",
      "Include edge case handling (zero/negative values)",
    ],
    evaluationPrompt: `Evaluate this student's BMI calculator solution. Check if it:
1. Uses the correct formula: weight(kg) / height(m)^2
2. Classifies into at least 4 categories (Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese >=30)
3. Handles edge cases (zero or negative values)
Respond with JSON: {"passed": true/false, "score": 0-100, "feedback": "brief feedback"}`,
  },
  {
    id: "boss-2",
    unlocksAfterTopic: 5,
    title: "Write a Tanglish Tea-Order Bot Prompt",
    description: "Write a chatbot prompt that can take a tea order in Tanglish (Tamil+English). It should greet the customer, ask what type of tea, confirm the order, and give a price.",
    timeLimit: 180, // 3 minutes
    badge: {
      name: "Prompt Wizard",
      emoji: "🧙",
      color: "#8b5cf6",
      description: "Crafted an AI prompt that speaks Tanglish",
    },
    requirements: [
      "Include a Tanglish greeting",
      "Ask for tea type preference",
      "Confirm the order with price",
    ],
    evaluationPrompt: `Evaluate this student's Tanglish tea-order bot prompt. Check if it:
1. Includes a greeting in Tanglish (mix of Tamil and English)
2. Asks for tea type/preference
3. Includes order confirmation with price
Respond with JSON: {"passed": true/false, "score": 0-100, "feedback": "brief feedback"}`,
  },
];

export const DUEL_QUESTIONS = [
  {
    id: "dq1",
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Applied Program Integration", "Automatic Process Input", "Application Process Interface"],
    correct: 0,
    difficulty: 1,
  },
  {
    id: "dq2",
    question: "Which loop runs a known number of times?",
    options: ["while loop", "do-while loop", "for loop", "infinite loop"],
    correct: 2,
    difficulty: 1,
  },
  {
    id: "dq3",
    question: "What is training data in ML?",
    options: ["Code that trains the model", "Data used to teach the model", "Output of the model", "Bug-free data"],
    correct: 1,
    difficulty: 2,
  },
  {
    id: "dq4",
    question: "What does SQL stand for?",
    options: ["Simple Query Logic", "Structured Question Language", "Structured Query Language", "System Query Language"],
    correct: 2,
    difficulty: 2,
  },
  {
    id: "dq5",
    question: "What does 'git commit' do?",
    options: ["Deletes changes", "Saves a snapshot of changes", "Pushes to server", "Creates a new branch"],
    correct: 1,
    difficulty: 1,
  },
  {
    id: "dq6",
    question: "Which is NOT an HTTP method?",
    options: ["GET", "POST", "SEND", "DELETE"],
    correct: 2,
    difficulty: 2,
  },
  {
    id: "dq7",
    question: "What is an array?",
    options: ["A single value", "A collection of ordered values", "A type of loop", "A function"],
    correct: 1,
    difficulty: 1,
  },
  {
    id: "dq8",
    question: "What does 'git merge' do?",
    options: ["Deletes a branch", "Combines two branches", "Creates a commit", "Reverts changes"],
    correct: 1,
    difficulty: 2,
  },
];

export const MOOD_CONFIG = {
  CONFIDENT: { emoji: "😊", label: "Confident", cls: "mood-confident", color: "#22c55e" },
  CONFUSED:  { emoji: "😕", label: "Confused",  cls: "mood-confused",  color: "#f59e0b" },
  STRESSED:  { emoji: "😰", label: "Stressed",  cls: "mood-stressed",  color: "#ef4444" },
  BORED:     { emoji: "😴", label: "Bored",     cls: "mood-bored",     color: "#6366f1" },
};
