import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate('post')
      .populate('user')
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
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
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await CommentModel.find({ post: { _id: req.params.id } })
      .populate('user')
      .populate('post')
      .exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить комментарии для данного поста',
    });
  }
};
