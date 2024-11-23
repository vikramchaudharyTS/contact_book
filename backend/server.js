import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import controllerRoutes from './routes/contacts.routes.js'

const app = express()

app.use(cors({
    origin: "*"
}))


app.use('/api/auth/', authRoutes)
app.use('/api/contacts/', controllerRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
