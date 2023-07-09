/* eslint-disable consistent-return */
const { JWT_SECRET, NODE_ENV } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'super_secret'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequest('Введены некорретные данные'));
          }
          next(err);
        });
    }).catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};

const updateUser = (req, res, next, newData) => {
  User.findByIdAndUpdate(
    req.user._id,
    newData,
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    throw new NotFound('Пользователь с указанным id не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

module.exports = {
  getUsers,
  getUser,
  login,
  createUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
