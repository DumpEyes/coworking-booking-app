import Link from "next/link";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import SpaceCard from "@/components/spaces/SpaceCard";

async function getFeaturedSpaces() {
  await connectDB();
  const spaces = await Space.find({}).sort({ createdAt: -1 }).limit(3);
  return JSON.parse(JSON.stringify(spaces));
}

export default async function HomePage() {
  const featuredSpaces = await getFeaturedSpaces();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Workspace
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Browse and book professional coworking spaces and meeting rooms that
            fit your needs — by the hour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/spaces"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Spaces
            </Link>
            <Link
              href="/register"
              className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Why Choose CoWork?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Book by the Hour",
                desc: "Flexible hourly rates with no long-term commitments required.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "No Double Bookings",
                desc: "Smart overlap detection ensures your time slot is always yours.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Multiple Space Types",
                desc: "Open coworking areas and private meeting rooms for all needs.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-blue-50"
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      {featuredSpaces.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Spaces</h2>
              <Link
                href="/spaces"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-blue-100 mb-8">
            Join hundreds of professionals who use CoWork to stay productive.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
