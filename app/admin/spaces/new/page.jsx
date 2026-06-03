import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import SpaceForm from "@/components/spaces/SpaceForm";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";

export default async function NewSpacePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-gray-700">Admin</Link>
        <span>/</span>
        <Link href="/admin/spaces" className="hover:text-gray-700">Spaces</Link>
        <span>/</span>
        <span className="text-gray-900">New</span>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">Create New Space</h1>
          <p className="text-gray-500 text-sm mt-0.5">Add a new coworking space or meeting room.</p>
        </CardHeader>
        <CardBody>
          <SpaceForm />
        </CardBody>
      </Card>
    </div>
  );
}
