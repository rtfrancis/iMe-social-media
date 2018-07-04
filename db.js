var spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);

module.exports.register = function register(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first, last`,
        [first || null, last || null, email || null, password || null]
    );
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return db.query(
        `
        SELECT id, first, last, password
        FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.currentUser = function currentUser(id) {
    return db.query(
        `
        SELECT id, first, last, bio, photo
        FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.userSearch = function userSearch(term) {
    return db.query(
        `SELECT id, first, last FROM userSearch
        WHERE first = $1
        OR last = $1
        `,
        [term]
    );
};

module.exports.uploadPhoto = function uploadPhoto(id, photo) {
    return db.query(
        `UPDATE users
        SET photo = $2
        WHERE id = $1
        RETURNING photo
        `,
        [id || null, photo]
    );
};

module.exports.uploadNewImage = function uploadNewImage(id, image) {
    return db.query(
        `INSERT INTO photos (user_id, image) VALUES ($1, $2) RETURNING id, user_id, image
        `,
        [id, image]
    );
};

module.exports.getUserImages = function getUserImages(id) {
    return db.query(`SELECT * FROM photos WHERE user_id = $1`, [id]);
};

module.exports.deleteUserImages = function deleteUserImages(id) {
    return db.query(
        `DELETE FROM photos
        WHERE user_id = $1)`,
        [id]
    );
};

module.exports.updateBio = function updateBio(id, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio
        `,
        [id || null, bio]
    );
};

module.exports.updateUserInfo = function updateUserInfo(id, first, last) {
    return db.query(
        `UPDATE users
        SET first = $2, last = $3
        WHERE id = $1
        RETURNING first, last
        `,
        [id, first, last]
    );
};

module.exports.userSearch = function userSearch(search) {
    return db.query(
        `SELECT id, first, last, photo FROM users
                    WHERE first ILIKE  $1 OR last ILIKE  $1`,
        [search + "%"]
    );
};

module.exports.allUsers = function allUsers() {
    return db.query(`SELECT id, first, last, photo FROM users`);
};

module.exports.makeRequest = function makeRequest(sender_id, recipient_id) {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id, status) VALUES ($1, $2, 1) RETURNING status, recipient_id, sender_id`,
        [sender_id, recipient_id]
    );
};

module.exports.secondRequest = function secondRequest(sender_id, recipient_id) {
    return db.query(
        `UPDATE friendships
        SET status = 1, sender_id = $1, recipient_id = $2
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        RETURNING status, recipient_id, sender_id
        `,
        [sender_id, recipient_id]
    );
};
module.exports.acceptRequest = function acceptRequest(recipient_id, sender_id) {
    return db.query(
        `UPDATE friendships
        SET status = 2
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        RETURNING status`,
        [recipient_id, sender_id]
    );
};

module.exports.getPendingAndFriends = function getPendingAndFriends(myId) {
    return db.query(
        `SELECT users.id, first, last, photo, status
        FROM friendships
        JOIN users
        ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)
        `,
        [myId]
    );
};

module.exports.getFriendStatus = function getFriendStatus(
    sender_id,
    recipient_id
) {
    return db.query(
        `SELECT status, recipient_id, sender_id FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (sender_id = $1 AND recipient_id = $2)
        ORDER BY created_at DESC LIMIT 1
        `,
        [sender_id, recipient_id]
    );
};

module.exports.endRequest = function endRequest(sender_id, recipient_id) {
    return db.query(
        `UPDATE friendships
        SET status = 0
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        RETURNING status`,
        [sender_id, recipient_id]
    );
};

module.exports.getFriends = function getFriends(myId) {
    return db.query(
        `SELECT sender_id, recipient_id, status  FROM friendships
        WHERE (sender_id = $1 OR recipient_id = $1)
        AND status = 2
        `,
        [myId]
    );
};

module.exports.getPendingFriends = function getPendingFriends(myId) {
    return db.query(
        `SELECT sender_id, recipient_id, status  FROM friendships
        WHERE (sender_id = $1 OR recipient_id = $1)
        AND status = 1
        `,
        [myId]
    );
};

module.exports.deleteProfile = function deleteProfile(myId) {
    return db.query(`DELETE FROM users WHERE id = $1`, [myId]);
};

module.exports.deleteAllFriendships = function deleteAllFriendships(myId) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id = $1 OR recipient_id = $1)
        `,
        [myId]
    );
};

module.exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    return db.query(
        `SELECT id, first, last, photo FROM users WHERE id = ANY($1)`,
        [arrayOfIds]
    );
};

module.exports.getNewOnlineUser = function getNewOnlineUser(id) {
    return db.query(`SELECT id, first, last, photo FROM users WHERE id = $1`, [
        id
    ]);
};

// /////////////////// CHAT QUERIES /////////////////////////
module.exports.insertChatMessage = function insertChatMessage(id, message) {
    return db.query(
        `INSERT INTO chats (user_id, message)
                    VALUES ($1, $2)
                    RETURNING id, user_id, message, created_at`,
        [id, message]
    );
};

module.exports.getChatMessages = function getChatMessages() {
    return db.query(`SELECT users.id, first, last, photo, chats.id, user_id, message, chats.created_at FROM users
        JOIN chats
        ON users.id = user_id
        ORDER BY created_at DESC LIMIT 10`);
};

module.exports.returnMessage = function returnMessage(id) {
    return db.query(
        `SELECT users.id, first, last, photo, message, chats.created_at FROM chats
        LEFT JOIN users
        ON users.id = user_id
        WHERE chats.id = $1
        `,
        [id]
    );
};

// /////////////////// PASSWORD FUNCTIONS /////////////////////////
module.exports.hashPassword = function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            console.log(salt);
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }

                resolve(hash);
            });
        });
    });
};

module.exports.checkPassword = function checkPassword(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
