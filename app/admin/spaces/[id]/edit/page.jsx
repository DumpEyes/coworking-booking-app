import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import SpaceForm from "@/components/spaces/SpaceForm";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";

export default async function EditSpacePage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  await connectDB();
  const space = await Space.findById(id).lean();
  if (!space) notFound();

  const serialized = JSON.parse(JSON.stringify(space));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-gray-700">Admin</Link>
        <span>/</span>
        <Link href="/admin/spaces" className="hover:text-gray-700">Spaces</Link>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
      </div>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">Edit Space</h1>
          <p className="text-gray-500 text-sm mt-0.5">Update the space details below.</p>
        </CardHeader>
        <CardBody>
          <SpaceForm space={serialized} />
        </CardBody>
      </Card>
    </div>
  );
}
