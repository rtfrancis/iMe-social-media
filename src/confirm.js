import React from "react";

export default function Confirmation(props) {
    return (
        <div id="deleteOverlay">
            <div id="deleteConfirm">
                <h3>Are you sure?</h3>
                <button onClick={props.deleteProfile}>Delete</button>
                <button onClick={props.closeMe}>Cancel</button>
            </div>
        </div>
    );
}
