import { Router } from "express";
import { CreatePost, freezPost, getPosts, likePost, updatePost } from "./post.service.js";
import { fileType, multerHost } from "../../middleware/multer.js";
import { Authenticationn } from "../../middleware/Auth.js";
import commentRouter from "../comment/comment.controller.js";
const PostRouter=Router()
PostRouter.use("/:refId/comments",commentRouter)

PostRouter.post("/",multerHost(fileType.images).array("attachment",5),Authenticationn, CreatePost)
PostRouter.patch("/:postId",multerHost(fileType.images).array("attachment",5),Authenticationn, updatePost)
PostRouter.delete("/freezPost/:postId",Authenticationn, freezPost)
PostRouter.patch("/likePost/:postId",Authenticationn, likePost)
PostRouter.get("/getPosts", getPosts)

  

 




export default PostRouter