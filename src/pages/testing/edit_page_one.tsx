import { useState } from "react";
import { books } from "@/data/books";

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:5001";

export default function EditPageOne() {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [conLimitValue, setConLimitValue] = useState<string>("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBookClick = async (bookIndex: number) => {
    setSelectedBook(bookIndex);
    setStatus("");
    setConLimitValue("");
    setIsLoading(true);

    // Fetch current conLimit for this book
    try {
      const res = await fetch(`${API_BASE_URL}/api/conlimit?bookId=book${bookIndex + 1}`);
      const data = await res.json();
      setConLimitValue(String(data.conLimit ?? 10));
    } catch {
      setConLimitValue("10");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({ bookId: `book${selectedBook + 1}`, conLimit: limit }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      setStatus(`✅ Book ${selectedBook + 1} will now end after concept ${limit}`);
    } catch (err: any) {
      setStatus(`❌ ${err.message || "Update failed"}`);
    }
  };

  // Sub-page: conLimit input for selected book
  if (selectedBook !== null) {
    const book = books[selectedBook];
    return (
      <div className="min-h-screen p-6">
        <button
          onClick={() => setSelectedBook(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          ← Back to Book List
        </button>

        <h1 className="text-2xl font-bold mb-2">
          Book {selectedBook + 1}: {book.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Set how many concept rounds this book's game should have (1–10).
        </p>

        {isLoading ? (
          <p className="text-gray-500">Loading current value...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs">
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
              Submit
            </button>
            {status && <p className="text-sm mt-1">{status}</p>}
          </form>
        )}
      </div>
    );
  }

  // Main page: book list
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Set Concept Limits</h1>
      <div className="flex flex-col gap-3 max-w-xl">
        {books.map((book, index) => (
          <button
            key={book.id}
            onClick={() => handleBookClick(index)}
            className="flex items-center gap-4 border-2 border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left"
          >
            {/* Book Image Thumbnail */}
            <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-[10px]">No Cover</span>
              )}
            </div>

            {/* Book Number + Title */}
            <span className="text-sm sm:text-base font-medium">
              Book {index + 1}: {book.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
