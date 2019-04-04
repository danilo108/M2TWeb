import React from 'react'
import Typography from '@material-ui/core/Typography' 
import CircularProgress from '@material-ui/core/CircularProgress'
export const LoadingComponent = (props) =>{
    return <div className="centeredDiv"><CircularProgress color="secondary"/><Typography noWrap>{props.loadingState}</Typography></div>
}

export default LoadingComponent