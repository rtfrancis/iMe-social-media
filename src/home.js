import React from "react";
import { Link } from "react-router-dom";

export default function Landing(props) {
    return (
        <div>
            <div id="iconContainer">
                <Link to="/friends">
                    <img className="homeIcon" src="/assets/friends.png" />
                </Link>
                <Link to="/chat">
                    <img className="homeIcon" src="/assets/chat.png" />
                </Link>
                <Link to="/imagesuploader">
                    <img className="homeIcon" src="/assets/photos.jpg" />
                </Link>
                <img className="homeIcon" src="/assets/mail.png" />
                <Link to="/users">
                    <img className="homeIcon" src="/assets/contacts.png" />
                </Link>
                <Link to="/update">
                    <img className="homeIcon" src="/assets/settings.png" />
                </Link>
            </div>
        </div>
    );
}
