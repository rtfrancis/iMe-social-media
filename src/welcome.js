import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import axios from "./axios";

export default function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />

                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
