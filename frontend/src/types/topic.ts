export type TopicDomain = 'beauty' | 'food' | 'travel' | 'knowledge' | 'career' | 'entertainment' | 'health' | 'home' | 'digital' | 'pet' | 'parenting' | 'fitness' | 'healing';
export type TopicType = 'hot' | 'seasonal' | 'classic' | 'potential' | 'trend' | 'niche' | 'sharing' | 'tutorial' | 'review' | 'knowledge' | 'product' | 'practical' | 'emotional' | 'life' | 'fashion' | 'dupe';
export type TopicLevel = 'S' | 'A' | 'B' | 'C' | 'D';
export type TopicDirection = 'practical' | 'emotional' | 'product' | 'tutorial' | 'review' | 'sharing' | 'story' | 'anti-rat-race' | 'healing' | 'dupe-review' | 'side-hustle' | 'celebrity' | 'immersive' | 'knowledge';

export interface TopicAudience {
  age: string;
  gender: string;
  region: string;
}

export interface TopicEvaluation {
  userDemand: number;
  competition: number;
  innovation: number;
  selfMatch: number;
  total: number;
}

export interface Topic {
  name: string;
  type: TopicType;
  level: TopicLevel;
  description: string;
  evaluation: TopicEvaluation;
}

export interface TrendAnalysis {
  currentTrends: string[];
  crossPlatformTrends: string[];
  seasonalFactors: string[];
  userNeeds: string[];
}

export interface TopicSelectorRequest {
  domain: TopicDomain;
  audience: TopicAudience;
  direction: TopicDirection;
  requirements?: string;
}

export interface TopicSelectorResult {
  topics: Topic[];
  trendAnalysis: TrendAnalysis;
}

export interface TopicSelectorResponse {
  success: boolean;
  data?: TopicSelectorResult;
  error?: string;
  trendAnalysis?: TrendAnalysis;
}

export interface TopicHistoryItem {
  id: string;
  timestamp: number;
  domain: TopicDomain;
  audience: TopicAudience;
  direction: TopicDirection;
  result: TopicSelectorResult;
  trendAnalysis?: TrendAnalysis;
}
