module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://postgres@localhost/gift-closet',
  JWT_SECRET: process.env.JWT_SECRET,
};

// jwt for demo user : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTEwNzc2ODIsInN1YiI6ImRlbW9fdXNlciJ9.3vPjIgiq9V4Ec8mDzBZ9509DKxaDoOlGgfvsNCMNZrw
