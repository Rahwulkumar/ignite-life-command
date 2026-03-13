import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAddVerse } from "@/hooks/useScriptureMemory";
import { validateBibleReference, suggestBooks } from "@/lib/bibleValidation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddVerseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVerseDialog({ open, onOpenChange }: AddVerseDialogProps) {
  const addVerse = useAddVerse();

  const [reference, setReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [touched, setTouched] = useState({
    reference: false,
    verseText: false,
  });

  const suggestionRef = useRef<HTMLDivElement>(null);

  // Real-time reference validation
  const validation = validateBibleReference(reference);
  const referenceIsValid = validation.valid;
  const referenceError =
    touched.reference && reference.trim() && !referenceIsValid
      ? validation.error
      : null;
  const verseTextError =
    touched.verseText && !verseText.trim()
      ? "Please enter the verse text"
      : null;

  // Book autocomplete — trigger on the book part of the input
  useEffect(() => {
    const bookPart = reference.split(/\s+\d/)[0]; // everything before a number
    if (bookPart.length >= 2 && !reference.match(/\d+:/)) {
      const matches = suggestBooks(bookPart, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [reference]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSuggestionClick = (book: string) => {
    // Replace the book part with the canonical name, preserve any existing chapter:verse
    const chapterVersePart = reference.match(/\s+(\d+:\d+)/)?.[1] || "";
    setReference(chapterVersePart ? `${book} ${chapterVersePart}` : `${book} `);
    setShowSuggestions(false);
    setTouched((t) => ({ ...t, reference: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ reference: true, verseText: true });

    if (!referenceIsValid) {
      return;
    }
    if (!verseText.trim()) {
      return;
    }

    try {
      await addVerse.mutateAsync({
        reference: validation.normalised!, // always use normalised canonical form
        text: verseText.trim(),
      });
      toast.success(`"${validation.normalised}" added to your memory verses`);
      onOpenChange(false);
      setReference("");
      setVerseText("");
      setTouched({ reference: false, verseText: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save verse";
      toast.error(msg);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setReference("");
      setVerseText("");
      setTouched({ reference: false, verseText: false });
      setShowSuggestions(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-spiritual/10">
              <BookOpen className="h-4 w-4 text-spiritual" />
            </div>
            <div>
              <DialogTitle>Add Scripture Verse</DialogTitle>
              <DialogDescription className="mt-0.5">
                Lock a verse into your memory. Reference is validated against
                the Bible.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Reference field */}
          <div className="space-y-1.5">
            <Label htmlFor="reference">
              Reference <span className="text-destructive">*</span>
            </Label>
            <div className="relative" ref={suggestionRef}>
              <div className="relative">
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, reference: true }));
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  placeholder="e.g. John 3:16"
                  className={cn(
                    "pr-8",
                    touched.reference &&
                      reference.trim() &&
                      referenceIsValid &&
                      "border-green-500 focus-visible:ring-green-500/20",
                    referenceError &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                  autoComplete="off"
                />
                {/* Status icon */}
                {reference.trim() && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {referenceIsValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : touched.reference ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>

              {/* Book autocomplete dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 mt-1 w-full z-50 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
                  {suggestions.map((book) => (
                    <button
                      key={book}
                      type="button"
                      onClick={() => handleSuggestionClick(book)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {book}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error or success hint */}
            {referenceError ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3 shrink-0" />
                {referenceError}
              </p>
            ) : validation.valid && reference.trim() ? (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Valid — {validation.book}, chapter {validation.chapter}, verse{" "}
                {validation.verse}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Format: Book Chapter:Verse (e.g. "Genesis 1:1", "Ps 23:1", "1
                Cor 13:4")
              </p>
            )}
          </div>

          {/* Verse text field */}
          <div className="space-y-1.5">
            <Label htmlFor="verseText">
              Verse Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="verseText"
              value={verseText}
              onChange={(e) => setVerseText(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, verseText: true }))}
              placeholder="Type or paste the full verse text here…"
              className={cn(
                "resize-none min-h-[100px]",
                verseTextError &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
            />
            {verseTextError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3 shrink-0" />
                {verseTextError}
              </p>
            )}
            {verseText.trim() && (
              <p className="text-xs text-muted-foreground text-right">
                {verseText.trim().split(/\s+/).length} words
              </p>
            )}
          </div>

          {/* Preview card */}
          {validation.valid && verseText.trim() && (
            <Alert className="border-spiritual/30 bg-spiritual/5">
              <AlertDescription className="space-y-1">
                <p className="font-medium text-spiritual text-sm">
                  {validation.normalised}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {verseText.trim()}
                </p>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addVerse.isPending}
              className="bg-spiritual hover:bg-spiritual/90 text-white"
            >
              {addVerse.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="mr-2 h-4 w-4" />
              )}
              Save Verse
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
