"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteSpaceButton({ id, title }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/spaces/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Space deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete space");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-50 text-xs font-medium disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
