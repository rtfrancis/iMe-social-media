const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db.js");
const csurf = require("csurf");
const bodyParser = require("body-parser");
const secrets = require("./secrets");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const s3 = require("./s3");
const config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("public"));

app.use(compression());

app.use(require("cookie-parser")());

const cookieSessionMiddleware = cookieSession({
    secret: secrets.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// /////////////// ROUTES ///////////////////////////

app.post("/register", function(req, res) {
    db
        .hashPassword(req.body.password)
        .then(function(hashedPass) {
            return db.register(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPass
            );
        })
        .then(function(userId) {
            req.session.userId = userId.rows[0].id;
        })
        .then(function() {
            res.json({
                success: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/login", function(req, res) {
    let userId;
    db
        .getUserByEmail(req.body.email)
        .then(function(data) {
            userId = data.rows[0].id;
            return db.checkPassword(req.body.password, data.rows[0].password);
        })
        .then(function(data) {
            if (data == false) {
                throw new Error();
            } else {
                req.session.userId = userId;
                res.json({
                    success: true
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/user", function(req, res) {
    db
        .currentUser(req.session.userId)
        .then(function(data) {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    return db
        .uploadPhoto(req.session.userId, config.s3Url + req.file.filename)
        .then(function(result) {
            res.json(result.rows[0].photo);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/uploadwallimage", uploader.single("file"), s3.upload, (req, res) => {
    return db
        .uploadNewImage(req.session.userId, config.s3Url + req.file.filename)
        .then(function(result) {
            res.json(result.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/alluserimages/:id", function(req, res) {
    return db.getUserImages(req.params.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/uploadbio", function(req, res) {
    db
        .updateBio(req.session.userId, req.body.bio)
        .then(function(data) {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/users/:id.json", function(req, res) {
    if (req.session.userId == req.params.id) {
        res.json({ redirectHome: true });
        return;
    }
    db
        .currentUser(req.params.id)
        .then(data => {
            if (!data.rows[0]) {
                res.json({ redirectHome: true });
                return;
            }
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/getfriendstatus/:id", function(req, res) {
    db.getFriendStatus(req.session.userId, req.params.id).then(data => {
        res.json(data.rows[0]);
    });
});

app.post("/makerequest", function(req, res) {
    db
        .makeRequest(req.session.userId, req.body.recipient)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/acceptrequest", function(req, res) {
    db
        .acceptRequest(req.body.recipient, req.body.sender)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/secondrequest", function(req, res) {
    db
        .secondRequest(req.session.userId, req.body.recipient)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/deleterequest", function(req, res) {
    db
        .endRequest(req.body.sender, req.body.recipient)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/updateinfo", function(req, res) {
    db
        .updateUserInfo(req.body.id, req.body.first, req.body.last)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/getfriends", function(req, res) {
    db
        .getPendingAndFriends(req.session.userId)
        .then(data => {
            res.json(data.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/allUsers/search", function(req, res) {
    db
        .userSearch(req.query.q)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/allUsers", function(req, res) {
    db
        .allUsers()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/deleteuserprofile", function(req, res) {
    Promise.all([
        db.deleteProfile(req.session.userId),
        db.deleteAllFriendships(req.session.userId),
        db.deleteUserImages(req.session.userId)
    ]).then(() => {
        req.session = null;
        res.json({ deleted: true });
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const socketId = socket.id;
    const userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;
    var userIds = Object.values(onlineUsers);

    db.getUsersByIds(Object.values(onlineUsers)).then(({ rows }) => {
        socket.emit("onlineUsers", rows);
    });

    db.getChatMessages().then(({ rows }) => {
        io.sockets.emit("recentChatMessages", rows.reverse());
    });

    let count = Object.values(onlineUsers).filter(id => id == userId).length;

    socket.on("chatMessage", message => {
        db.insertChatMessage(userId, message).then(({ rows }) => {
            let chatId = rows[0].id;
            db.returnMessage(chatId).then(({ rows }) => {
                io.sockets.emit("chatMessage", rows[0]);
            });
        });
    });

    if (count == 1) {
        db.getNewOnlineUser(userId).then(({ rows }) => {
            socket.broadcast.emit("userJoined", rows);
        });
    }

    socket.on("disconnect", function() {
        const thisUserId = onlineUsers[socketId];
        delete onlineUsers[socketId];
        let userIndex = userIds.indexOf(userId);
        userIds.splice(userIndex, 1);
        if (userIds.indexOf(userId) == -1) {
            io.sockets.emit("userLeft", thisUserId);
        }
    });
});
