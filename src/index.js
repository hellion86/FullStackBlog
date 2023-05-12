// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// mongodb+srv://vmezhurevsky:7NqUCHEhC2W58SfH@cluster0.uyeddc1.mongodb.net/test

import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from '../validations.js';
import { UserController, PostController } from '../controllers/index.js';
import { checkAuth, handleValidationErrors } from '../utils/index.js';

mongoose
  .connect(
    'mongodb+srv://vmezhurevsky:7NqUCHEhC2W58SfH@cluster0.uyeddc1.mongodb.net/blog'
  )
  .then(() => {
    console.log('DB connect ok');
  })
  .catch((err) => {
    console.log('I cannot connect to DB error :', err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    // console.log('file is', file);
    // cb(null, file.fieldname + '-' + Date.now());
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts/:id', PostController.getOne);

app.get('/posts', PostController.getAll);

app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);

app.delete('/posts/:id', checkAuth, PostController.remove);

app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('App start listen 4444');
});
