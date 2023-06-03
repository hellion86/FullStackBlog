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

export const getNew = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .sort({ createdAt: 'desc' })
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getPopular = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .sort({ viewsCount: 'desc' })
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(1)
      .slice(-5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить тэги',
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
      .populate('user')
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOneTag = async (req, res) => {
  try {
    const tag = req.params.tagName;
    console.log(tag);

    PostModel.find({ tags: tag })
      .populate('user')
      .then((doc) => {
        if (!doc) {
          return res.status(400).json({
            messsage: 'Таких тегов нет в наших постах',
          });
        }
        return res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось вернуть список статей по тегу',
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body;
    console.log(tags);
    const doc = new PostModel({
      title,
      text,
      tags: tags.split(','),
      user: req.userId,
      imageUrl,
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

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl, tags } = req.body;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title,
        text,
        tags: tags.split(','),
        user: req.userId,
        imageUrl,
      }
    );
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Не корректный id статьи',
    });
  }
};
