"use client";

import { formatDate, formatPrice, calculateTotalPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function ReservationCard({ reservation, onStatusChange, isAdmin = false }) {
  const statusVariant =
    reservation.status === "CONFIRMED"
      ? "green"
      : reservation.status === "PENDING"
      ? "yellow"
      : "red";

  const total = reservation.space
    ? calculateTotalPrice(reservation.space.pricePerHour, reservation.startTime, reservation.endTime)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{reservation.space?.title || "Space"}</h3>
          {isAdmin && reservation.user && (
            <p className="text-sm text-gray-500">By: {reservation.user.name}</p>
          )}
        </div>
        <Badge variant={statusVariant}>{reservation.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div>
          <span className="text-gray-400 block text-xs">Date</span>
          {formatDate(reservation.reservationDate)}
        </div>
        <div>
          <span className="text-gray-400 block text-xs">Time</span>
          {reservation.startTime} – {reservation.endTime}
        </div>
        {total > 0 && (
          <div>
            <span className="text-gray-400 block text-xs">Total</span>
            <span className="font-semibold text-blue-600">{formatPrice(total)}</span>
          </div>
        )}
      </div>

      {isAdmin && reservation.status === "PENDING" && onStatusChange && (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(reservation.id, "CONFIRMED")}
            className="flex-1 py-1.5 px-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => onStatusChange(reservation.id, "CANCELLED")}
            className="flex-1 py-1.5 px-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
