import { useState } from "react";

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:5001";

export default function EditPage() {
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/sandesh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSandesh: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      setStatus("Updated successfully!");
    } catch {
      setStatus("Update failed");
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Message</h1>
      <form onSubmit={handleSubmit} className="flex gap-4 flex-col items-start">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border rounded px-5 py-3 h-64 w-full resize-none"
          placeholder="Enter concept paragraph"
        />
        <button type="submit" className="border rounded px-3 py-2">
          Update Database
        </button>
      </form>
      {status && <p className="mt-3">{status}</p>}
    </div>
  );
}