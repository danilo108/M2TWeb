import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
    card: {
        minWidth: 275,
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
};

class ContainerCard extends Component {
    constructor(props) {
        super(props)
        let container = {}
        container.containerNumber = props.containerNumber;
        container.totalNumberOfBlinds = props.totalNumberOfBlinds;
        container.originalFileName = props.originalFileName;
        container.spreadSheetId = "" + props.spreadSheetId;
        container.spreadSheetURL = props.spreadSheetURL;
        container.reportSheetId = props.reportSheetId;
        container.reportSheetURL = props.reportSheetURL;
        container.numberOfJobs = props.numberOfJobs;
        container.numberOfConfirmedDockets = props.numberOfConfirmedDockets;
        container.numberOfOriginalDockets = props.numberOfOriginalDockets;
        container.totalNumberOfBoxes = props.totalNumberOfBoxes;
        container.totalNumberOfFrames = props.totalNumberOfFrames;
        container.totalNumberOfPanels = props.totalNumberOfPanels;
        this.state = {isLoading: false, loadingState: "", container: container}
    }

    updateFromSpreadSheet = () => {
        this.setState({ loadingState: "Updating the database with the spreadsheet information... ", isLoading:true, })
        
        let resp = ""
        fetch("http://localhost:8080/webapi/cotainers/" + this.props.containerNumber + "/update").then(json => json.json()).then(payload => {
            console.log(payload)
            resp = payload
        }
        )
        let container  = this.state.container
        container.reportSheetId = resp['reportSheetId']
        container.reportSheetURL = resp['reportSheetFullURL']
        this.setState({container:container})
        // this.fetchContainer()
    }

    generateReport = () => {
        this.setState({ loadingState: "Updating the database with the spreadsheet information... ", isLoading:true, })
        
        let resp = ""
        fetch("http://localhost:8080/webapi/cotainers/" + this.props.containerNumber + "/report").then(json => json.json()).then(payload => {
            console.log(payload)
            resp = payload
            let container  = this.state.container
            container.reportSheetId = resp['reportSheetId']
            container.reportSheetURL = resp['reportSheetFullURL']
            this.setState({container:container, isLoading: false})

            window.open("http://localhost:8080/webapi/cotainers/" + this.props.containerNumber + "/report/download", '_blank');
        }

        )
        
      
    }
    downloadReport = () => {
            window.open("http://localhost:8080/webapi/cotainers/" + this.props.containerNumber + "/report/download", '_blank');
    }

    fetchContainer = () =>{
        this.setState({ loadingState: "retrieving the updates... ", isLoading:true, })
        const url = new URL("http://localhost:8080/webapi/containers/" + this.props.containerNumber)
        console.log("fetching ", url)
        fetch(url).then(json => {
            return json.json()
        }).then(resp => {
            console.log(resp)
                this.setState({container: resp["entity"], isLoading: false})
            }).catch(e=>{
                console.log(e)
            })
    }
    render = () => {
        const isLoading = this.state.isLoading
        const loadingState = this.state.loadingState
        
        const container = this.state.container;
        const { classes } = this.props;
        console.log(" the classes of props is ", classes)
        const containerNumber = container.containerNumber;
        const originalFileName = container.originalFileName;
        const spreadSheetId = "" + container.spreadSheetId;
        const spreadSheetURL = container.spreadSheetURL;
        const reportSheetId = container.reportSheetId;
        const reportSheetURL = container.reportSheetURL;
        const numberOfJobs = container.numberOfJobs;
        const numberOfConfirmedDockets = container.numberOfConfirmedDockets;
        const numberOfOriginalDockets = container.numberOfOriginalDockets;
        const totalNumberOfBoxes = container.totalNumberOfBoxes;
        const totalNumberOfFrames = container.totalNumberOfFrames;
        const totalNumberOfPanels = container.totalNumberOfPanels;
        const totalNumberOfBlinds = container.totalNumberOfBlinds;
        console.log(container);
        return (
            <Card className={classes.card} >
                <CardContent>
                    {isLoading && <Typography variant="caption" >{loadingState} <CircularProgress color="secondary" /></Typography>}
                    <Typography variant="h5" component="h2">
                        {containerNumber}
                    </Typography>
                    <Typography className={classes.pos} >
                        {originalFileName}
                    </Typography>
                    {
                        (spreadSheetURL) && (
                            <Typography component="p">
                                <a target="_blank" href={spreadSheetURL} >Open spread sheet</a>
                            </Typography>
                        )
                    }
                    {
                        (reportSheetURL) && (
                            <Typography component="p">
                                <a target="_blank" href={reportSheetURL} >Open the report</a>
                            </Typography>
                        )
                    }
                    <Typography component="p">
                        Confirmed dockets {numberOfConfirmedDockets} out of {numberOfOriginalDockets} for a total of {numberOfJobs} jobs
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
                    <Button size="small" onClick={this.updateFromSpreadSheet}>Get updates</Button>
                { !reportSheetId && <Button size="small" onClick={this.generateReport}>Generate report</Button> }
                { reportSheetId && <Button size="small" onClick={this.downloadReport}>Download report</Button> }
                </CardActions>
                {
                    (!spreadSheetURL) && (

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