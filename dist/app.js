"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require("mongoose");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// import login strategy
require("./passport");
// Get .env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const userRouter = require("./routes/user");
const app = (0, express_1.default)();
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/", indexRouter);
app.use("/posts/", postRouter);
// Comments route includes middleware to pass post id to request
app.use("/posts/:id/comments/", (req, res, next) => {
    req.postId = req.params.id;
    next();
}, commentRouter);
app.use("/users/", userRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({ error: "error" });
});
module.exports = app;
//# sourceMappingURL=app.js.map