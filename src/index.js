import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { mkdirSync, existsSync } from "fs";
import cors from "cors";
import {
  registerValidation,
  // loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from "./validations.js";
import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connect ok");
  })
  .catch((err) => {
    console.log("I cannot connect to DB error :", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    try {
      if (!existsSync("uploads")) {
        mkdirSync("uploads");
      }
    } catch (error) {
      console.log(error);
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  // loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts/popular", PostController.getPopular);
app.get("/posts/new", PostController.getNew);
app.get("/posts/:id", PostController.getOne);

app.get("/posts", PostController.getAll);

app.get("/comments", CommentController.getAll);
app.get("/comments/:id", CommentController.getCommentsByPostId);

app.get("/tags", PostController.getLastTags);
app.get("/tags/:tagName", PostController.getOneTag);

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);

app.post(
  "/comments",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create
);

app.delete("/posts/:id", checkAuth, PostController.remove);

app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("App start listen 4444");
});
