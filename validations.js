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

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть от 5 до 9 символов').isLength({
    min: 5,
    max: 9,
  }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введит тескт статьи')
    .isLength({
      min: 10,
    })
    .isString(),
  body('tags', 'Неверный формат тегов (укажите строчку)').optional().isString(),
  body('imgUrl', 'Некорректная ссылка на картинку').optional().isString(),
];