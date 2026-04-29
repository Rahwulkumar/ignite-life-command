import type { DomainId } from "@/lib/domains";
import type { Json } from "@/lib/types";
import type { MetricsData } from "@/types/domain";

export type NoteType =
  | "hub"
  | "page"
  | "journal"
  | "folder"
  | "character";

export interface ApiNoteRecord {
  id: string;
  userId: string;
  title: string;
  content: Json | null;
  parentId: string | null;
  icon: string | null;
  coverImage: string | null;
  isPinned: boolean | null;
  isTemplate: boolean | null;
  domain: DomainId | null;
  noteType: NoteType | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface NoteRecord {
  id: string;
  user_id: string;
  title: string;
  content: Json | null;
  parent_id: string | null;
  icon: string | null;
  cover_image: string | null;
  is_pinned: boolean | null;
  is_template: boolean | null;
  domain: DomainId | null;
  note_type: NoteType | null;
  created_at: string | null;
  updated_at: string | null;
}

export function normalizeNote(note: ApiNoteRecord): NoteRecord {
  return {
    id: note.id,
    user_id: note.userId,
    title: note.title,
    content: note.content,
    parent_id: note.parentId,
    icon: note.icon,
    cover_image: note.coverImage,
    is_pinned: note.isPinned,
    is_template: note.isTemplate,
    domain: note.domain,
    note_type: note.noteType,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

export interface ApiChecklistEntry {
  id: string;
  userId: string;
  taskId: string;
  entryDate: string;
  isCompleted: boolean;
  status: "pending" | "completed" | "missed" | "skipped";
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  notes: string | null;
  journalNoteId: string | null;
  promptedAt: string | null;
  answeredAt: string | null;
  responseSource: string | null;
  metricsData: MetricsData | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistEntryRecord {
  id: string;
  user_id: string;
  task_id: string;
  entry_date: string;
  is_completed: boolean;
  status: "pending" | "completed" | "missed" | "skipped";
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  journal_note_id: string | null;
  prompted_at: string | null;
  answered_at: string | null;
  response_source: string | null;
  metrics_data: MetricsData;
  created_at: string;
  updated_at: string;
}

export function normalizeChecklistEntry(
  entry: ApiChecklistEntry,
): ChecklistEntryRecord {
  return {
    id: entry.id,
    user_id: entry.userId,
    task_id: entry.taskId,
    entry_date: entry.entryDate,
    is_completed: entry.isCompleted,
    status: entry.status,
    started_at: entry.startedAt,
    ended_at: entry.endedAt,
    duration_seconds: entry.durationSeconds,
    notes: entry.notes,
    journal_note_id: entry.journalNoteId,
    prompted_at: entry.promptedAt,
    answered_at: entry.answeredAt,
    response_source: entry.responseSource,
    metrics_data: entry.metricsData ?? {},
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  };
}

export type TaskMetricFieldType =
  | "number"
  | "text"
  | "rating"
  | "boolean"
  | "duration";

export interface ApiTaskMetric {
  id: string;
  userId: string;
  taskId: string;
  label: string;
  fieldType: TaskMetricFieldType;
  unit: string | null;
  orderIndex: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskMetricRecord {
  id: string;
  user_id: string;
  task_id: string;
  label: string;
  field_type: TaskMetricFieldType;
  unit: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function normalizeTaskMetric(metric: ApiTaskMetric): TaskMetricRecord {
  return {
    id: metric.id,
    user_id: metric.userId,
    task_id: metric.taskId,
    label: metric.label,
    field_type: metric.fieldType,
    unit: metric.unit,
    order_index: metric.orderIndex ?? 0,
    created_at: metric.createdAt,
    updated_at: metric.updatedAt,
  };
}

export interface ApiScriptureVerse {
  id: string;
  userId: string;
  reference: string;
  verseText: string;
  masteryLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptureVerseRecord {
  id: string;
  user_id: string;
  reference: string;
  verse_text: string;
  mastery_level: number;
  created_at: string;
  updated_at: string;
}

export function normalizeScriptureVerse(
  verse: ApiScriptureVerse,
): ScriptureVerseRecord {
  return {
    id: verse.id,
    user_id: verse.userId,
    reference: verse.reference,
    verse_text: verse.verseText,
    mastery_level: verse.masteryLevel ?? 0,
    created_at: verse.createdAt,
    updated_at: verse.updatedAt,
  };
}

export interface ApiDailyFocus {
  id: string;
  userId: string;
  date: string;
  reference: string;
  content: string;
  completed: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyFocusRecord {
  id: string;
  user_id: string;
  date: string;
  reference: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function normalizeDailyFocus(focus: ApiDailyFocus): DailyFocusRecord {
  return {
    id: focus.id,
    user_id: focus.userId,
    date: focus.date,
    reference: focus.reference,
    content: focus.content,
    completed: focus.completed ?? false,
    created_at: focus.createdAt,
    updated_at: focus.updatedAt,
  };
}
