require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const giftsRouter = require('./gifts/gifts-router');
const authRouter = require('./auth/auth-router');
const tagsRouter = require('./tags/tags-router');
const usersRouter = require('./users/users-router');

const app = express();

//can remove if needed
app.use(express.json());

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/gifts', giftsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
