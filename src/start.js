import React from "react";
import ReactDOM from "react-dom";
// import axios from "./axios";
import Welcome from "./welcome";
// import Logo from "./logo";
import App from "./app";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { getSocket } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;
if (location.pathname == "/welcome") {
    component = <Welcome />;
    console.log("logged OUT");
} else {
    getSocket(store);
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );

    console.log("LOGGED IN");
}

ReactDOM.render(component, document.querySelector("main"));
