import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:5001";

export default function DisplayPage() {
  const [msg, setMsg] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sandesh`)
      .then((res) => res.json())
      .then((data) => setMsg(data.sandesh ?? "No message found"))
      .catch(() => setMsg("Unable to fetch message"));
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Current Message</h1>
      <p>{msg}</p>
    </div>
  );
}

