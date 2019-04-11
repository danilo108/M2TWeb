import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';

const styles = theme =>( {
    card: {
         minWidth: 414,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',    
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
      },
    dang: {
        noWrap: false,
    }

});

class ContainerCard extends Component {
    constructor(props) {
        super(props)
        const container = {
            containerNumber : this.props.containerNumber,
            originalFileName : this.props.originalFileName,
            spreadSheetId : ""+ props.spreadSheetId,
            spreadSheetURL : this.props.spreadSheetURL,
            reportSheetId : this.props.reportSheetId,
            reportSheetURL : this.props.reportSheetURL,
            numberOfJobs : this.props.numberOfJobs,
            numberOfConfirmedDockets : this.props.numberOfConfirmedDockets,
            numberOfOriginalDockets : this.props.numberOfOriginalDockets,
            totalNumberOfBoxes : this.props.totalNumberOfBoxes,
            totalNumberOfFrames : this.props.totalNumberOfFrames,
            totalNumberOfPanels : this.props.totalNumberOfPanels,
            totalNumberOfBlinds : this.props.totalNumberOfBlinds,
        }   
        this.state = {
            isLoading: false,
            statusMessage: "",
            container: container,
            openDanger: false,

        }
    }

    generateReport = () =>{
        this.setState({isLoading:true, statusMessage:"Generating the report spreadsheet..."})
    
        fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber +"/report")
        .then(json => {
           
            return json.json()
        }).then(resp => {
            this.setState({isLoading: true, statusMessage: "Report generated. Refreshing data..."})
            fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber ).then(json => {
                return json.json()
            }).then(resp =>{
                console.log(resp)
                if( !resp.error){
                    this.setState({isLoading: false, statusMessage : "", container : resp.entity})
                    window.open("http://localhost:8080/webapi/containers/" + this.props.containerNumber +"/report/download",'_blank')
                }else{
                    this.setState({isLoading:false, statusMessage: "error"})
                }
                
            })

        }) 
    }

    updateFromSpreadSheet = () =>{
        this.setState({isLoading:true, statusMessage:"Getting updates from the spreadsheet..."})
        fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber +"/update")
        .then(json => {
           
            return json.json()
        }).then(resp => {
            this.setState({isLoading: true, statusMessage: "Updates retrieved. Refreshing data..."})
            fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber ).then(json => {
                return json.json()
            }).then(resp =>{
                console.log(resp)
                if( !resp.error){
                    this.setState({isLoading: false, statusMessage : "", container : resp.entity})
                }else{
                    this.setState({isLoading:false, statusMessage: "error"})
                }
            })

        })
    }
    

    resetContainer = () =>{
        this.setState({isLoading:true, statusMessage:"Ok you lost all the data for the container " + this.props.containerNumber + " ...don't worry, you can get check the spread sheet in the new tab"})
        window.open(this.state.container.spreadSheetURL,'_blank')
        fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber +"/reset")
        .then(json => {
        
            return json.json()
        }).then(resp => {
            let message = "Reset done. Let me get the new data and you can re-work on the container again."
            if(resp.error){
                message = "Oopps!! There was an error: " + resp.errorDescription + " ... Refreshing data"
            }
            this.setState({isLoading: true, statusMessage: message})
            fetch("http://localhost:8080/webapi/containers/" + this.props.containerNumber ).then(json => {
                return json.json()
            }).then(resp =>{
                console.log(resp)
                if( !resp.error){
                    this.setState({isLoading: false, statusMessage : "", container : resp.entity})
                }else{
                    this.setState({isLoading:false, statusMessage: "error"})
                }
            })

        })
    }
    openDanger = () =>{
        const b = !this.state.openDanger
        this.setState({openDanger:b})
    }
    render = () => {
  
        const { classes } = this.props;
        const containerNumber = this.state.container.containerNumber;
        const originalFileName = this.state.container.originalFileName;
        const spreadSheetId = ""+ this.state.container.spreadSheetId;
        const spreadSheetURL = this.state.container.spreadSheetURL;
        const reportSheetId = this.state.container.reportSheetId;
        const reportSheetURL = this.state.container.reportSheetURL;
        const numberOfJobs = this.state.container.numberOfJobs;
        const numberOfConfirmedDockets = this.state.container.numberOfConfirmedDockets;
        const numberOfOriginalDockets = this.state.container.numberOfOriginalDockets;
        const totalNumberOfBoxes = this.state.container.totalNumberOfBoxes;
        const totalNumberOfFrames = this.state.container.totalNumberOfFrames;
        const totalNumberOfPanels = this.state.container.totalNumberOfPanels;
        const totalNumberOfBlinds = this.state.container.totalNumberOfBlinds;
        const isLoading = this.state.isLoading
        const openDanger = this.state.openDanger
        console.log(this);
        console.log(containerNumber + " spreadsheet id  ",      spreadSheetId, spreadSheetURL)
        console.log(containerNumber + "report id  ",      reportSheetId, reportSheetURL)

        
        if(isLoading){
            return (
                <Card className={classes.card} >
                
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {containerNumber} 
                        </Typography>
                        <div>
                             <div className="progressDivContainer"><div className="progressDivContent"><CircularProgress color="secondary"/><Typography noWrap>{this.state.statusMessage}</Typography></div></div>
                        </div>
                    </CardContent>
                </Card>
            ) 
        }

        return (
            <Card className={classes.card} >
                <CardHeader title={containerNumber}  subheader={originalFileName} action={(<Button onClick={this.openDanger}>!!! <ExpandMoreIcon   /></Button>)} />
                <CardContent>
                    
                    {
                        (spreadSheetURL) &&(
                            <Typography component="p">
                                <a target="_blank" href={spreadSheetURL} >Open the jobs spread sheet</a>
                            </Typography>
                        )
                    }
                    {
                        (reportSheetURL) &&(
                            <Typography component="p">
                                <a target="_blank" href={reportSheetURL} >Open the report spread sheet</a>
                            </Typography>

                        )
                    }
                    <Typography component="p">
                        Confirmed jobs {numberOfConfirmedDockets} out of {numberOfOriginalDockets} 
                    </Typography>
                    <Grid container spacing={24}>
                        <Grid item>
                            <Typography component="p">
                                Boxes: {totalNumberOfBoxes}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="p">
                                Panels: {totalNumberOfPanels}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="p">
                                Frames: {totalNumberOfFrames}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="p">
                                Blinds: {totalNumberOfBlinds}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                <Button
                    
                    size="small"
                    color="primary"
                    
                    className={classes.margin} 
                    onClick={this.updateFromSpreadSheet}
                    >Get updates
                </Button>
                   { ( numberOfConfirmedDockets === numberOfOriginalDockets) && (<Button
                    
                    size="small"
                    color="secondary"
                    
                    className={classes.margin} 
                     onClick={this.generateReport}>Generate report</Button>)}
                
                </CardActions>
                <CardContent>
                    <Collapse in={openDanger} timeout="auto" unmountOnExit>
                            
                                <Typography variant="h6">Administrative operation (Dangerous!!)</Typography>
                                <Typography variant="body1" className="dang">
                                <div>
                                    If you click this button,<br/>
                                    it will reacreate a new spread sheet <br/>
                                    and loose all the changes on the jobs.<br/>
                                    The old spreadsheet <br/>
                                    will be opened in a new tab<br/>
                                    so you can copy previous values. <br/>
                                    If you don't understand what all of this means...<br/>
                                    DO NOT PRESS THE BUTTON!!!
                                </div>
                                </Typography>
                                <Fab
          variant="extended"
          size="medium"
          color="primary"
         
          className={classes.margin} onClick={this.resetContainer}
        > Proceed with the danger!!</Fab>
                            
                    </Collapse>
                </CardContent>
                {
                    (!spreadSheetURL)  && (
                   
                        <Button size="small">Create Spread sheet</Button>
                    )
                }
            </Card>
        );
    }
}

ContainerCard.propTypes = {
    classes: PropTypes.object.isRequired,
    containerNumber: PropTypes.string.isRequired,
    originalFileName: PropTypes.string,
    spreadSheetId: PropTypes.string,
    spreadSheetURL: PropTypes.string,
    reportSheetId: PropTypes.string,
    reportSheetURL: PropTypes.string,
    numberOfJobs: PropTypes.number,
    numberOfConfirmedDockets: PropTypes.number,
    numberOfOriginalDockets: PropTypes.number,
    totalNumberOfBoxes: PropTypes.number,
    totalNumberOfFrames: PropTypes.number,
    totalNumberOfPanels: PropTypes.number,
    totalNumberOfBlinds: PropTypes.number,
};
ContainerCard.defaultProps = {
    originalFileName: "original filename unknown",
    spreadSheetId: "",
    spreadSheetURL: "",
    reportSheetId: "not avaliable yet",
    reportSheetURL: "not avaliable yet",
    totalNumberOfBoxes: 0,
    totalNumberOfFrames: 0,
    totalNumberOfPanels: 0,
    totalNumberOfBlinds: 0,
};
export default withStyles(styles)(ContainerCard);