import { body } from "express-validator";

export const registerValidation = [
  body('email', 'Неправильний формат пошти').isEmail(),
  body('password', 'Повинно бути мінімум 5 символів').isLength({min: 5}),
  body('fullName', 'Вкажіть імя').isLength({min: 3}),
  body('avatarUrl').optional().isURL(),
];