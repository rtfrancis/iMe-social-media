import * as io from "socket.io-client";
import { createStore, applyMiddleware } from "redux";
import {
    onlineUsers,
    userJoined,
    userLeft,
    chatMessage,
    recentChatMessages
} from "./actions";

let socket;

export function getSocket(store) {
    if (!socket && store) {
        console.log("THIS IS STORE", store);
        socket = io.connect();

        socket.on("onlineUsers", user => {
            store.dispatch(onlineUsers(user));
        });

        socket.on("userJoined", user => {
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", id => {
            store.dispatch(userLeft(id));
        });

        socket.on("recentChatMessages", messages => {
            store.dispatch(recentChatMessages(messages));
        });

        socket.on("chatMessage", message => {
            store.dispatch(chatMessage(message));
        });
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
