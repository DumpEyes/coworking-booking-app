import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    await connectDB();
    const spaces = await Space.find(type ? { type } : {}).sort({ createdAt: -1 });

    return NextResponse.json(spaces);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch spaces" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, imageUrl, capacity, pricePerHour, type } =
      await req.json();

    if (!title || !description || !imageUrl || !capacity || !pricePerHour || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();
    const space = await Space.create({ title, description, imageUrl, capacity, pricePerHour, type });

    return NextResponse.json(space, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create space" }, { status: 500 });
  }
}
