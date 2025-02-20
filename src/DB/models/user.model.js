import mongoose, { Mongoose } from "mongoose";
export const GenderType = {
  Male: "male",
  Female: "female",
};
export const RoleType = {
  User: "user",
  Admin: "admin",
  superAdmin: "superadmin",
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(GenderType),
      default: GenderType.Male,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(RoleType),
      default: RoleType.User,
    },
    images: {
      public_id: String,
      secure_url: String,
    },
    CoverImages: [String],
    EmailOTP: {
      type: String,
    },
    stepnEmail: String,
    EmailnewOTP: {
      type: String,
    },
    isDeleated: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    changePasswordAt: Date,
    otpFpassword: {
      type: String,
    },
    viewers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        time: [Date],
      },
    ],
    updatedBY: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("user", UserSchema);
