import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";
import FriendButton from "./friendbutton";

class UserDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/allUsers")
            .then(data => {
                this.setState({
                    users: data.data
                });
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    render() {
        return (
            <div className="userContainer">
                <div className="innerUserContainer">
                    {this.state.users &&
                        this.state.users.map(user => {
                            return (
                                <Link to={`/user/${user.id}`} key={user.id}>
                                    <div className="eachUser" key={user.id}>
                                        {" "}
                                        <img
                                            className="userPhotos"
                                            src={
                                                user.photo || "/assets/user.png"
                                            }
                                        />{" "}
                                        {user.first} {user.last}
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>
        );
    }
}

export default UserDisplay;
