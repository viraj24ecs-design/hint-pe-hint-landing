import { useState } from "react";
import { books } from "@/data/books";

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:5001";

interface ConceptData {
  hint: string;
  answer: string;
  correctButtonId: number;
}

interface DecoyData {
  text: string;
  position: number;
}

export default function EditPageOne() {
  // View state: "list" | "conlimit" | "editor"
  const [view, setView] = useState<"list" | "conlimit" | "editor">("list");
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [conLimitValue, setConLimitValue] = useState<string>("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Concept editor state
  const [concepts, setConcepts] = useState<ConceptData[]>([]);
  const [editorStatus, setEditorStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Decoy state
  const [decoyEnabled, setDecoyEnabled] = useState(false);
  const [decoys, setDecoys] = useState<DecoyData[]>([]);

  const handleBookClick = async (bookIndex: number) => {
    setSelectedBook(bookIndex);
    setView("conlimit");
    setStatus("");
    setConLimitValue("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/conlimit?bookId=book${bookIndex}`);
      const data = await res.json();
      setConLimitValue(String(data.conLimit ?? 10));
    } catch {
      setConLimitValue("10");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConLimitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook === null) return;

    const limit = Number(conLimitValue);
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      setStatus("❌ Value must be an integer between 1 and 10");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/conlimit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: `book${selectedBook}`, conLimit: limit }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      // All books go to the concept editor
      setIsLoading(true);
      setEditorStatus("");
      try {
        const bdRes = await fetch(`${API_BASE_URL}/api/bookdata?bookId=book${selectedBook}`);
        const bdData = await bdRes.json();

        const newConcepts: ConceptData[] = [];
        for (let i = 0; i < limit; i++) {
          newConcepts.push({
            hint: bdData.hints?.[i] ?? "",
            answer: bdData.answers?.[i] ?? "",
            correctButtonId: bdData.correctButtonIds?.[i] ?? 0,
          });
        }
        setConcepts(newConcepts);

        // Load decoy data
        setDecoyEnabled(bdData.decoyEnabled ?? false);
        const loadedDecoys: DecoyData[] = bdData.decoys ?? [];
        const decoyCount = 10 - limit;
        const newDecoys: DecoyData[] = [];
        for (let i = 0; i < decoyCount; i++) {
          newDecoys.push({
            text: loadedDecoys[i]?.text ?? "",
            position: loadedDecoys[i]?.position ?? 0,
          });
        }
        setDecoys(newDecoys);
      } catch {
        const newConcepts: ConceptData[] = [];
        for (let i = 0; i < limit; i++) {
          newConcepts.push({ hint: "", answer: "", correctButtonId: 0 });
        }
        setConcepts(newConcepts);
        setDecoyEnabled(false);
        setDecoys(
          Array.from({ length: 10 - limit }, () => ({ text: "", position: 0 }))
        );
      } finally {
        setIsLoading(false);
      }
      setView("editor");
    } catch (err: any) {
      setStatus(`❌ ${err.message || "Update failed"}`);
    }
  };

  const updateConcept = (index: number, field: keyof ConceptData, value: string | number) => {
    setConcepts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateDecoy = (index: number, field: keyof DecoyData, value: string | number) => {
    setDecoys((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Get positions already used by concepts (their correctButtonIds)
  const usedPositions = concepts.map((c) => c.correctButtonId);

  const handleSaveAll = async () => {
    if (selectedBook === null) return;
    setIsSaving(true);
    setEditorStatus("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookdata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: `book${selectedBook}`,
          hints: concepts.map((c) => c.hint),
          answers: concepts.map((c) => c.answer),
          correctButtonIds: concepts.map((c) => c.correctButtonId),
          decoyEnabled,
          decoys: decoyEnabled ? decoys : [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setEditorStatus("✅ All concepts saved successfully!");
    } catch (err: any) {
      setEditorStatus(`❌ ${err.message || "Save failed"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── VIEW 3: Concept Editor ────────────────────────────────────
  if (view === "editor" && selectedBook !== null) {
    const book = books[selectedBook];
    const decoySlotCount = 10 - concepts.length; // available decoy slots

    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <button
          onClick={() => setView("conlimit")}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to ConLimit
        </button>

        <h1 className="text-2xl font-bold mb-1">
          Book {selectedBook}: {book.title}
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Editing {concepts.length} concepts. Fill in hints, answers, and correct button IDs.
        </p>

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Concept blocks */}
            {concepts.map((concept, i) => (
              <div key={i} className="border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-3 text-blue-700">
                  Concept No. {i + 1}
                </h2>

                {/* Hint textarea */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Hint Paragraph
                  </label>
                  <textarea
                    value={concept.hint}
                    onChange={(e) => updateConcept(i, "hint", e.target.value)}
                    className="border rounded w-full px-3 py-2 text-sm min-h-[150px] resize-y"
                    placeholder="Enter the hint paragraph for this concept..."
                  />
                </div>

                {/* Answer + CorrectButtonId row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Answer Label
                    </label>
                    <input
                      type="text"
                      value={concept.answer}
                      onChange={(e) => updateConcept(i, "answer", e.target.value)}
                      className="border rounded w-full px-3 py-2 text-sm"
                      placeholder="Enter the answer button text..."
                    />
                  </div>

                  <div className="w-full sm:w-40">
                    <label className="block text-sm font-medium mb-1">
                      Correct Button ID
                    </label>
                    <select
                      value={concept.correctButtonId}
                      onChange={(e) => updateConcept(i, "correctButtonId", Number(e.target.value))}
                      className="border rounded w-full px-3 py-2 text-sm bg-white"
                    >
                      {Array.from({ length: 10 }, (_, n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* ─── Decoy Answers Section ─── */}
            {decoySlotCount > 0 && (
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 sm:p-6 bg-orange-50/50">
                {/* Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-orange-700">Add Decoy Answers</h2>
                    <p className="text-xs text-gray-500">
                      {decoySlotCount} unused button slot{decoySlotCount > 1 ? "s" : ""} available.
                      Disabling hides them in the game.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={decoyEnabled}
                      onChange={(e) => setDecoyEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {/* Decoy editors — shown only when toggle is ON */}
                {decoyEnabled && (
                  <div className="flex flex-col gap-4 mt-2">
                    {decoys.map((decoy, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-3 border border-orange-200 rounded-lg p-3 bg-white">
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1 text-orange-700">
                            Decoy {i + 1} — Answer Text
                          </label>
                          <input
                            type="text"
                            value={decoy.text}
                            onChange={(e) => updateDecoy(i, "text", e.target.value)}
                            className="border rounded w-full px-3 py-2 text-sm"
                            placeholder="Decoy answer text..."
                          />
                        </div>
                        <div className="w-full sm:w-40">
                          <label className="block text-xs font-medium mb-1 text-orange-700">
                            Button Position
                          </label>
                          <select
                            value={decoy.position}
                            onChange={(e) => updateDecoy(i, "position", Number(e.target.value))}
                            className="border rounded w-full px-3 py-2 text-sm bg-white"
                          >
                            {Array.from({ length: 10 }, (_, n) => (
                              <option key={n} value={n}>
                                {n}{usedPositions.includes(n) ? " (used by concept)" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Save button */}
            <div className="sticky bottom-4 bg-white border-t pt-4">
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="w-full border rounded px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save All Concepts"}
              </button>
              {editorStatus && <p className="text-sm mt-2 text-center">{editorStatus}</p>}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── VIEW 2: ConLimit Input ────────────────────────────────────
  if (view === "conlimit" && selectedBook !== null) {
    const book = books[selectedBook];
    return (
      <div className="min-h-screen p-6">
        <button
          onClick={() => { setView("list"); setSelectedBook(null); }}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Book List
        </button>

        <h1 className="text-2xl font-bold mb-2">
          Book {selectedBook}: {book.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Set how many concept rounds this book's game should have (1–10).
        </p>

        {isLoading ? (
          <p className="text-gray-500">Loading current value...</p>
        ) : (
          <form onSubmit={handleConLimitSubmit} className="flex flex-col gap-4 max-w-xs">
            <div>
              <label htmlFor="conLimit" className="block text-sm font-medium mb-1">
                Concept Limit
              </label>
              <input
                id="conLimit"
                type="number"
                min={1}
                max={10}
                value={conLimitValue}
                onChange={(e) => setConLimitValue(e.target.value)}
                className="border rounded px-4 py-2 w-full text-lg"
                placeholder="1–10"
              />
            </div>
            <button
              type="submit"
              className="border rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Next → Edit Concepts
            </button>
            {status && <p className="text-sm mt-1">{status}</p>}
          </form>
        )}
      </div>
    );
  }

  // ─── VIEW 1: Book List ─────────────────────────────────────────
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Set Concept Limits</h1>
      <div className="flex flex-col gap-3 max-w-xl">
        {books.slice(1).map((book, i) => {
          const bookNum = i + 1; // Book 1, Book 2, ...
          const actualIndex = i + 1; // index in the books array
          return (
          <button
            key={book.id}
            onClick={() => handleBookClick(actualIndex)}
            className="flex items-center gap-4 border-2 border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left"
          >
            <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
              {book.image ? (
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-[10px]">No Cover</span>
              )}
            </div>
            <span className="text-sm sm:text-base font-medium">
              Book {bookNum}: {book.title}
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
}
