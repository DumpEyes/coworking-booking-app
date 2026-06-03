import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const { status } = await req.json();
    if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await connectDB();
    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true }).populate("space").populate("user", "-password");
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(reservation)));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    if (session.user.role !== "ADMIN" && reservation.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await Reservation.findByIdAndUpdate(id, { status: "CANCELLED" });
    return NextResponse.json({ message: "Reservation cancelled" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel reservation" }, { status: 500 });
  }
}
