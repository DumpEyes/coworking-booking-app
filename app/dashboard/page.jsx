import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import mongoose from "mongoose";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);

  const [reservations, totalReservations, confirmedCount, pendingCount] =
    await Promise.all([
      Reservation.find({ user: userId })
        .populate("space")
        .sort({ createdAt: -1 })
        .limit(3),
      Reservation.countDocuments({ user: userId }),
      Reservation.countDocuments({ user: userId, status: "CONFIRMED" }),
      Reservation.countDocuments({ user: userId, status: "PENDING" }),
    ]);

  const recentReservations = JSON.parse(JSON.stringify(reservations));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your reservations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Reservations", value: totalReservations, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Confirmed", value: confirmedCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending", value: pendingCount, color: "text-yellow-600", bg: "bg-yellow-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-5`}>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/spaces"
          className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <p className="font-semibold">Browse Spaces</p>
              <p className="text-blue-100 text-sm">Find and book a workspace</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/reservations"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">My Reservations</p>
              <p className="text-gray-500 text-sm">View all your bookings</p>
            </div>
          </div>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reservations</h2>
          <Link href="/dashboard/reservations" className="text-blue-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {recentReservations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No reservations yet.</p>
            <Link
              href="/spaces"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm"
            >
              Book your first space →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReservations.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{r.space?.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.reservationDate).toLocaleDateString()} · {r.startTime} – {r.endTime}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    r.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : r.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
