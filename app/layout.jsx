import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/layout/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CoWork - Coworking & Meeting Room Reservations",
  description: "Book professional coworking spaces and meeting rooms with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1f2937",
                color: "#f9fafb",
                borderRadius: "10px",
                fontSize: "14px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
