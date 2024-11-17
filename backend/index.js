import express from 'express'
import route from './routes/index.js'
import { ErrNotFound } from './utils/error.js'
import cookieParser from 'cookie-parser'
import logger from './middleware/logger.js'
import cors from "cors"
import fs from "fs"
import https from "https"

const app = express()
const port = process.env.port || 3000

// Set CORS options
const corsOptions = {
    origin: ['https://26.200.221.212:4000', 'https://localhost:3001'], // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Liệt kê các phương thức cần dùng
    allowedHeaders: ['Content-Type', 'Authorization'], // Liệt kê các header cần dùng
    credentials: true // Nếu bạn đang sử dụng cookies         // Allows credentials (cookies, authorization headers, etc.)
};
// Đọc chứng chỉ và khóa riêng
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
app.use(logger);
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
//route
app.use("/api", route)

app.get("/", (req, res) => {
    res.send("hello world")
})

app.use((req, res, next) => {
    next(ErrNotFound);
});

//Error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.send({
        error: {
            status: err.statusCode || 500,
            message: err.message
        }
    });
});

https.createServer(options, app).listen(port, "0.0.0.0", function () {
    console.log(`Hosting on port ${port}`)
})