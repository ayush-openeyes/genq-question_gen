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

export type HistorySession = {
  id: string;
  title: string;
  questions: GeneratedQuestion[];
};

type HistoryContextValue = {
  historySessions: HistorySession[];
  activeHistoryId: string | null;
  activeHistory: HistorySession | null;
  selectHistory: (id: string) => void;
  addHistorySession: (title: string, questions: GeneratedQuestion[]) => void;
};

const DEMO_HISTORY_QUESTIONS: GeneratedQuestion[] = [
      {
        id: 'demo-mcq-1',
        format: 'Multiple Choice (Single Answer)',
        difficulty: 'Medium',
        stem: 'A nurse is monitoring a patient with shortness of breath. Which finding should be escalated first?',
        options: ['Mild fatigue', 'Oxygen saturation of 84%', 'Intermittent nausea', 'Pain score of 3 out of 10'],
        correct: 1,
      },
      {
        id: 'demo-mcq-2',
        format: 'Multiple Choice (Single Answer)',
        difficulty: 'Easy',
        stem: 'Which practice best supports infection prevention before a wound dressing change?',
        options: ['Lowering room temperature', 'Performing hand hygiene', 'Offering oral fluids', 'Documenting pain score'],
        correct: 1,
      },
      {
        id: 'demo-mcq-3',
        format: 'Multiple Choice (Single Answer)',
        difficulty: 'Hard',
        stem: 'Which assessment finding most strongly suggests reduced cardiac output?',
        options: ['Warm dry skin', 'Bounding peripheral pulses', 'New confusion with hypotension', 'Respiratory rate of 16'],
        correct: 2,
      },
      {
        id: 'demo-mcq-4',
        format: 'Multiple Choice (Single Answer)',
        difficulty: 'Medium',
        stem: 'Which instruction is most important before collecting a clean-catch urine specimen?',
        options: ['Avoid drinking water', 'Clean the urethral area first', 'Use the first morning sample only', 'Keep the specimen at room temperature for 24 hours'],
        correct: 1,
      },
      {
        id: 'demo-mcq-5',
        format: 'Multiple Choice (Single Answer)',
        difficulty: 'Medium',
        stem: 'Which branch of the United States government has authority to interpret federal law?',
        options: ['Legislative branch', 'Executive branch', 'Judicial branch', 'State governments'],
        correct: 2,
      },
      {
        id: 'demo-tf-1',
        format: 'True / False',
        difficulty: 'Easy',
        stem: 'The Bill of Rights refers to the first ten amendments to the United States Constitution.',
        correct: 'True',
      },
      {
        id: 'demo-tf-2',
        format: 'True / False',
        difficulty: 'Medium',
        stem: 'Federal statutes can never preempt state laws under the Supremacy Clause.',
        correct: 'False',
      },
      {
        id: 'demo-tf-3',
        format: 'True / False',
        difficulty: 'Easy',
        stem: 'Hand hygiene should be performed before and after direct patient contact.',
        correct: 'True',
      },
      {
        id: 'demo-tf-4',
        format: 'True / False',
        difficulty: 'Medium',
        stem: 'A Likert scale usually captures the degree of agreement or frequency on an ordered scale.',
        correct: 'True',
      },
      {
        id: 'demo-tf-5',
        format: 'True / False',
        difficulty: 'Hard',
        stem: 'In research design, a larger sample always removes every possible source of bias.',
        correct: 'False',
      },
      {
        id: 'demo-fill-1',
        format: 'Fill in the Blank',
        difficulty: 'Easy',
        stem: 'The first step before administering medication is to verify the patient\'s _____.',
        correct: 'identity',
      },
      {
        id: 'demo-fill-2',
        format: 'Fill in the Blank',
        difficulty: 'Medium',
        stem: 'A focused respiratory assessment should include rate, rhythm, effort, and _____.',
        correct: 'oxygen saturation',
      },
      {
        id: 'demo-fill-3',
        format: 'Fill in the Blank',
        difficulty: 'Medium',
        stem: 'In a research report, the section that describes how data was collected is the _____.',
        correct: 'methodology',
      },
];

const DEFAULT_HISTORY: HistorySession[] = [
  {
    id: 'nursing-advance-test',
    title: 'nursing_advance_test',
    questions: DEMO_HISTORY_QUESTIONS,
  },
  {
    id: 'law-resarch',
    title: 'law_resarch',
    questions: DEMO_HISTORY_QUESTIONS.map(question => ({
      ...question,
      id: question.id.replace('demo-', 'law-'),
    })),
  },
];

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historySessions, setHistorySessions] = useState<HistorySession[]>(DEFAULT_HISTORY);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const activeHistory = useMemo(
    () => historySessions.find(session => session.id === activeHistoryId) ?? null,
    [activeHistoryId, historySessions],
  );

  const selectHistory = useCallback((id: string) => {
    setActiveHistoryId(current => (current === id ? null : id));
  }, []);

  const addHistorySession = useCallback((title: string, questions: GeneratedQuestion[]) => {
    const id = `${title}-${Date.now()}`;
    setHistorySessions(current => [
      { id, title, questions },
      ...current,
    ]);
    setActiveHistoryId(id);
  }, []);

  const value = useMemo(
    () => ({ historySessions, activeHistoryId, activeHistory, selectHistory, addHistorySession }),
    [activeHistory, activeHistoryId, addHistorySession, historySessions, selectHistory],
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
