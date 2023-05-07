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

import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { registerValidation } from '../validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

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

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { password, email, fullName, avatarUrl } = req.body;
    const passwordSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, passwordSalt);

    const doc = new UserModel({
      email,
      fullName,
      passwordHash: hash,
      avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secert123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'Такой пользователь не существует',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Логин или пароль не верен',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secert123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('App start listen 4444');
});
