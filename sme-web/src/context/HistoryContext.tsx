import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type GeneratedQuestion = {
  id: string;
  format: string;
  difficulty: string;
  stem: string;
  options?: string[];
  correct?: number | number[] | string;
  rubric?: string;
};

export type HistorySessionSettings = {
  project: string;
  topic: string;
  formats: string[];
  distribution: Record<string, number>;
  quantity: number;
  difficulty: number;
};

export type HistorySession = {
  id: string;
  title: string;
  questions: GeneratedQuestion[];
  settings?: HistorySessionSettings;
};

type HistoryContextValue = {
  historySessions: HistorySession[];
  activeHistoryId: string | null;
  activeHistory: HistorySession | null;
  resetVersion: number;
  selectHistory: (id: string) => void;
  resetGenerator: () => void;
  addHistorySession: (title: string, questions: GeneratedQuestion[], settings?: HistorySessionSettings) => void;
};

const SINGLE_MCQ = 'Multiple Choice (Single Answer)';
const MULTI_MCQ = 'Multiple Choice (Multiple Answer)';
const TRUE_FALSE = 'True / False';
const FILL_BLANK = 'Fill in the Blank';
const OPEN_ENDED = 'Open-Ended / Short Answer';
const SCENARIO = 'Scenario-Based / Case Study';

const NURSING_SETTINGS: HistorySessionSettings = {
  project: 'p1',
  topic: 'Cardiac physiology for a Level 2 nursing certification exam',
  formats: [SINGLE_MCQ, TRUE_FALSE, FILL_BLANK],
  distribution: {
    [SINGLE_MCQ]: 4,
    [TRUE_FALSE]: 3,
    [FILL_BLANK]: 2,
  },
  quantity: 9,
  difficulty: 1,
};

const LAW_SETTINGS: HistorySessionSettings = {
  project: 'p1',
  topic: 'United States constitutional law and legal research methods',
  formats: [MULTI_MCQ, OPEN_ENDED, SCENARIO],
  distribution: {
    [MULTI_MCQ]: 3,
    [OPEN_ENDED]: 2,
    [SCENARIO]: 1,
  },
  quantity: 6,
  difficulty: 2,
};

const NURSING_HISTORY_QUESTIONS: GeneratedQuestion[] = [
  {
    id: 'nursing-mcq-1',
    format: SINGLE_MCQ,
    difficulty: 'Medium',
    stem: 'In cardiac physiology, which finding should a nurse prioritize when assessing a patient with shortness of breath?',
    options: ['Mild fatigue', 'Oxygen saturation of 84%', 'Intermittent nausea', 'Pain score of 3 out of 10'],
    correct: 1,
  },
  {
    id: 'nursing-mcq-2',
    format: SINGLE_MCQ,
    difficulty: 'Medium',
    stem: 'Which structure acts as the heart\'s natural pacemaker by initiating the electrical impulse?',
    options: ['AV node', 'SA node', 'Bundle branches', 'Purkinje fibers'],
    correct: 1,
  },
  {
    id: 'nursing-mcq-3',
    format: SINGLE_MCQ,
    difficulty: 'Medium',
    stem: 'A patient has new confusion, cool skin, and low blood pressure. Which concern best fits these findings?',
    options: ['Improved perfusion', 'Reduced cardiac output', 'Normal oxygen exchange', 'Expected medication response'],
    correct: 1,
  },
  {
    id: 'nursing-mcq-4',
    format: SINGLE_MCQ,
    difficulty: 'Medium',
    stem: 'Which assessment is most useful for detecting early respiratory compromise in a cardiac patient?',
    options: ['Appetite pattern', 'Oxygen saturation trend', 'Skin turgor', 'Sleep preference'],
    correct: 1,
  },
  {
    id: 'nursing-tf-1',
    format: TRUE_FALSE,
    difficulty: 'Medium',
    stem: 'The left ventricle pumps oxygenated blood to the systemic circulation.',
    correct: 'True',
  },
  {
    id: 'nursing-tf-2',
    format: TRUE_FALSE,
    difficulty: 'Medium',
    stem: 'The right ventricle pumps oxygenated blood directly to the brain.',
    correct: 'False',
  },
  {
    id: 'nursing-tf-3',
    format: TRUE_FALSE,
    difficulty: 'Medium',
    stem: 'A falling oxygen saturation can be an early sign of worsening cardiopulmonary status.',
    correct: 'True',
  },
  {
    id: 'nursing-fill-1',
    format: FILL_BLANK,
    difficulty: 'Medium',
    stem: 'The first step before administering medication is to verify the patient\'s _____.',
    correct: 'identity',
  },
  {
    id: 'nursing-fill-2',
    format: FILL_BLANK,
    difficulty: 'Medium',
    stem: 'A focused respiratory assessment should include rate, rhythm, effort, and _____.',
    correct: 'oxygen saturation',
  },
];

const LAW_HISTORY_QUESTIONS: GeneratedQuestion[] = [
  {
    id: 'law-multi-1',
    format: MULTI_MCQ,
    difficulty: 'Hard',
    stem: 'Which TWO sources are most useful when confirming whether a federal constitutional rule is binding?',
    options: ['A controlling court opinion', 'A citation history report', 'A social media thread', 'An unrelated contract template'],
    correct: [0, 1],
  },
  {
    id: 'law-multi-2',
    format: MULTI_MCQ,
    difficulty: 'Hard',
    stem: 'Which TWO actions should a researcher take before relying on an older constitutional case?',
    options: ['Check later citing decisions', 'Review negative treatment signals', 'Ignore procedural history', 'Use only the case summary'],
    correct: [0, 1],
  },
  {
    id: 'law-multi-3',
    format: MULTI_MCQ,
    difficulty: 'Hard',
    stem: 'Which TWO materials are usually treated as persuasive rather than binding authority?',
    options: ['Law review article', 'Treatise section', 'Controlling Supreme Court holding', 'Valid federal statute'],
    correct: [0, 1],
  },
  {
    id: 'law-open-1',
    format: OPEN_ENDED,
    difficulty: 'Hard',
    stem: 'Explain how preemption affects the relationship between a valid federal statute and a conflicting state law.',
    rubric: 'Credit answers that identify the Supremacy Clause, describe conflict between federal and state law, and explain when state law must yield.',
  },
  {
    id: 'law-open-2',
    format: OPEN_ENDED,
    difficulty: 'Hard',
    stem: 'Describe why checking subsequent case history is necessary before citing a case as good law.',
    rubric: 'Credit answers that discuss later reversal, overruling, distinguishing, negative treatment, and reliability of cited authority.',
  },
  {
    id: 'law-scenario-1',
    format: SCENARIO,
    difficulty: 'Hard',
    stem: 'A researcher finds an old circuit case supporting a constitutional claim, but the case has several negative treatment flags. What should the researcher do before using it?',
    rubric: 'Credit answers that require reviewing the negative treatment, checking controlling authority, and explaining whether the case can still be relied on.',
  },
];

const DEFAULT_HISTORY: HistorySession[] = [
  {
    id: 'nursing-advance-test',
    title: 'nursing_advance_test',
    questions: NURSING_HISTORY_QUESTIONS,
    settings: NURSING_SETTINGS,
  },
  {
    id: 'law-resarch',
    title: 'law_resarch',
    questions: LAW_HISTORY_QUESTIONS,
    settings: LAW_SETTINGS,
  },
];

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historySessions, setHistorySessions] = useState<HistorySession[]>(DEFAULT_HISTORY);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [resetVersion, setResetVersion] = useState(0);

  const activeHistory = useMemo(
    () => historySessions.find(session => session.id === activeHistoryId) ?? null,
    [activeHistoryId, historySessions],
  );

  const selectHistory = useCallback((id: string) => {
    setActiveHistoryId(current => (current === id ? null : id));
  }, []);

  const resetGenerator = useCallback(() => {
    setActiveHistoryId(null);
    setResetVersion(current => current + 1);
  }, []);

  const addHistorySession = useCallback((title: string, questions: GeneratedQuestion[], settings?: HistorySessionSettings) => {
    const id = `${title}-${Date.now()}`;
    setHistorySessions(current => [
      { id, title, questions, settings },
      ...current,
    ]);
    setActiveHistoryId(id);
  }, []);

  const value = useMemo(
    () => ({ historySessions, activeHistoryId, activeHistory, resetVersion, selectHistory, resetGenerator, addHistorySession }),
    [activeHistory, activeHistoryId, addHistorySession, historySessions, resetGenerator, resetVersion, selectHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistorySessions() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistorySessions must be used inside HistoryProvider');
  }
  return context;
}
