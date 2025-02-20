import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      requred: true,
      minLength: 3,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    DeleatedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    attachment: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    isDelated: Boolean,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

commentSchema.virtual("rebly", {
  ref: "comment",
  localField: "_id",
  foreignField: "refId",
});

export const commentModel = mongoose.model("comment", commentSchema);
