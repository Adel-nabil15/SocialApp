import { PostModel } from "../../DB/models/post.model.js";
import { RoleType, UserModel } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudnary/index.js";
import { eventEmiteer } from "../../utils/email/index.js";
import EN_CRYPT from "../../utils/encription/encript.js";
import { asyncHandeler } from "../../utils/error/index.js";
import COMPARE from "../../utils/hash/compare.js";
import HACH from "../../utils/hash/hash.js";
import C_token from "../../utils/token/creatToken.js";
import V_token from "../../utils/token/nerifyToken.js";

// ---------------------------- signUp ----------------------------------
export const signUp = asyncHandeler(async (req, res, next) => {
  const { name, email, phone, gender, password } = req.body;
  const ExistEmail = await UserModel.findOne({ email });
  if (ExistEmail) {
    return next(new Error("Email already Exist", { cause: 400 }));
  }
  // hash password
  const hash = await HACH({ Key: password, saltOrRounds: 9 });
  // encrypt phone
  const encPhone = await EN_CRYPT({
    Key: phone,
    KEY_SECRIT: process.env.PHONE_KEY,
  });
  //send email
  //eventEmiteer.emit("SendEmailOtp", { email });

  if (!req.file) {
    return next(new Error("sorry i nead file", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path
  );
  // creat user
  const user = await UserModel.create({
    name,
    email,
    phone: encPhone,
    password: hash,
    gender,
    images: {
      public_id,
      secure_url,
    },
  });
  return res.status(200).json({ msg: "done", user });
});
// ---------------------------- confirm ----------------------------------
export const Confirm = asyncHandeler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await UserModel.findOne({ email, confirmed: false });
  if (!user) {
    return next(
      new Error("sorry this email is already confirmed", { cause: 400 })
    );
  }
  if (!(await COMPARE({ Key: code, KEY_HASH: user.EmailOTP }))) {
    return next(new Error("sorry code is wrong", { cause: 400 }));
  }
  const confirmUser = await UserModel.findOneAndUpdate(
    { email },
    { confirmed: true, $unset: { EmailOTP: 0 } },
    { new: true }
  );
  return res.status(200).json({ msg: "done", confirmUser });
});
// ---------------------------- signIn ----------------------------------
export const signIn = asyncHandeler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, confirmed: true });
  if (!user) {
    return next(
      new Error("sorry this email is not exist or not confirmed", {
        cause: 400,
      })
    );
  }
  if (!(await COMPARE({ Key: password, KEY_HASH: user.password }))) {
    return next(new Error("sorry password is wrong", { cause: 400 }));
  }
  const access_token = await C_token({
    payload: { email, id: user._id },
    SECRIT_KEY:
      user.role == RoleType.User
        ? process.env.ACCESS_USER_KEY
        : user.role == RoleType.Admin
        ? process.env.ACCESS_ADMIN_KEY
        : process.env.ACCESS_SUPERADMIN_KEY,
    option: { expiresIn: "1d" },
  });
  const refresh_token = await C_token({
    payload: { email, id: user._id },
    SECRIT_KEY:
      user.role == RoleType.User
        ? process.env.REFRECH_USER_KEY
        : process.env.REFRECH_ADMIN_KEY,
    option: { expiresIn: "1w" },
  });
  let token = { access_token, refresh_token };
  return res.status(200).json({ msg: "done", token });
});
// ---------------------------- refrechToken ----------------------------
export const refrechToken = asyncHandeler(async (req, res, next) => {
  const { authorization } = req.body;
  let [prefex, token] = authorization.split(" ");
  if (!prefex || !token) {
    return next(new Error("sorry fix your authorization", { cause: 400 }));
  }
  let TOKEN = undefined;
  if (prefex == "Bearer") {
    TOKEN = process.env.REFRECH_USER_KEY;
  } else if (prefex == RoleType.Admin) {
    TOKEN = process.env.REFRECH_ADMIN_KEY;
  } else {
    return next(new Error("error in prefix", { cause: 400 }));
  }
  const decoded = await V_token({ token, SECRT_KEY: TOKEN });
  if (!decoded?.email) {
    return next(new Error("invalid email", { cause: 400 }));
  }
  const user = await UserModel.findOne({ email: decoded.email });
  const access_token = await C_token({
    payload: { email: user.email, id: user._id },
    SECRIT_KEY:
      user.role == RoleType.User
        ? process.env.ACCESS_USER_KEY
        : process.env.ACCESS_ADMIN_KEY,
    option: { expiresIn: "1d" },
  });
  return res.status(200).json({ msg: "done", access_token });
});
// ---------------------------- forgetPassword ---------------------------
export const forgetPassword = asyncHandeler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email, isDeleated: false });
  if (!user) {
    return next(
      new Error("sorry this email is deleated or not exist befor", {
        cause: 400,
      })
    );
  }
  eventEmiteer.emit("OTPFpassword", { email });
  return res.status(200).json({ msg: "done" });
});
// ---------------------------- reseatPassword ---------------------------
export const reseatPassword = asyncHandeler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const checkEmail = await UserModel.findOne({ email });
  if (!checkEmail) {
    return next(
      new Error("sorry this email is deleated or not exist befor", {
        cause: 400,
      })
    );
  }
  if (!COMPARE({ Key: code, KEY_HASH: checkEmail.otpFpassword })) {
    return next(new Error("sorry code is wrong", { cause: 400 }));
  }
  // hash new password
  const hash = await HACH({ Key: newPassword, saltOrRounds: 9 });
  // update password
  const user = await UserModel.findOneAndUpdate(
    { email },
    { password: hash, $unset: { otpFpassword: 0 } },
    { new: true }
  );

  return res.status(200).json({ msg: "done", user });
});
// ---------------------------- updateProfile -----------------------------
export const updateProfile = asyncHandeler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await EN_CRYPT({
      Key: req.body.phone,
      KEY_SECRIT: process.env.PHONE_KEY,
    });
  }
  if (req.file) {
    await cloudinary.uploader.destroy(req.user.images.public_id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "social-App/users" }
    );
    req.body.images = { public_id, secure_url };
  }
  const user = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    req.body,
    { new: true }
  );
  return res.status(200).json({ msg: "done", user });
});
// ---------------------------- updatePassword ----------------------------
export const updatePassword = asyncHandeler(async (req, res, next) => {
  const { oldPassword, newpassword } = req.body;
  if (!(await COMPARE({ Key: oldPassword, KEY_HASH: req.user.password }))) {
    return next(new Error("password is wrong", { cause: 400 }));
  }
  const hash = await HACH({ Key: newpassword, saltOrRounds: 9 });
  const user = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    { password: hash },
    { new: true }
  );
  return res.status(200).json({ msg: "done", user });
});

// ---------------------------- shareProfile ----------------------------
export const shareProfile = asyncHandeler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id, isDeleated: false });
  if (!user) {
    return next(new Error("sorry user not found", { cause: 400 }));
  }
  if (req.user._id.toString() === id) {
    return res.status(200).json({ msg: "done", user: req.user });
  }
  const emailExist = user.viewers.find((viewer) => {
    return viewer.userId.toString() === req.user._id.toString();
  });
  if (emailExist) {
    emailExist.time.push(Date.now());
    if (emailExist.time.length > 5) {
      emailExist.time = emailExist.time.slice(-5);
    }
  } else {
    user.viewers.push({ userId: req.user._id, time: [Date.now()] });
  }
  await user.save();
  return res.status(200).json({ msg: "done", user });
});

// ---------------------------- updateEmail ----------------------------
export const updateEmail = asyncHandeler(async (req, res, next) => {
  const { email } = req.body;
  const checkEmail = await UserModel.findOne({ email });
  if (checkEmail) {
    return next(new Error("sorry this email is alreadyexist", { cause: 400 }));
  }
  await UserModel.updateOne({ email: req.user.email }, { stepnEmail: email });

  eventEmiteer.emit("SendEmailOtp", { email: req.user.email });
  eventEmiteer.emit("SendnewEmailOtp", { email, id: req.user._id });

  return res.status(200).json({ msg: "done" });
});

// ---------------------------- fixedUpdate ----------------------------
export const fixedUpdate = asyncHandeler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (!(await COMPARE({ Key: oldCode, KEY_HASH: req.user.EmailOTP }))) {
    return next(new Error("error in old code", { cause: 400 }));
  }
  if (!(await COMPARE({ Key: newCode, KEY_HASH: req.user.EmailnewOTP }))) {
    return next(new Error("error in new code", { cause: 400 }));
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: req.user.id },
    {
      email: req.user.stepnEmail,
      $unset: {
        EmailOTP: 0,
        EmailnewOTP: 0,
        stepnEmail: 0,
      },
      changePasswordAt: Date.now(),
    },
    { new: true }
  );

  return res.status(200).json({ msg: "done", user });
});

// ---------------------------- dashportAdmin ----------------------------
export const dashportAdmin = asyncHandeler(async (req, res, next) => {
  const data = await Promise.race([PostModel.find({}), UserModel.find({})]);
  return res.status(200).json({ msg: "done", data });
});
// ---------------------------- UpdateRole ----------------------------
export const UpdateRole = asyncHandeler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;
  const data =
    req.user.role === RoleType.superAdmin
      ? { role: { $nin: [RoleType.superAdmin] } }
      : { role: { $nin: [RoleType.superAdmin, RoleType.Admin] } };
  const user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      isDeleated: false,
      ...data,
    },
    { role, updatedBY: req.user._id },
    { new: true }
  );
  if (!user) {
    return next(new Error("sorry this task can't do", { cause: 400 }));
  }
  return res.status(200).json({ msg: "done", user });
});
