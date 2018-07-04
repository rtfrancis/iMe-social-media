import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePic(props) {
    return (
        <div className="userPhoto">
            <Link to="/profile">
                <img
                    className="profilePic"
                    src={props.url || "/assets/user.png"}
                />
            </Link>
            <img
                className="photoUpdate"
                onClick={props.actionToDo}
                src="/assets/sets.png"
            />
        </div>
    );
}
