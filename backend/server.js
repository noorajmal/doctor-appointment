import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectcloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoute.js';



const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectcloudinary();
app.use(express.json());
app.use(cors());
//api endpoint
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);


app.get('/', (req, res) => {
    res.send("api working");
})
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
