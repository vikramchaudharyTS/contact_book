import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import controllerRoutes from './routes/contacts.routes.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()

dotenv.config()
app.use(cors({
    origin: "*",
    credentials: true 
}))


app.use(cookieParser())
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth/', authRoutes)
app.use('/api/contacts/', controllerRoutes)


app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
