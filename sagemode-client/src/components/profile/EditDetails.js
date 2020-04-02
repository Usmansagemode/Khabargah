import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';

// Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

// MUI STUFF

import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = { 
    button: {
        float: 'right'
    },
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
        textAlign: 'center',
        position: 'relative',
        '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
        }
    },
    imageProfile: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%'
    },
    '& .profile-image': {
    width: 170,
    height: 170,
    objectFit: 'cover',
    maxWidth: '100%',
    borderRadius: '50%'
    },
    '& .profile-details': {
    textAlign: 'center',
    '& span, svg': {
        verticalAlign: 'middle'
    },
    '& a': {
        color: '#00bcd4'
    }
    },
    '& hr': {
    border: 'none',
    margin: '0 0 10px 0'
    },
    '& svg.button': {
    '&:hover': {
        cursor: 'pointer'
    }
    }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
        margin: '20px 10px'
        }
    }
}
class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    }
    componentDidMount(){
        const { credentials } = this.props
        this.mapUserDetailsToState(credentials);
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit Details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary"/>
                </MyButton>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth="sm">
                    <DialogTitle> Edit your details </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField 
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.TextField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField 
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your personal/professional website"
                                className={classes.TextField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField 
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.TextField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));
