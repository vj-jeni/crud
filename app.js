const express = require("express");
const bodyParser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");

const conn = require("./db.js")
const app = express();
const userRoutes = require("./middleware/middleware.js")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
            if(err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

app.use("/api/user",userRoutes)
const PORT = 9000;
app.listen(PORT, () => {
    console.log("Running successfully...", PORT);
});

conn()
.then(() => {
    console.log("Connected Successfully")
})
.catch((error) => {
    console.log("error : ", error)
})