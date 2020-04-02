import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';

// MUI STUFF
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

// Redux
import { connect } from 'react-redux';
import { postKhabar, clearErrors } from '../../redux/actions/dataActions';

const styles = {
    palette: {
        primary: {
          light: '#fce4ec',
          main: '#ec407a',
          dark: '#880e4f',
          contrastText: '#fff'
        },
        secondary: {
          light: '#ff6333',
          main: '#ff3d00',
          dark: '#b22a00',
          contrastText: '#fff'
        }
      },
      typography: {
        userNextVaruants: true
      },
      form: {
        textAlign: 'center'
      },
      image: {
          margin: '20px auto 20px auto'
      },
      pageTitle: {
          margin: '10px auto 10px auto'
      },
      textField: {
          margin: '10px auto 10px auto'
      },
      button: {
          marginTop: 20,
          position: 'relative'
      },
      customError: {
          color: 'red',
          fontSize: '0.8rem',
          marginTop: 10
      },
      progress: {
          position: 'absolute'
      },
      submitButton: {
          position: 'relative',
          float: "right",
          marginTop: 10
      },
      progressSpinner: {
          position: 'absolute'
      },
      closeButton: {
          position: 'absolute',
          left: '91%',
          top: '6%'
      }
}

class PostKhabar extends Component{
    state = {
        open: false,
        body: '',
        errors: {}
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        };
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '', open: false, errors: {} });
         
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} });
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });

    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postKhabar({ body: this.state.body });
    };
    render() {
        const { errors } = this.state;
        const { classes, UI:  { loading }} = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post a Khabar">
                    <AddIcon/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>Post a new scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                                name="body" 
                                type="text" 
                                label="KHABAR" 
                                multiline rows="3" 
                                placeholder="POST KHABAR" 
                                error={errors.body ? true : false} 
                                helperText={errors.body} 
                                className={classes.textField} 
                                onChange={this.handleChange} 
                                fullWidth
                                />
                                <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                    Submit
                                    {loading && (
                                        <CircularProgress size={30} className={classes.progressSpinner}/>
                                    )}
                                </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostKhabar.propType = {
    postKhabar: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postKhabar, clearErrors })(withStyles(styles)(PostKhabar))