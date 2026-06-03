import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const space = await Space.findById(id);
    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(space)));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch space" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const data = await req.json();
    await connectDB();
    const space = await Space.findByIdAndUpdate(id, data, { new: true });
    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(space)));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update space" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    await Space.findByIdAndDelete(id);
    return NextResponse.json({ message: "Space deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete space" }, { status: 500 });
  }
}
