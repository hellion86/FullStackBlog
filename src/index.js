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
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from '../validations.js';
import checkAuth from '../utils/checkAuth.js';
import * as UserController from '../controllers/UserController.js';

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

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('App start listen 4444');
});
