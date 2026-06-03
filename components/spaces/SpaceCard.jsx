"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function SpaceCard({ space }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={space.imageUrl}
          alt={space.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={space.type === "COWORKING" ? "blue" : "green"}>
            {space.type === "COWORKING" ? "Coworking" : "Meeting Room"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{space.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{space.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {space.capacity} people
          </span>
          <span className="font-semibold text-blue-600">
            {formatPrice(space.pricePerHour)}/hr
          </span>
        </div>

        <Link
          href={`/spaces/${space.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
