import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося отримати статті",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося отримати статті",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const filter = { _id: postId };
    const update = { $inc: { viewsCount: 1 } };

    let doc = await PostModel.findOneAndUpdate(filter, update);
    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося отримати статтю",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const filter = { _id: postId };

    await PostModel.findOneAndDelete(filter);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося отримати статтю",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося створити статтю",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(','),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Невдалося отримати статтю",
    });
  }
};
