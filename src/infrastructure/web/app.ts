import * as dotenv from 'dotenv';
import express from 'express';
import mongoose, { mongo } from 'mongoose';
import { userRoutes } from './routes/userRoutes';
import bodyParser from 'body-parser';
import path from 'path';
import { authRoutes } from './routes/authRoutes';

const app = express();

// dotenv.config({ path: __dirname + './../../../config.env' });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', 'config.env') });
const DB_PASSWORD = process.env.DATABASE_PASSWORD || '';

// @ts-ignore: Object is possibly 'null'.
const DB = process.env.DATABASE.replace('<PASSWORD>', DB_PASSWORD);

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

module.exports = app;

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
