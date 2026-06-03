"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">CoWork</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/spaces" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Browse Spaces
            </Link>

            {session ? (
              <>
                {session.user.role === "ADMIN" ? (
                  <>
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Admin Dashboard</Link>
                    <Link href="/admin/spaces" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Manage Spaces</Link>
                    <Link href="/admin/reservations" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Reservations</Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</Link>
                    <Link href="/dashboard/reservations" className="text-gray-600 hover:text-gray-900 text-sm font-medium">My Reservations</Link>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{session.user.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Register</Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link href="/spaces" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Browse Spaces</Link>
            {session ? (
              <>
                {session.user.role === "ADMIN" ? (
                  <>
                    <Link href="/admin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Admin Dashboard</Link>
                    <Link href="/admin/spaces" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Manage Spaces</Link>
                    <Link href="/admin/reservations" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Reservations</Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                    <Link href="/dashboard/reservations" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">My Reservations</Link>
                  </>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Login</Link>
                <Link href="/register" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
