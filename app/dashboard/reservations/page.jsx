"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ReservationCard from "@/components/reservations/ReservationCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchReservations() {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setReservations(data);
    } catch {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  async function handleCancel(id) {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel");
      toast.success("Reservation cancelled");
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to cancel reservation");
    }
  }

  if (loading) return <LoadingSpinner text="Loading your reservations..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reservations.length} reservation{reservations.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/spaces"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New Reservation
        </Link>
      </div>

      {reservations.length === 0 ? (
        <EmptyState
          title="No reservations yet"
          description="Browse our spaces and book your first workspace."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          action={
            <Link
              href="/spaces"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Browse Spaces
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="relative">
              <ReservationCard reservation={reservation} />
              {reservation.status !== "CANCELLED" && (
                <button
                  onClick={() => handleCancel(reservation.id)}
                  className="mt-2 w-full text-center text-xs text-red-500 hover:text-red-700 py-1"
                >
                  Cancel reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
