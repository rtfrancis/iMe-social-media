import React from "react";
import { connect } from "react-redux";
import { onlineUsers, userJoined, userLeft } from "./actions.js";
import { Link } from "react-router-dom";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2>Users currently online</h2>
                {this.props.onlineUsers &&
                    this.props.onlineUsers.map(user => {
                        return (
                            <Link to={`/user/${user.id}`} key={user.id}>
                                <div className="onlineUser">
                                    <img
                                        className="userPhotos"
                                        src={user.photo || "/assets/user.png"}
                                    />
                                    {user.first} {user.last}
                                </div>
                            </Link>
                        );
                    })}
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(getStateFromRedux)(OnlineUsers);
