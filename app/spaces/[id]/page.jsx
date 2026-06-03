import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ReservationForm from "@/components/reservations/ReservationForm";

export default async function SpaceDetailPage({ params }) {
  const { id } = await params;
  await connectDB();
  const space = await Space.findById(id).lean();
  if (!space) notFound();

  const serialized = JSON.parse(JSON.stringify(space));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-6">
            <Image src={serialized.imageUrl} alt={serialized.title} fill className="object-cover" />
          </div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{serialized.title}</h1>
            <Badge variant={serialized.type === "COWORKING" ? "blue" : "green"}>
              {serialized.type === "COWORKING" ? "Coworking" : "Meeting Room"}
            </Badge>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{serialized.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-1">Capacity</div>
              <div className="font-semibold text-gray-900 flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {serialized.capacity} people
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-1">Hourly Rate</div>
              <div className="font-semibold text-blue-600 text-lg">{formatPrice(serialized.pricePerHour)}/hr</div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book This Space</h2>
            <ReservationForm space={serialized} />
          </div>
        </div>
      </div>
    </div>
  );
}
