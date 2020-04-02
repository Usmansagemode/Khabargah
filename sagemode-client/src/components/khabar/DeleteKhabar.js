import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';

// MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteKhabar } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
};

class DeleteKhabar extends Component {
    state = {
        open: false
    };
    handleOpen = () => {
        this.setState({ open: true});
    };
    handleClose = () => {
        this.setState({ open: false});
    };
    deleteKhabar = () => {
        this.props.deleteKhabar(this.props.khabarId);
        this.setState({ open: false });
    };
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton 
                tip="Delete Khabar" 
                onClick={this.handleOpen} 
                btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color="secondary"/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                    >
                        <DialogTitle>
                            Are you sure you want to delete this khabar?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.deleteKhabar} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
            </Fragment>
        )
    }
}


DeleteKhabar.propTypes = {
    deleteKhabar: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    khabarId: PropTypes.string.isRequired
}

export default connect(null, { deleteKhabar })(withStyles(styles)(DeleteKhabar))