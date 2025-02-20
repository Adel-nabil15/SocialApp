import checkDBC from "./DB/DBC.js";
import commentRouter from "./modules/comment/comment.controller.js";
import PostRouter from "./modules/posts/post.controller.js";
import UserRouter from "./modules/users/user.controller.js";
import { globalHandelerror } from "./utils/error/index.js";
import path from "path";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  limit:8,
  windowMs: 60*1000
})
const bootstrap = (express, app) => {
  app.use(express.json());
  checkDBC();
  app.use(limiter)
  // model routing
  app.use("/users", UserRouter);
  app.use("/posts", PostRouter);
  app.use("/comments", commentRouter);
  app.use(globalHandelerror);
  app.use("/uploads", express.static(path.resolve("uploads")));

  // main rout
  app.get("/", (req, res, next) => {
    res.status(400).json("Helo in my social app ");
  });

  app.use("*", (req, res) => {
    res.status(400).json("this URL is wrong ");
  });
};

export default bootstrap;
