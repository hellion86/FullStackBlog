import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть от 5 до 9 символов').isLength({
    min: 5,
    max: 9,
  }),
  body('fullName', 'Миниамальная длина имени - 3 символа').isLength({ min: 3 }),
  body('avatarUrl', 'Некорректная ссылка на аватар').optional().isURL(),
];
