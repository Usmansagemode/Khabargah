import React, { Component } from 'react'
import PropTypes from'prop-types';
import axios from 'axios';
import Khabar from '../components/khabar/Khabar';
import StaticProfile from '../components/profile/StaticProfile'
import Grid from '@material-ui/core/Grid'

import KhabarSkeleton from '../util/KhabarSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import { withStyles } from '@material-ui/core';

class user extends Component {
    state = {
        profile: null,
        khabarIdParam: null

    };
    componentDidMount(){
        const handle = this.props.match.params.handle;
        const khabarId = this.props.match.params.khabarId;

        if(khabarId) this.setState({ khabarIdParam: khabarId }); //if we have khabarId then put it in khabarIdParam

        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                //need profile
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        const { khabars, loading } = this.props.data;
        const { khabarIdParam } = this.state;


        const khabarMarkup = loading ? (
            <KhabarSkeleton/>
        ) : khabars === null ? (
            <p>No khabar from this user</p>
        ) : !khabarIdParam ? (
            khabars.map(khabar => <Khabar key={khabar.khabarId} khabar={khabar}/>)
        ) : (
            khabars.map(khabar => {
                if(khabar.khabarId !== khabarIdParam)
                    return <Khabar key={khabar.khabarId} khabar={khabar}/>
                else return <Khabar key={khabar.khabarId} khabar={khabar} openDialog/>
            })
        )
        return (
            <Grid container spacing={2}>
               <Grid item sm={8} xs={12}>
                   {khabarMarkup}
               </Grid>
               <Grid item sm={4} xs={12}>
                   {this.state.profile === null ? (
                       <ProfileSkeleton/>
                   ) : (<StaticProfile profile={this.state.profile}/>)}
               </Grid>
           </Grid>
            
        )
    }
}

user.propTyoes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired 
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(user);
