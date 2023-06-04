/* eslint-disable import/no-anonymous-default-export */
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  // res.send(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secert123');

      req.userId = decoded._id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
