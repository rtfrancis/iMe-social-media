import React from "react";
import { connect } from "react-redux";
import {
    getMyInfo,
    receiveFriendsAndWannabes,
    acceptFriendship,
    terminateFriendship
} from "./actions.js";
import { Link } from "react-router-dom";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
        this.props.dispatch(getMyInfo());
    }
    render() {
        return (
            <div className="friendsListDiv">
                <h2>Pending Friends</h2>
                <div className="pendingFriendList">
                    {this.props.pending &&
                        this.props.pending.map(pending => {
                            return (
                                <div className="eachPending" key={pending.id}>
                                    <Link
                                        to={`/user/${pending.id}`}
                                        key={pending.id}
                                    >
                                        <img
                                            className="userPhotos"
                                            src={
                                                pending.photo ||
                                                "/assets/user.png"
                                            }
                                        />
                                    </Link>
                                    {pending.first} {pending.last}
                                    <br />
                                    <p
                                        className="friendStatus"
                                        onClick={() =>
                                            this.props.dispatch(
                                                acceptFriendship(
                                                    this.props.myInfo.id,
                                                    pending.id
                                                )
                                            )
                                        }
                                    >
                                        Accept Request
                                    </p>
                                </div>
                            );
                        })}
                </div>
                <h2>Friends</h2>
                <div className="currentFriendList">
                    {this.props.friends &&
                        this.props.friends.map(friend => {
                            return (
                                <div className="eachFriend" key={friend.id}>
                                    <Link to={`/user/${friend.id}`}>
                                        <img
                                            className="userPhotos"
                                            src={
                                                friend.photo ||
                                                "/assets/user.png"
                                            }
                                        />
                                    </Link>
                                    {friend.first} {friend.last}
                                    <br />
                                    <p
                                        className="friendStatus"
                                        onClick={() =>
                                            this.props.dispatch(
                                                terminateFriendship(
                                                    this.props.myInfo.id,
                                                    friend.id
                                                )
                                            )
                                        }
                                    >
                                        End Friendship
                                    </p>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        pending:
            state.friendsList &&
            state.friendsList.filter(friend => friend.status == 1),
        friends:
            state.friendsList &&
            state.friendsList.filter(friend => friend.status == 2),
        myInfo: state.myInfo
    };
};

export default connect(getStateFromRedux)(Friends);
