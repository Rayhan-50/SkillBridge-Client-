// ─── Feature 1: AI Content Generator ─────────────────────────────────────────
export type ContentType = "blog-post" | "caption" | "description" | "email";

export interface ContentGeneratorInput {
  topic: string;
  type: ContentType;
  tone?: "professional" | "casual" | "creative";
}

// ─── Feature 2: AI Smart Recommendations ─────────────────────────────────────
export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  score: number; // 0-100
  category?: string;
  tags?: string[];
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface RecommendationInput {
  preferences: string;
  history?: string;
  limit?: number;
}

// ─── Feature 3: AI Chat Assistant ────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
}

// ─── Feature 4: AI Data Analyzer ─────────────────────────────────────────────
export type Sentiment = "positive" | "neutral" | "negative";

export interface DataAnalysis {
  summary: string;
  keyInsights: string[];
  trends: string[];
  recommendations: string[];
  sentiment: Sentiment;
}

export interface DataAnalyzerInput {
  data: string;
  context?: string;
}

// ─── Feature 5: AI Auto Tagger / Classifier ──────────────────────────────────
export interface TagResult {
  tags: string[];
  category: string;
  confidence: number; // 0-1
}

export interface AutoTaggerInput {
  content: string;
}

// ─── Generic API Response Wrappers ───────────────────────────────────────────
export interface ApiSuccess<T> {
  result: T;
  error?: never;
}

export interface ApiError {
  error: string;
  result?: never;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── UI State Helpers ─────────────────────────────────────────────────────────
export type LoadingState = "idle" | "loading" | "streaming" | "success" | "error";
