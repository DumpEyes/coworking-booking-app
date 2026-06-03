import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import SpaceCard from "@/components/spaces/SpaceCard";

async function getSpaces(type) {
  await connectDB();
  const spaces = await Space.find(type ? { type } : {}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(spaces));
}

export default async function SpacesPage({ searchParams }) {
  const { type } = await searchParams;
  const spaces = await getSpaces(type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Spaces</h1>
        <p className="text-gray-500">Find the perfect workspace for your needs.</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[
          { label: "All Spaces", value: "" },
          { label: "Coworking", value: "COWORKING" },
          { label: "Meeting Rooms", value: "MEETING_ROOM" },
        ].map((filter) => (
          <a
            key={filter.value}
            href={filter.value ? `/spaces?type=${filter.value}` : "/spaces"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (type || "") === filter.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
          >
            {filter.label}
          </a>
        ))}
      </div>

      {spaces.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-300 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No spaces found</h3>
          <p className="text-gray-500 text-sm mt-1">Check back later or try a different filter.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {spaces.length} space{spaces.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
