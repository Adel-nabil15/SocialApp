import { commentModel } from "../../DB/models/comment.model.js";
import { PostModel } from "../../DB/models/post.model.js";
import { RoleType } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudnary/index.js";
import { asyncHandeler } from "../../utils/error/index.js";

// -------------------------------- creatComment ---------------------------------------------
export const creatComment = asyncHandeler(async (req, res, next) => {
  const { refId } = req.params;
  const { onModel } = req.body;

  if (onModel == "post") {
    const post = await PostModel.findOne({
      _id: refId,
      isDelated: { $exists: false },
    });
    if (!post) {Ff
      return next(new Error("post is not found or deleated", { cause: 400 }));
    }
  } else {
    const comment = await commentModel.findOne({
      _id: refId,
      isDelated: { $exists: false },
    });
    if (!comment) {
      return next(
        new Error("comment is not found or deleated", { cause: 400 })
      );
    }
  }
  if (req.files.length) {
    let images = [];
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: "socialApp/comment" }
      );
      images.push({ public_id, secure_url });
    }
    req.body.attachment = images;
  }
  const comment = await commentModel.create({
    ...req.body,
    refId,
    userId: req.user._id,
  });

  return res.status(200).json({ msg: "done", comment });
});

// -------------------------------- updateComment  -------------------------------------------
export const updateComment = asyncHandeler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const comment = await commentModel
    .findOne({
      _id: commentId,
      isDelated: { $exists: false },
      postId,
      userId: req.user._id,
    })
    .populate([{ path: "postId" }]);

  if (!comment || comment?.postId?.isDelated) {
    return next(
      new Error("comment not found or post is deleted", { cause: 400 })
    );
  }
  if (req.files.length) {
    for (const file of comment.attachment) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    let images = [];
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: "socialApp/comment" }
      );
      images.push({ public_id, secure_url });
    }
    req.body.attachment = images;
  }
  const newcomment = await commentModel.findByIdAndUpdate(
    { _id: commentId },
    req.body,
    { new: true }
  );
  return res.status(200).json({ msg: "done", comment: newcomment });
});

// -------------------------------- freazeComment  -------------------------------------------
export const freazeComment = asyncHandeler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const comment = await commentModel
    .findOne({
      _id: commentId,
      isDelated: { $exists: false },
      postId,
    })
    .populate([{ path: "postId" }]);

  if (
    !comment ||
    (req.user.role != RoleType.Admin &&
      req.user._id.toString() !== comment.userId.toString() &&
      req.user._id.toString() !== comment.postId.userId.toString())
  ) {
    return next(new Error("can't delet comment", { cause: 400 }));
  }
  const newcomment = await commentModel.findByIdAndUpdate(
    { _id: commentId },
    { isDelated: true, DeleatedBy: req.user._id },
    { new: true }
  );
  return res.status(200).json({ msg: "deleted done", newcomment });
});
