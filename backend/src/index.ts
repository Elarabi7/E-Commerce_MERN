import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import cartRoute from './routes/cartRoute';
import { seedInitialProducts } from './services/productService';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors())

mongoose
    .connect(process.env.DATABASE_URL || '')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => console.log('Error connecting to MongoDB', err));

seedInitialProducts()

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});