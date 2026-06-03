"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { formatPrice, calculateTotalPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ReservationForm({ space }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reservationDate: "",
    startTime: "09:00",
    endTime: "10:00",
  });

  const total =
    formData.startTime && formData.endTime
      ? calculateTotalPrice(space.pricePerHour, formData.startTime, formData.endTime)
      : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!session) {
      toast.error("Please log in to make a reservation");
      router.push("/login");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId: space.id, ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      toast.success("Reservation created successfully!");
      router.push("/dashboard/reservations");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date"
        id="reservationDate"
        type="date"
        value={formData.reservationDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Time"
          id="startTime"
          type="time"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          required
        />
        <Input
          label="End Time"
          id="endTime"
          type="time"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          required
        />
      </div>

      {total > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Rate</span>
            <span>{formatPrice(space.pricePerHour)}/hr</span>
          </div>
          <div className="flex justify-between font-semibold text-blue-700 mt-1">
            <span>Estimated Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        {session ? "Reserve Now" : "Login to Reserve"}
      </Button>
    </form>
  );
}
