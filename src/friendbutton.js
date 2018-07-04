import React from "react";
import axios from "./axios";

class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.makeRequest = this.makeRequest.bind(this);
        this.setButtonText = this.setButtonText.bind(this);
        this.acceptRejectRequest = this.acceptRejectRequest.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        this.secondRequest = this.secondRequest.bind(this);
    }
    setButtonText() {
        const { friendStatus, recipient } = this.state;
        if (friendStatus == 1) {
            if (recipient == this.props.otherUserId) {
                this.setState({
                    buttonText: "Cancel Request",
                    buttonAction: this.acceptRejectRequest
                });
            } else {
                this.setState({
                    buttonText: "Accept Request",
                    buttonAction: this.acceptRejectRequest
                });
            }
        } else if (friendStatus == 2) {
            this.setState({
                buttonText: "End Friendship",
                buttonAction: this.deleteRequest
            });
        } else if (friendStatus == 0) {
            this.setState({
                buttonText: "Send Friend Request",
                buttonAction: this.secondRequest
            });
        } else {
            this.setState({
                buttonText: "Send Friend Request",
                buttonAction: this.makeRequest
            });
        }
    }

    makeRequest() {
        if (!this.state.friendStatus) {
            axios
                .post("/makerequest", {
                    recipient: this.props.otherUserId
                })
                .then(({ data }) => {
                    console.log("HERE IS WHAT I NEED: ", data);
                    this.setState(
                        {
                            friendStatus: data.status,
                            recipient: data.recipient_id,
                            sender: data.sender_id
                        },
                        () => this.setButtonText()
                    );
                });
        }
    }
    secondRequest() {
        if (this.state.friendStatus == 0) {
            axios
                .post("/secondrequest", {
                    recipient: this.props.otherUserId
                })
                .then(({ data }) => {
                    console.log("This is an update for second request:", data);
                    this.setState(
                        {
                            friendStatus: data.status,
                            recipient: data.recipient_id,
                            sender: data.sender_id
                        },
                        () => this.setButtonText()
                    );
                });
        }
    }
    acceptRejectRequest() {
        if (this.state.friendStatus == 1) {
            if (this.state.recipient == this.props.otherUserId) {
                axios
                    .post("/deleterequest", {
                        recipient: this.state.recipient,
                        sender: this.state.sender
                    })
                    .then(({ data }) => {
                        this.setState(
                            {
                                friendStatus: data.status
                            },
                            () => this.setButtonText()
                        );
                        console.log(data);
                    });
            } else {
                axios
                    .post("/acceptrequest", {
                        recipient: this.state.recipient,
                        sender: this.state.sender
                    })
                    .then(({ data }) => {
                        console.log(data);
                        this.setState(
                            {
                                friendStatus: data.status
                            },
                            () => this.setButtonText()
                        );
                    });
            }
        }
    }
    deleteRequest() {
        if (this.state.friendStatus == 2) {
            axios
                .post("/deleterequest", {
                    recipient: this.state.recipient,
                    sender: this.state.sender
                })
                .then(({ data }) => {
                    console.log("Hello!", data);
                    this.setState(
                        {
                            friendStatus: data.status
                        },
                        () => this.setButtonText()
                    );
                });
        }
    }
    componentDidMount() {
        const id = this.props.otherUserId;
        console.log(id);
        axios.get(`/getfriendstatus/${id}`).then(({ data }) => {
            console.log("This is coming from the friend button: ", data);
            this.setState(
                {
                    friendStatus: data.status,
                    recipient: data.recipient_id,
                    sender: data.sender_id
                },
                () => this.setButtonText()
            );
        });
    }
    render() {
        return (
            <div>
                <button
                    className="friendButton"
                    onClick={this.state.buttonAction}
                >
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}

export default FriendButton;
