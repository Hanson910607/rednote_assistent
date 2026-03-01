import type { TrendAnalysis } from './topic';

export type CopywriterType = 'life' | 'fashion' | 'knowledge' | 'product' | 'emotional' | 'career' | 'entertainment' | 'pet' | 'parenting' | 'fitness' | 'healing' | 'dupe';
export type CopywriterStyle = 'simple' | 'professional' | 'emotional' | 'cute' | 'luxury' | 'grounded' | 'humorous' | 'bestie' | 'zhongcao' | 'anti-common' | 'immersive';

export interface CopywriterRequest {
  type: CopywriterType;
  style: CopywriterStyle;
  topic: string;
  requirements?: string;
}

export interface ViralAnalysis {
  level: 'S' | 'A' | 'B' | 'C' | 'D';
  score: number;
  advantages: string[];
  disadvantages: string[];
  suggestions: string[];
}

export interface CopywriterResult {
  titles: string[];
  content: string;
  emojis: string[];
  hashtags: string[];
  analysis: ViralAnalysis;
  compliance?: { isCompliant: boolean; warnings: string[] };
}

export interface CopywriterResponse {
  success: boolean;
  data?: CopywriterResult;
  error?: string;
}

export interface CopywriterHistoryItem {
  id: string;
  timestamp: number;
  type: CopywriterType;
  style: CopywriterStyle;
  topic: string;
  result: CopywriterResult;
  trendAnalysis?: TrendAnalysis;
}
