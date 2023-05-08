import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
// Сделал по своему, убрал try/catch и оставил только промиы вместо коллбека
export const remove = (req, res) => {
  const postId = req.params.id;

  PostModel.findOneAndDelete({
    _id: postId,
  })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена, возможно удалена',
        });
      }
      return res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: 'Не корректный id статьи',
      });
    });
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      }
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена, возможно удалена',
          });
        }

        return res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось вернуть  статью',
        });
      });

    // PostModel.findOneAndUpdate(
    //   {
    //     _id: postId,
    //   },
    //   {
    //     $inc: { viewsCount: 1 },
    //   },
    //   {
    //     returnDocument: 'after',
    //   },

    //   (err, doc) => {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).json({
    //         message: 'Не удалось вернуть  статью',
    //       });
    //     }
    //     if (!doc) {
    //       return res.status(404).json({
    //         message: 'Статья не найдена, возможно удалена',
    //       });
    //     }
    //     res.json(doc);
    //   }
    // );
    // const post = await PostModel.findById(postId);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, tags, imgUrl } = req.body;
    const doc = new PostModel({
      title,
      text,
      tags,
      user: req.userId,
      imgUrl,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = (req, res) => {
  const postId = req.params.id;
  const { title, text, imgUrl, tags } = req.body;
  const user = req.userId;

  PostModel.updateOne(
    {
      _id: postId,
    },
    {
      title,
      text,
      imgUrl,
      user,
      tags,
    }
  )
    .then(() => {
      return res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: 'Не корректный id статьи',
      });
    });
};
