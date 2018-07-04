export default function(state = {}, action) {
    if (action.type == "GET_MY_INFO") {
        state = Object.assign({}, state, {
            myInfo: action.myInfo
        });
    }

    if (action.type == "RECEIVE_FRIENDS_AND_WANNABES") {
        state = Object.assign({}, state, {
            friendsList: action.list
        });
    }

    if (action.type == "ACCEPT_FRIENDSHIP") {
        const copyFriendsList = state.friendsList.map(friend => {
            if (friend.id == action.updatedFriend) {
                friend.status = 2;
            }
            return friend;
        });
        state = Object.assign({}, state, {
            friendsList: copyFriendsList
        });
    }

    if (action.type == "END_FRIENDSHIP") {
        const copyFriendsList = state.friendsList.map(friend => {
            if (friend.id == action.deletedFriend) {
                friend.status = 0;
            }
            return friend;
        });
        state = Object.assign({}, state, {
            friendsList: copyFriendsList
        });
    }

    if (action.type == "USER_SEARCH") {
        let box = document.querySelector(".searchResults");
        if (action.userList == []) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        if (action.userList.length > 10) {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
        state = Object.assign({}, state, {
            searchResults: action.userList
        });
    }

    if (action.type == "ONLINE_USERS") {
        state = Object.assign({}, state, {
            onlineUsers: action.visitors
        });
    }

    if (action.type == "USER_JOINED") {
        state = Object.assign({}, state, {
            onlineVisitors: state.onlineUsers.concat(action.newVisitor)
        });
    }

    if (action.type == "USER_LEFT") {
        state = Object.assign({}, state, {
            onlineVisitors: state.onlineUsers.filter(
                user => user.id != action.userLeft
            )
        });
    }

    if (action.type == "CHAT_MESSAGE") {
        state = Object.assign({}, state, {
            messages: [...state.messages, action.message]
        });
    }

    if (action.type == "RECENT_CHATS") {
        state = Object.assign({}, state, {
            messages: action.messages
        });
    }

    if (action.type == "GET_USER_IMAGES") {
        state = Object.assign({}, state, {
            images: action.photos
        });
    }

    return state;
}
