
// require('dotenv').config();

import express from "express";
import multer from "multer";
import cors from 'cors';

import mongoose, { get } from "mongoose";

import { registerValidation } from "./validations/auth.js";

import {handleValidationErrors, checkAuth} from "./utils/index.js";

import {PostController, UserController} from './controllers/index.js';

import { postCreateValidation } from "./validations/post.js";

// const MONGODB_URI = "mongodb+srv://user:wwwwww@cluster0.m45kuw9.mongodb.net/blog?retryWrites=true&w=majority"


mongoose
  .connect(
    "mongodb+srv://user:wwwwww@cluster0.m45kuw9.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  return res.json({message: 'Server OK'});    
});

app.post("/auth/login", handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation,PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
