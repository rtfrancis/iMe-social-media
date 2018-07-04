import React from "react";
import { connect } from "react-redux";
import { getUsersForSearch, getUsers } from "./actions.js";
import { Link } from "react-router-dom";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.hideResults = this.hideResults.bind(this);
    }
    hideResults() {
        let searches = document.querySelector(".searchResults");
        searches.style.display = "none";
    }
    render() {
        return (
            <div>
                <input
                    id="searchBar"
                    type="text"
                    name="search"
                    placeholder="Search for user"
                    ref={elem => {
                        this.text = elem;
                    }}
                    onChange={e =>
                        this.props.dispatch(getUsersForSearch(e.target.value))
                    }
                />
                <div className="searchResults">
                    {this.props.searchResults &&
                        this.props.searchResults.map(result => {
                            return (
                                <div className="userResult" key={result.id}>
                                    <Link
                                        onClick={() => {
                                            this.text.value = "";
                                            this.hideResults();
                                        }}
                                        to={`/user/${result.id}`}
                                    >
                                        <img
                                            className="searchPhoto"
                                            src={
                                                result.photo ||
                                                "/assets/user.png"
                                            }
                                        />
                                        {result.first} {result.last}
                                    </Link>
                                </div>
                            );
                        })}
                    {this.props.noResults}
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        searchResults: state.searchResults || [],
        noResults: state.noResults
    };
};

export default connect(getStateFromRedux)(Search);
