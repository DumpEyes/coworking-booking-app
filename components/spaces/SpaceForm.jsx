"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SpaceForm({ space }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: space?.title || "",
    description: space?.description || "",
    imageUrl: space?.imageUrl || "",
    capacity: space?.capacity || 1,
    pricePerHour: space?.pricePerHour || 10,
    type: space?.type || "COWORKING",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = space ? `/api/spaces/${space.id}` : "/api/spaces";
      const method = space ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(space ? "Space updated!" : "Space created!");
      router.push("/admin/spaces");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        id="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g. Open Coworking Space"
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe the space..."
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 hover:border-gray-400"
        />
      </div>

      <Input
        label="Image URL"
        id="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        placeholder="https://..."
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Capacity (people)"
          id="capacity"
          type="number"
          min={1}
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          required
        />

        <Input
          label="Price per Hour ($)"
          id="pricePerHour"
          type="number"
          min={1}
          step={0.01}
          value={formData.pricePerHour}
          onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="type">
          Space Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
        >
          <option value="COWORKING">Coworking</option>
          <option value="MEETING_ROOM">Meeting Room</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {space ? "Update Space" : "Create Space"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
