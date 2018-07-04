import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Link, Route } from "react-router-dom";
import Profile from "./profile";
import Bio from "./bio";
import OtherPersonProfile from "./opp";
import UserDisplay from "./users";
import Welcome from "./welcome";
import Landing from "./home";
import EditProfile from "./edit";
import Friends from "./friends";
import Search from "./search";
import OnlineUsers from "./onlineusers";
import Chat from "./chat";
import ImagesUploader from "./imagesuploader";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.setBio = this.setBio.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log(data);
            this.setState(
                {
                    first: data.first,
                    last: data.last,
                    url: data.photo,
                    id: data.id,
                    bio: data.bio
                },
                () => console.log("new state", this.state)
            );
        });
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    closeUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    setBio(bioText) {
        this.setState({
            bio: bioText
        });
    }
    updateUserInfo(firstname, lastname) {
        this.setState({
            first: firstname,
            last: lastname
        });
    }
    setImage(imgUrl) {
        this.setState({
            url: imgUrl,
            uploaderIsVisible: false
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <div id="app">
                    <Link to="/">
                        <Logo />
                    </Link>
                    <Search />
                    <ProfilePic
                        url={this.state.url}
                        actionToDo={this.showUploader}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            onClick={this.closeUploader}
                            setImage={this.setImage}
                        />
                    )}

                    <div>
                        <br />
                        <a className="logoutButton" href="/logout">
                            Log out
                        </a>
                        <Route exact path="/" component={Landing} />
                        <Route
                            exact
                            path="/profile"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                    url={this.state.url}
                                    actionToDo={this.showUploader}
                                    setBio={this.setBio}
                                />
                            )}
                        />

                        <Route
                            path="/user/:id"
                            component={OtherPersonProfile}
                        />
                        <Route
                            path="/imagesuploader"
                            component={ImagesUploader}
                        />
                        <Route path="/chat" component={Chat} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/onlineusers" component={OnlineUsers} />
                        <Route path="/users" component={UserDisplay} />
                        <Route
                            path="/update"
                            render={() => (
                                <EditProfile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    updateUserInfo={this.updateUserInfo}
                                />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
