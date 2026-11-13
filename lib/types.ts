import type { FlowerId } from "./flowers";

export interface AnswerItem {
  question: string;
  answer: string;
}

export interface Analysis {
  flower: FlowerId;
  connection: string;
  who: string;
  strengths: string[];
  potential: string;
}

export interface ResultRecord {
  answers: AnswerItem[];
  analysis: Analysis | null;
  createdAt: string;
}

export interface ArchiveEntry {
  id: string;
  flower: FlowerId;
  createdAt: string;
}
