import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: "USER" } },
  { timestamps: true }
);

const spaceSchema = new mongoose.Schema(
  { title: String, description: String, imageUrl: String, capacity: Number, pricePerHour: Number, type: String },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Space = mongoose.models.Space || mongoose.model("Space", spaceSchema);

await mongoose.connect(process.env.MONGODB_URI);

// Seed admin and demo user
const adminPassword = await bcrypt.hash("admin123", 10);
const userPassword = await bcrypt.hash("user123", 10);

await User.deleteMany({});
await User.insertMany([
  { name: "Admin User", email: "admin@cowork.com", password: adminPassword, role: "ADMIN" },
  { name: "Demo User", email: "user@cowork.com", password: userPassword, role: "USER" },
]);

await Space.deleteMany({});
await Space.insertMany([
  {
    title: "Open Coworking Space",
    description: "A vibrant open-plan workspace perfect for freelancers and remote workers. Enjoy a collaborative atmosphere with high-speed internet.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    capacity: 30,
    pricePerHour: 15,
    type: "COWORKING",
  },
  {
    title: "Premium Coworking Suite",
    description: "Upscale coworking environment with premium amenities, ergonomic furniture, and a quiet, professional atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    capacity: 20,
    pricePerHour: 25,
    type: "COWORKING",
  },
  {
    title: "Small Meeting Room",
    description: "Intimate meeting room ideal for small team discussions, client calls, and interviews. Equipped with a display screen.",
    imageUrl: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800",
    capacity: 6,
    pricePerHour: 30,
    type: "MEETING_ROOM",
  },
  {
    title: "Large Conference Room",
    description: "Spacious conference room for large team meetings and presentations. Includes projector and video conferencing setup.",
    imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800",
    capacity: 20,
    pricePerHour: 60,
    type: "MEETING_ROOM",
  },
  {
    title: "Creative Studio",
    description: "Inspiring creative space with whiteboards and collaborative tools. Perfect for brainstorming sessions.",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    capacity: 12,
    pricePerHour: 20,
    type: "COWORKING",
  },
  {
    title: "Executive Boardroom",
    description: "Premium boardroom with executive furnishings. Ideal for board meetings and high-profile client presentations.",
    imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800",
    capacity: 16,
    pricePerHour: 90,
    type: "MEETING_ROOM",
  },
]);

console.log("Seed complete: 2 users and 6 spaces created.");
await mongoose.disconnect();
