"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReservationCard from "@/components/reservations/ReservationCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

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

  async function handleStatusChange(id, status) {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(`Reservation ${status.toLowerCase()}`);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch {
      toast.error("Failed to update reservation status");
    }
  }

  const filtered =
    filter === "ALL" ? reservations : reservations.filter((r) => r.status === filter);

  if (loading) return <LoadingSpinner text="Loading reservations..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Reservations</h1>
        <p className="text-gray-500 text-sm mt-1">
          {reservations.length} total reservation{reservations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
            }`}
          >
            {status}
            {status !== "ALL" && (
              <span className="ml-1 text-xs">
                ({reservations.filter((r) => r.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No reservations found"
          description={
            filter === "ALL"
              ? "No reservations have been made yet."
              : `No ${filter.toLowerCase()} reservations.`
          }
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              isAdmin
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
