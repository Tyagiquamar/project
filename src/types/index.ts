export interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  createdAt: number;
  isActive: boolean;
}

export interface Answer {
  pollId: string;
  studentId: string;
  selectedOption: string;
  submittedAt: number;
}

export interface Student {
  id: string;
  name: string;
}

export interface PollResults {
  pollId: string;
  results: Record<string, number>;
  totalResponses: number;
}