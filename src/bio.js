import React from "react";
import axios from "./axios";

class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadBio = this.uploadBio.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    uploadBio(e) {
        e.preventDefault();
        axios
            .post("/uploadbio", {
                bio: this.bio
            })
            .then(({ data }) => {
                this.props.setBio(data.bio);
                this.props.closeBio();
            });
    }
    render() {
        return (
            <div id="bioOverlay">
                <div id="bioBox">
                    <div onClick={this.props.closeBio}>X</div>
                    <form>
                        <textarea
                            name="bio"
                            rows="10"
                            cols="30"
                            onChange={this.handleInput}
                        />
                        <button onClick={this.uploadBio}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Bio;
