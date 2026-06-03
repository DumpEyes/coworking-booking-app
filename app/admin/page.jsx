import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import User from "@/models/User";
import Reservation from "@/models/Reservation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") redirect("/login");

  await connectDB();

  const [totalSpaces, totalUsers, totalReservations, pendingCount, recentReservations] =
    await Promise.all([
      Space.countDocuments(),
      User.countDocuments(),
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: "PENDING" }),
      Reservation.find({})
        .populate("user", "name")
        .populate("space", "title")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  const recent = JSON.parse(JSON.stringify(recentReservations));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Spaces", value: totalSpaces, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Registered Users", value: totalUsers, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Bookings", value: totalReservations, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Review", value: pendingCount, color: "text-yellow-600", bg: "bg-yellow-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-5`}>
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/spaces/new"
          className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors"
        >
          <p className="font-semibold">+ Add New Space</p>
          <p className="text-blue-100 text-sm mt-0.5">Create a coworking or meeting room</p>
        </Link>

        <Link
          href="/admin/spaces"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
        >
          <p className="font-semibold text-gray-900">Manage Spaces</p>
          <p className="text-gray-500 text-sm mt-0.5">Edit or remove existing spaces</p>
        </Link>

        <Link
          href="/admin/reservations"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
        >
          <p className="font-semibold text-gray-900">
            Reservations
            {pendingCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </p>
          <p className="text-gray-500 text-sm mt-0.5">Confirm or cancel bookings</p>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reservations</h2>
          <Link href="/admin/reservations" className="text-blue-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No reservations yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Space</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{r.user?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.space?.title}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(r.reservationDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : r.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
