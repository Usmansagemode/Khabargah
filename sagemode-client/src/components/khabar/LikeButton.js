import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import{ Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from 'react-redux'
import { likeKhabar, unlikeKhabar } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
    likedKhabar = () => {
        if (
        this.props.user.likes && 
        this.props.user.likes.find(
            like => like.khabarId === this.props.khabarId
            )
        )
         return true;
        else return false;
    };

    likeKhabar = () => {
        this.props.likeKhabar(this.props.khabarId);
    };
    unlikeKhabar = () => {
        this.props.unlikeKhabar(this.props.khabarId);
    };

    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                        <FavoriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : (
            this.likedKhabar() ? (
                <MyButton tip="unlike" onClick={this.unlikeKhabar}>
                        <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="like" onClick={this.likeKhabar}>
                        <FavoriteBorder color="primary"/>
                </MyButton>
            )
        );
        return likeButton
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    khabarId: PropTypes.string.isRequired,
    likeKhabar: PropTypes.func.isRequired,
    unlikeKhabar: PropTypes.func.isRequired
}

const mapActionsToProps = {
    likeKhabar,
    unlikeKhabar
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps,mapActionsToProps)(LikeButton);
