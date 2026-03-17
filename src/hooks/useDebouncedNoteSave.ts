import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "@/lib/utils";
import type { Json } from "@/lib/types";

export function useDebouncedNoteSave(
  saveNote: (id: string, content: Json) => Promise<unknown>,
  wait = 500,
) {
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const debouncedSave = useMemo(
    () =>
      debounce(async (id: string, content: Json) => {
        if (isMountedRef.current) {
          setSavingNoteId(id);
        }

        try {
          await saveNote(id, content);
        } catch {
          // Mutation callers handle error presentation when needed.
        } finally {
          if (isMountedRef.current) {
            setSavingNoteId((current) => (current === id ? null : current));
          }
        }
      }, wait),
    [saveNote, wait],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const scheduleSave = useCallback(
    (id: string, content: Json) => {
      debouncedSave(id, content);
    },
    [debouncedSave],
  );

  const flushPendingSave = useCallback(() => {
    debouncedSave.flush();
  }, [debouncedSave]);

  const cancelPendingSave = useCallback(() => {
    debouncedSave.cancel();

    if (isMountedRef.current) {
      setSavingNoteId(null);
    }
  }, [debouncedSave]);

  return {
    savingNoteId,
    scheduleSave,
    flushPendingSave,
    cancelPendingSave,
  };
}
