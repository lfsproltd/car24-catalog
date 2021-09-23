import React, { Component } from 'react';
import AccountComponent from './AccountComponent';
import { connect } from 'react-redux';

class AccountContainer extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <AccountComponent />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AccountContainer);