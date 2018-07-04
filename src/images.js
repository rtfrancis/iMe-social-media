import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUserImages } from "./actions";
import ImageDisplay from "./imageDisplay";

class Images extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(getUserImages(this.props.id));
    }
    render() {
        return (
            <div className="imageDisplay">
                {this.props.images &&
                    this.props.images.map(photo => {
                        return (
                            <div className="imageDiv" key={photo.id}>
                                <a href={photo.image}>
                                    <img
                                        className="userImage"
                                        src={photo.image}
                                    />
                                </a>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        images: state.images || null
    };
};

export default connect(getStateFromRedux)(Images);
