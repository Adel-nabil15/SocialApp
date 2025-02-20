import { PostModel } from "../../DB/models/post.model.js";
import { RoleType } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudnary/index.js";
import { asyncHandeler } from "../../utils/error/index.js";
import { paginattion } from "../../utils/pagination/index.js";

// -------------------------------- CreatPost --------------------------- ------------------
export const CreatePost = asyncHandeler(async (req, res, next) => {
  const { content } = req.body;
  const images = [];
  if (req?.files?.length) {
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: "socialApp/posts" }
      );
      images.push({ secure_url, public_id });
    }
    req.body.attachment = images;
  }
  const post = await PostModel.create({ ...req.body, userId: req.user._id });
  return res.status(200).json({ msg: "done", post });
});

// -------------------------------- updatePost ---------------------------------------------
export const updatePost = asyncHandeler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await PostModel.findOne({
    _id: postId,
    userId: req.user._id,
    isDelated: { $exists: false },
  });
  if (!post) {
    return next(new Error("post is not found or is deleat ", { cause: 400 }));
  }
  if (req.files.length) {
    for (const file of post.attachment) {
      await cloudinary.uploader.destroy(file.public_id);
    }
    const images = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: "socialApp/posts" }
      );
      images.push({ secure_url, public_id });
    }
    post.attachment = images;
  }
  if (req.body.content) {
    post.content = req.body.content;
  }
  await post.save();

  return res.status(200).json({ msg: "done", post });
});

// -------------------------------- freezPost ---------------------------------------------
export const freezPost = asyncHandeler(async (req, res, next) => {
  const { postId } = req.params;
  const condition =
    req.user.role == RoleType.Admin ? {} : { userId: req.user._id };
  const post = await PostModel.findOneAndUpdate(
    { _id: postId, ...condition, isDelated: { $exists: false } },
    { isDelated: true, DeleatedBy: req.user._id },
    { new: true }
  );
  if (!post) {
    return next(new Error("sorry error in freez", { cause: 400 }));
  }
  return res.status(200).json({ msg: "post is deleatd", post });
});

// -------------------------------- likePost ---------------------------------------------
export const likePost = asyncHandeler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await PostModel.findOne({
    _id: postId,
    isDelated: { $exists: false },
    likes: { $in: [req.user._id] },
  });
  let updatelike;
  let action;
  if (post) {
    updatelike = await PostModel.findOneAndUpdate(
      { _id: postId, isDelated: { $exists: false } },
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    action = "unlike";
  } else {
    updatelike = await PostModel.findOneAndUpdate(
      { _id: postId, isDelated: { $exists: false } },
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    action = "like";
  }
  if (!updatelike) {
    return next(new Error("post is not found or is deleated", { cause: 400 }));
  }

  return res.status(200).json({ msg: `${action}`, updatelike });
});

// -------------------------------- getPosts ---------------------------------------------
export const getPosts = asyncHandeler(async (req, res, next) => {
  //   .populate([
  //   {
  //     path:"comment",
  //     match:{commentId:{$exists:false}},
  //     populate:{path:"rebly"}
  //   }
  // ])
  const { data, _page } = await paginattion({
    page: req.query.page,
    model: PostModel,
  });
  return res.status(200).json({ msg: "done", _page, posts: data });
});
