import React from "react";
import axios from "./axios";

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
    }
    upload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios.post("/upload", formData).then(({ data }) => {
            this.props.setImage(data);
        });
    }
    render() {
        return (
            <div id="uploaderOverlay">
                <div id="imageUploader">
                    <div id="uploaderClose" onClick={this.props.onClick}>
                        X
                    </div>
                    <h2>Upload new image </h2>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        className="inputfile"
                        onChange={this.upload}
                    />
                    <label htmlFor="file">Choose a file</label>
                </div>
            </div>
        );
    }
}

export default Uploader;
