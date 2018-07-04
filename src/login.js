import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Logo from "./logo";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: ""
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        axios.post("/login", this.state).then(response => {
            if (response.data.success) {
                location.replace("/");
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }

    render() {
        return (
            <div id="login">
                <Logo />
                <h2>Login</h2>
                {this.state.error && <div className="err">Oops! You suck</div>}
                <form onSubmit={this.onSubmit}>
                    <input
                        onChange={this.onChange}
                        name="email"
                        placeholder="email"
                        type="text"
                    />
                    <input
                        onChange={this.onChange}
                        name="password"
                        placeholder="password"
                        type="password"
                    />
                    <button>Login</button>
                </form>
                <h4>
                    <Link to="/">Back to registration</Link>
                </h4>
            </div>
        );
    }
}

export default Login;
