import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { UserRouter } from '../Routes/UserRoutes/userRoutes.js'
import { RecruiterRouter } from '../Routes/RecruiterRoutes/recruiterRoutes.js'
import { AdminRouter } from '../Routes/AdminRoutes/adminRoutes.js'
import { CompanyRouter } from '../Routes/CompanyRoutes/companyRoutes.js'
import connectDB from '../Database/mongoClient.js'
import cron from '../Services/cron-jobs.js'

import Session  from 'express-session';

import passport from '../Services/googleAuth.js'


dotenv.config()

const app=express()

const port=process.env.PORT ||3000

app.use(cors({
  origin: '*', 
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

 app.use(cookieParser())
 app.use(
  Session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize())
app.use(passport.session())


 app.use(express.json())
 app.use(express.urlencoded({ extended: true }));

 app.use('/',UserRouter)
 app.use('/',RecruiterRouter)
 app.use('/',AdminRouter)
 app.use('/',CompanyRouter)

 connectDB().then(() => {
   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });
 }).catch(error => {
   console.error('Failed to connect to MongoDB', error);
 });