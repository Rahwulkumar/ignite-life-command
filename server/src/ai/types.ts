export type AiVisibleAgentId =
  | "commander"
  | "nova"
  | "marcus"
  | "atlas"
  | "aria"
  | "curator"
  | "operator";

export type AiInternalAgentId = "archivist" | "reviewer";

export type AiAgentId = AiVisibleAgentId | AiInternalAgentId;

export type AiMode = "direct" | "orchestrated";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiSelectedEntity {
  type: string;
  id?: string;
  label?: string;
  summary?: string;
}

export interface AiRunRequest {
  mode?: AiMode;
  agentId?: AiVisibleAgentId;
  messages: AiMessage[];
  currentPage?: string;
  selectedEntity?: AiSelectedEntity;
  contextHints?: string[];
  forceAgents?: AiVisibleAgentId[];
}

export interface AiTraceStep {
  id: string;
  agentId: AiAgentId;
  kind: "selection" | "context" | "specialist" | "review" | "synthesis";
  title: string;
  detail: string;
}

export interface AiRunResult {
  mode: AiMode;
  primaryAgentId: AiVisibleAgentId;
  selectedAgents: AiVisibleAgentId[];
  content: string;
  trace: AiTraceStep[];
}

export interface AiCatalogAgent {
  id: AiVisibleAgentId;
  name: string;
  role: string;
  description: string;
  domain: string;
  style: string;
}
