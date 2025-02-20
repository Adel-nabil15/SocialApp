import EventEmitter from "events";
import { nanoid, customAlphabet } from "nanoid";
import Send_Email from "../../service/sendEmail.js";
import { UserModel } from "../../DB/models/user.model.js";
import HACH from "../hash/hash.js";

export const eventEmiteer = new EventEmitter();

// -----------------OTP CONFIRMED ----------------------------------
eventEmiteer.on("SendEmailOtp", async (data) => {
  const { email } = data;
  const otp = customAlphabet("123456789", 4)();
  const hash = await HACH({ Key: otp, saltOrRounds: 9 });
  await UserModel.findOneAndUpdate(
    { email },
    { EmailOTP: hash },
    { new: true }
  );
  Send_Email({ to: email, subject: "confirm me", html: `<h1>${otp}</h1>` });
});
// -----------------OTP newEmail ----------------------------------
eventEmiteer.on("SendnewEmailOtp", async (data) => {
  const { email, id } = data;
  const otp = customAlphabet("123456789", 4)();
  const hash = await HACH({ Key: otp, saltOrRounds: 9 });
  await UserModel.findOneAndUpdate(
    { _id: id },
    { EmailnewOTP: hash },
    { new: true }
  );
  Send_Email({ to: email, subject: "new email", html: `<h1>${otp}</h1>` });
});

// -----------------OTP ForgetPassword ----------------------------------
eventEmiteer.on("OTPFpassword", async (data) => {
  const { email } = data;
  const otp = customAlphabet("123456789", 4)();
  const hash = await HACH({ Key: otp, saltOrRounds: 9 });
  await UserModel.findOneAndUpdate(
    { email },
    { otpFpassword: hash },
    { new: true }
  );
  Send_Email({ to: email, subject: "confirm me", html: `<h1>${otp}</h1>` });
});
