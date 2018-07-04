import React from "react";
import { getSocket } from "./socket";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.socket = getSocket();
    }
    componentDidUpdate() {
        // this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
        console.log(this.elem.scrollHeight);
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    render() {
        return (
            <div id="chatComponent">
                <div
                    className="chatDisplay"
                    ref={elem => {
                        this.elem = elem;
                    }}
                >
                    {this.props.messages &&
                        this.props.messages.map(chat => {
                            return (
                                <div className="chatMessage" key={chat.id}>
                                    <Link to={`/user/${chat.user_id}`}>
                                        <img
                                            className="chatPhoto"
                                            src={
                                                chat.photo || "/assets/user.png"
                                            }
                                        />
                                    </Link>
                                    {chat.first} {chat.last}:
                                    <br />
                                    {chat.message}
                                    <br />
                                    {chat.created_at}
                                </div>
                            );
                        })}
                </div>
                <div className="chatTextBox">
                    <textarea
                        name="textarea"
                        ref={elem => {
                            this.textarea = elem;
                        }}
                    />
                    <button
                        onClick={() => {
                            this.socket.emit(
                                "chatMessage",
                                this.textarea.value
                            );
                            this.textarea.value = "";
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}
const getStateFromRedux = state => {
    return {
        messages: state.messages
    };
};

export default connect(getStateFromRedux)(Chat);
