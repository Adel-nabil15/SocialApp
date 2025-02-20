import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
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
PostSchema.virtual("comment", {
  ref: "comment",
  localField: "_id",
  foreignField: "refId",
});

export const PostModel = mongoose.model("post", PostSchema);
