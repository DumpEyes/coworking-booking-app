import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import DeleteSpaceButton from "@/components/spaces/DeleteSpaceButton";

export default async function AdminSpacesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") redirect("/login");

  await connectDB();
  const spacesRaw = await Space.find({}).sort({ createdAt: -1 });
  const spaces = JSON.parse(JSON.stringify(spacesRaw));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Spaces</h1>
          <p className="text-gray-500 text-sm mt-1">{spaces.length} spaces total</p>
        </div>
        <Link
          href="/admin/spaces/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Space
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {spaces.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No spaces created yet.</p>
            <Link href="/admin/spaces/new" className="text-blue-600 hover:underline text-sm">
              Create your first space
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Space</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Capacity</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Price/hr</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{space.title}</div>
                      <div className="text-gray-400 text-xs line-clamp-1 max-w-xs">
                        {space.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={space.type === "COWORKING" ? "blue" : "green"}>
                        {space.type === "COWORKING" ? "Coworking" : "Meeting Room"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{space.capacity} people</td>
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {formatPrice(space.pricePerHour)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/spaces/${space.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteSpaceButton id={space.id} title={space.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
