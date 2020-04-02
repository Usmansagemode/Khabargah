import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Khabar from '../components/khabar/Khabar';
import Profile from '../components/profile/Profile';
import KhabarSkeleton from '../util/KhabarSkeleton';

import { connect } from 'react-redux';
import { getKhabars } from '../redux/actions/dataActions';

class home extends Component {
    
    componentDidMount() {
        this.props.getKhabars();
    }
    render() {
        const { khabars, loading } = this.props.data;

        let recentKhabarMarkup = !loading ? ( //check if we have khabar, if null then we're still loading from server (no response)
            khabars.map(khabar => <Khabar key={khabar.khabarId} khabar={khabar}/>)
        ) : (
            <KhabarSkeleton/>
        );
        return (
           <Grid container spacing={2}>
               <Grid item sm={8} xs={12}>
                   {recentKhabarMarkup}
               </Grid>
               <Grid item sm={4} xs={12}>
                   <Profile/>
               </Grid>
           </Grid>
        )
    }
}

home.propTypes = {
    getKhabars: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, { getKhabars })(home);
