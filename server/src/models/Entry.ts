
import mongoose, {
  Schema,
  Types,
  type InferSchemaType,
} from "mongoose";

const entryTypes = [
  "diary",
  "thought",
  "coding",
  "memory",
  "other",
] as const;

const moods = [
  "happy",
  "calm",
  "excited",
  "grateful",
  "neutral",
  "sad",
  "anxious",
  "stressed",
  "tired",
  "angry",
  "other",
] as const;

const entryStatuses = ["draft", "complete"] as const;

const entrySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: entryTypes,
      default: "diary",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    mood: {
      type: String,
      enum: moods,
    },

    entryDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: entryStatuses,
      default: "complete",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

entrySchema.index({ user: 1, entryDate: -1 });
entrySchema.index({ user: 1, isFavorite: 1 });

export type EntryType = InferSchemaType<typeof entrySchema>;

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;