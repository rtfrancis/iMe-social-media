import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton";
import Images from "./images";

class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getUser = this.getUser.bind(this);
    }
    componentDidMount() {
        this.getUser(this.props.match.params.id);
        const id = this.props.match.params.id;
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.match &&
            nextProps.match.params &&
            nextProps.match.params.id != this.props.match.params.id
        ) {
            this.getUser(nextProps.match.params.id);
        }
    }
    getUser(id) {
        axios.get(`/users/${id}.json`).then(({ data }) => {
            if (data.redirectHome) {
                return this.props.history.push("/profile");
            }
            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                photo: data.photo,
                bio: data.bio
            });
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div className="profileDiv">
                <ProfilePic url={this.state.photo} />
                <FriendButton otherUserId={this.props.match.params.id} />
                <div className="profileInfo">
                    <p>
                        {this.state.first} {this.state.last}
                    </p>
                    <p>{this.state.bio}</p>
                </div>
                <Images id={this.state.id} />
            </div>
        );
    }
}

export default OtherPersonProfile;
