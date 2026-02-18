import { useState } from "react";
import { Book, Edit2, Check, X, Search } from "lucide-react";
import { BaseDomainCard } from "@/components/shared/BaseDomainCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BIBLE_BOOKS, calculateReadingProgress } from "@/lib/bibleBooks";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BibleReadingCardProps {
  currentBook: string;
  currentChapter: number;
  currentVerse: number;
  onUpdate: (book: string, chapter: number, verse: number) => void;
}

export const BibleReadingCard = ({
  currentBook,
  currentChapter,
  currentVerse,
  onUpdate,
}: BibleReadingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(currentBook);
  const [chapter, setChapter] = useState(currentChapter.toString());
  const [verse, setVerse] = useState(currentVerse.toString());
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  const progress = calculateReadingProgress(currentBook, currentChapter, currentVerse);

  // Filter books based on search query
  const filteredBooks = BIBLE_BOOKS.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected book's chapter count for validation
  const selectedBookData = BIBLE_BOOKS.find(b => b.name === selectedBook);
  const maxChapters = selectedBookData?.chapters || 999;

  const handleSave = () => {
    const chapterNum = parseInt(chapter) || 1;
    const verseNum = parseInt(verse) || 1;

    // Validation
    if (chapterNum < 1) {
      toast({
        title: "Invalid Chapter",
        description: "Chapter must be at least 1",
        variant: "destructive",
      });
      return;
    }

    if (chapterNum > maxChapters) {
      toast({
        title: "Invalid Chapter",
        description: `${selectedBook} only has ${maxChapters} chapters`,
        variant: "destructive",
      });
      return;
    }

    if (verseNum < 1) {
      toast({
        title: "Invalid Verse",
        description: "Verse must be at least 1",
        variant: "destructive",
      });
      return;
    }

    onUpdate(selectedBook, chapterNum, verseNum);
    setIsEditing(false);
    setSearchQuery("");
  };

  const handleCancel = () => {
    setSelectedBook(currentBook);
    setChapter(currentChapter.toString());
    setVerse(currentVerse.toString());
    setSearchQuery("");
    setIsEditing(false);
  };

  const handleSelectBook = (bookName: string) => {
    setSelectedBook(bookName);
    setSearchQuery(bookName);
    setShowDropdown(false);
  };

  return (
    <BaseDomainCard
      icon={<Book className="w-5 h-5 text-spiritual" />}
      title="Bible Reading"
      domainColor="spiritual"
      headerAction={
        !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-spiritual/10 transition-colors"
            aria-label="Edit reading position"
          >
            <Edit2 className="w-4 h-4 text-spiritual" />
          </button>
        ) : null
      }
    >
      <div className="space-y-5">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-spiritual">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-spiritual via-spiritual/80 to-spiritual/60 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            {/* Book Search Input */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Book
              </Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => {
                      if (!searchQuery) {
                        setSearchQuery("");
                      }
                      setShowDropdown(true);
                    }}
                    placeholder="Type to search books..."
                    className="pl-9 font-serif bg-background border-border/50 focus:border-spiritual"
                  />
                </div>

                {/* Dropdown Results */}
                {showDropdown && filteredBooks.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-[280px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                    {/* Old Testament */}
                    {filteredBooks.some(b => b.testament === 'old') && (
                      <>
                        <div className="sticky top-0 bg-card px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50">
                          Old Testament
                        </div>
                        {filteredBooks
                          .filter(b => b.testament === 'old')
                          .map(book => (
                            <button
                              key={book.id}
                              onClick={() => handleSelectBook(book.name)}
                              className={cn(
                                "w-full px-3 py-2.5 text-left hover:bg-spiritual/10 transition-colors flex items-center justify-between group",
                                selectedBook === book.name && "bg-spiritual/5"
                              )}
                            >
                              <span className="font-serif text-sm">{book.name}</span>
                              <span className="text-xs text-muted-foreground group-hover:text-spiritual">
                                {book.chapters} ch
                              </span>
                            </button>
                          ))}
                      </>
                    )}

                    {/* New Testament */}
                    {filteredBooks.some(b => b.testament === 'new') && (
                      <>
                        <div className="sticky top-0 bg-card px-3 py-2 text-xs font-medium text-muted-foreground border-b border-t border-border/50">
                          New Testament
                        </div>
                        {filteredBooks
                          .filter(b => b.testament === 'new')
                          .map(book => (
                            <button
                              key={book.id}
                              onClick={() => handleSelectBook(book.name)}
                              className={cn(
                                "w-full px-3 py-2.5 text-left hover:bg-spiritual/10 transition-colors flex items-center justify-between group",
                                selectedBook === book.name && "bg-spiritual/5"
                              )}
                            >
                              <span className="font-serif text-sm">{book.name}</span>
                              <span className="text-xs text-muted-foreground group-hover:text-spiritual">
                                {book.chapters} ch
                              </span>
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Chapter and Verse Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="chapter-input" className="text-xs font-medium text-muted-foreground">
                  Chapter {selectedBookData && `(1-${selectedBookData.chapters})`}
                </Label>
                <Input
                  id="chapter-input"
                  type="number"
                  min="1"
                  max={maxChapters}
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="1"
                  className="text-center text-lg font-serif font-medium bg-background border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verse-input" className="text-xs font-medium text-muted-foreground">
                  Verse
                </Label>
                <Input
                  id="verse-input"
                  type="number"
                  min="1"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="1"
                  className="text-center text-lg font-serif font-medium bg-background border-border/50 focus:border-spiritual"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-spiritual hover:bg-spiritual/90 text-white shadow-sm"
                size="sm"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Save Position
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex-1 border-border/50 hover:bg-muted"
              >
                <X className="w-4 h-4 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          /* Display Mode */
          <div className="space-y-3">
            <div className="p-5 rounded-lg bg-gradient-to-br from-spiritual/5 via-spiritual/3 to-transparent border border-spiritual/20">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Currently Reading
                </p>
                <p className="text-2xl font-serif font-medium text-spiritual leading-tight">
                  {currentBook}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-serif font-medium text-foreground">Ch {currentChapter}</span>
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <span className="font-serif font-medium text-foreground">Vs {currentVerse}</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Click edit to update your reading position
            </p>
          </div>
        )}
      </div>
    </BaseDomainCard>
  );
};
