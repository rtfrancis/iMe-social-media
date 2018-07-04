import axios from "./axios";

export function getMyInfo() {
    return axios.get("/user").then(resp => {
        return {
            type: "GET_MY_INFO",
            myInfo: resp.data
        };
    });
}
export function receiveFriendsAndWannabes() {
    return axios.get("/getfriends").then(resp => {
        return {
            type: "RECEIVE_FRIENDS_AND_WANNABES",
            list: resp.data
        };
    });
}

export function acceptFriendship(myId, senderId) {
    return axios
        .post("/acceptrequest", {
            recipient: myId,
            sender: senderId
        })
        .then(resp => {
            return {
                type: "ACCEPT_FRIENDSHIP",
                updatedFriend: senderId
            };
        });
}

export function terminateFriendship(myId, otherUserId) {
    return axios
        .post("/deleterequest", {
            sender: otherUserId,
            recipient: myId
        })
        .then(resp => {
            return {
                type: "END_FRIENDSHIP",
                deletedFriend: otherUserId
            };
        });
}

export function getUsersForSearch(search) {
    return axios
        .get(`/allUsers/search?q=${encodeURIComponent(search)}`)
        .then(resp => {
            return {
                type: "USER_SEARCH",
                userList: resp.data
            };
        });
}

export function onlineUsers(data) {
    return {
        type: "ONLINE_USERS",
        visitors: data
    };
}

export function userJoined(user) {
    return {
        type: "USER_JOINED",
        newVisitor: user
    };
}

export function userLeft(user) {
    return {
        type: "USER_LEFT",
        userLeft: user
    };
}

export function recentChatMessages(messages) {
    return {
        type: "RECENT_CHATS",
        messages: messages
    };
}

export function chatMessage(message) {
    return {
        type: "CHAT_MESSAGE",
        message: message
    };
}
export function uploadUserImage(formData) {
    return axios.post("/uploadwallimage", formData).then(({ data }) => {
        return {
            type: "IMAGE_UPLOADED"
        };
    });
}

export function getUserImages(id) {
    return axios.get(`/alluserimages/${id}`).then(({ data }) => {
        return {
            type: "GET_USER_IMAGES",
            photos: data
        };
    });
}
