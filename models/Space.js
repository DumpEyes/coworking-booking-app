import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    type: { type: String, enum: ["COWORKING", "MEETING_ROOM"], required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Space || mongoose.model("Space", spaceSchema);
