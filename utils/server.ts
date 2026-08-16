import express from 'express'
import info from '../globalInfo.ts';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import User from './User.ts';
import passport from 'passport';
import session from 'express-session';

const app = express();
const MONGO_URL = process.env.MONGO_URL;
await mongoose.connect(MONGO_URL!)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id)
  done(null, user)
})

app.use(express.json()) // So Json request bodies are seen

app.use(cors ({
  origin: info.origin,
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.post('/getUser', async (req, res) => {
  const keyUsing = req.body?.key || info.defaultKey
  let user : any = await User.findOne({key: keyUsing})

  if (!user) {
    user = await User.create({
      key: keyUsing,
      balance: 0
    });
  }

  req.login(user, (err) => {
    if (err) return res.json({error: err});
    res.json(user);
  })
});

app.post('/increaseBalance', async (req, res) => {
  const user : any = req.user
  if (!user) return res.json({error: 'no user'});

  user.balance += 100
  const updatedUser = await user.save()
  
  res.json(updatedUser)
})

app.listen(info.port, () => {
  console.log('Server running')
})