import { RoleType, UserModel } from "../DB/models/user.model.js";
import { asyncHandeler } from "../utils/error/index.js";
import V_token from "../utils/token/nerifyToken.js";

export const Authenticationn = async (req, res, next) => {
  const { authorization } = req.headers;
  let [prefex, token] = authorization.split(" ");
  if (!prefex || !token) {
    return next(new Error("sorry fix your authorization", { cause: 400 }));
  }
  let TOKEN = undefined;
  if (prefex == "Bearer") {
    TOKEN = process.env.ACCESS_USER_KEY;
  } else if (prefex == RoleType.Admin) {
    TOKEN = process.env.ACCESS_ADMIN_KEY;
  } else if (prefex == "superadmin") {
    TOKEN = process.env.ACCESS_SUPERADMIN_KEY;
  } else {
    return next(new Error("error in prefix", { cause: 400 }));
  }
  const decoded = await V_token({ token, SECRT_KEY: TOKEN });
  if (!decoded?.email) {
    return next(new Error("invalid email", { cause: 400 }));
  }
  const user = await UserModel.findOne({ email: decoded.email });
  if (parseInt(user?.changePasswordAt?.getTime() / 1000) > decoded.iat) {
    return next(new Error("sorry invalid token", { cause: 400 }));
  }

  req.user = user;
  next();
};

export const Authorization = (accessrole = []) => {
  return asyncHandeler(async (req, res, next) => {
    if (!accessrole.includes(req.user.role)) {
      return next(new Error("this email not allow ", { cause: 400 }));
    }
    next();
  });
};
