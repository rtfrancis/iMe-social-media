import React from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import Bio from "./bio";
import Images from "./images";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showBioInput = this.showBioInput.bind(this);
        this.closeBioInput = this.closeBioInput.bind(this);
    }
    showBioInput() {
        this.setState({
            bioFieldVisible: true
        });
    }

    closeBioInput() {
        this.setState({
            bioFieldVisible: false
        });
    }
    render() {
        return (
            <div className="profileDiv">
                <ProfilePic
                    actionToDo={this.props.actionToDo}
                    url={this.props.url}
                />
                <div className="profileInfo">
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>

                    {this.state.bioFieldVisible && (
                        <Bio
                            setBio={this.props.setBio}
                            closeBio={this.closeBioInput}
                        />
                    )}
                    <p>{this.props.bio}</p>
                    <p id="addBio" onClick={this.showBioInput}>
                        {this.props.bio ? "Edit Bio" : "Add Bio"}
                    </p>
                </div>
                <Images id={this.props.id} />
            </div>
        );
    }
}

export default Profile;
