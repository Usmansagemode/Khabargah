import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link }  from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteKhabar from './DeleteKhabar';
import KhabarDialog from './KhabarDialog';
import LikeButton from './LikeButton';

// Mui stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// icons
import ChatIcon from '@material-ui/icons/Chat';


// redux
import { connect } from 'react-redux';

// import MyButton from '../util/MyButton';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }

};

class Khabar extends Component {
    
    render() {
        dayjs.extend(relativeTime)
        const { classes, 
                khabar : { body, createdAt, userImage, userHandle, khabarId, likeCount, commentCount },
                user: { authenticated, credentials: { handle } } 
              } = this.props;
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteKhabar khabarId={khabarId}/>
        ) : null;
        return (
            <Card className={classes.card}>
                <CardMedia 
                image={userImage}
                title="Profile Image"
                className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary"> {userHandle} </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary"> {dayjs(createdAt).fromNow()} </Typography>
                    <Typography variant="body1"> {body} </Typography>
                    <LikeButton khabarId={khabarId}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    <KhabarDialog khabarId={khabarId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        )
    }
}

Khabar.propTypes = {
    user: PropTypes.object.isRequired,
    khabar: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool

}

const mapStateToProps = state => ({
    user: state.user
})


export default connect(mapStateToProps)(withStyles(styles)(Khabar)) //this will give you an access to a variable = classes.
