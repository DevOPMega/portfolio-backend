const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/index");

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
    origin: process.env.ORIGIN, //included origin as true
    methods: "GET,POST,DELETE,PUT,PATCH,HEAD",
    credentials: true, //included credentials as true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})