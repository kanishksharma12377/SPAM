import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDb from './config/db.js'
import {authCheck} from './middleware/authCheck.js';

import loginUser from './controller/loginUserController.js';
import logoutUser from './controller/logoutUserController.js';

import adminRouter from './routes/admin/adminRouter.js';
import studentRouter from './routes/student/studentRouter.js';

const app = express();

// CORS configuration - allow frontend to connect
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.post('/api/login',loginUser);
app.post('/api/logout',authCheck,logoutUser);
app.use('/api/admin',adminRouter);
app.use('/api',studentRouter);
app.use((req, res) => res.status(404).json({
  success : false, 
  message : "api route not exist"
}));

const PORT = process.env.PORT || 3000;

connectDb().then(()=>{
  app.listen(PORT, ()=> {
    console.log(`server started on port ${PORT}`);
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});