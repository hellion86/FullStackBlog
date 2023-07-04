import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate("post")
      .populate("user")
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.body.postId,
      user: req.userId,
    });

    const comment = await doc.save();
    //TODO: проверить обработку ошибки, нужна ли она? Что делает then после findOneAndUpdate
    PostModel.findOneAndUpdate(
      {
        _id: req.body.postId,
      },
      {
        $inc: { commentsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена, возможно удалена",
        });
      }
    });

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};

// TODO : remove if necessary
export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await CommentModel.find({ post: { _id: req.params.id } })
      .populate("user")
      .populate("post")
      .exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить комментарии для данного поста",
    });
  }
};
