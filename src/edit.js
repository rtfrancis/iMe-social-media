import React from "react";
import axios from "./axios";
import Confirmation from "./confirm";

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
    }
    handleInput(e) {
        this[e.target.name] = e.target.value;
    }
    showConfirm(e) {
        e.preventDefault();
        this.setState({
            confirmIsVisible: true
        });
    }
    closeConfirm() {
        this.setState({
            confirmIsVisible: false
        });
    }
    deleteUser() {
        axios
            .post("/deleteuserprofile")
            .then(data => {
                console.log(data);
                location.replace("/welcome");
            })
            .catch(err => {
                console.log(err);
            });
    }
    updateInfo(e) {
        axios
            .post("updateinfo", {
                id: this.props.id,
                first: this.first,
                last: this.last
            })
            .then(({ data }) => {
                console.log(data);
                this.props.updateUserInfo(data[0].first, data[0].last);
            });
    }
    render() {
        return (
            <div id="editPage">
                <h1>Edit Profile</h1>
                <form>
                    <input
                        type="text"
                        name="first"
                        placeholder={this.props.first}
                        onChange={this.handleInput}
                    />
                    <input
                        type="text"
                        name="last"
                        placeholder={this.props.last}
                        onChange={this.handleInput}
                    />
                    <button onClick={this.updateInfo}>Update</button>
                </form>
                {this.state.confirmIsVisible && (
                    <Confirmation
                        closeMe={this.closeConfirm}
                        deleteProfile={this.deleteUser}
                    />
                )}

                <button onClick={this.showConfirm}>Delete Profile</button>
            </div>
        );
    }
}

export default EditProfile;
