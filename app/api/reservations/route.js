import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const isAdmin = session.user.role === "ADMIN";
    const query = isAdmin ? {} : { user: new mongoose.Types.ObjectId(session.user.id) };

    const reservations = await Reservation.find(query)
      .populate("space")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spaceId, reservationDate, startTime, endTime } = await req.json();

    if (!spaceId || !reservationDate || !startTime || !endTime) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    await connectDB();

    const overlapping = await Reservation.findOne({
      space: new mongoose.Types.ObjectId(spaceId),
      reservationDate: new Date(reservationDate),
      status: { $ne: "CANCELLED" },
      $or: [
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] },
      ],
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose a different time." },
        { status: 409 }
      );
    }

    const reservation = await Reservation.create({
      user: new mongoose.Types.ObjectId(session.user.id),
      space: new mongoose.Types.ObjectId(spaceId),
      reservationDate: new Date(reservationDate),
      startTime,
      endTime,
    });

    await reservation.populate("space");

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
