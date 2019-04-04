import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        // minWidth: 275,
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
    }

    render = () => {
        const props = this.props;
        const { classes } = props;
        const containerNumber = props.containerNumber;
        const originalFileName = props.originalFileName;
        const spreadSheetId = ""+ props.spreadSheetId;
        const spreadSheetURL = props.spreadSheetURL;
        const reportSheetId = props.reportSheetId;
        const reportSheetURL = props.reportSheetURL;
        const numberOfJobs = props.numberOfJobs;
        const numberOfConfirmedDockets = props.numberOfConfirmedDockets;
        const numberOfOriginalDockets = props.numberOfOriginalDockets;
        const totalNumberOfBoxes = props.totalNumberOfBoxes;
        const totalNumberOfFrames = props.totalNumberOfFrames;
        const totalNumberOfPanels = props.totalNumberOfPanels;
        const totalNumberOfBlinds = props.totalNumberOfBlinds;
        console.log(props);
        return (
            <Card className={classes.card} >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {containerNumber} 
                    </Typography>
                    <Typography className={classes.pos} >
                        {originalFileName}
                    </Typography>
                    {
                        (spreadSheetURL) &&(
                            <Typography component="p">
                                <a target="_blank" href={spreadSheetURL} >Open spread sheet</a>
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
                    <Button size="small">Get from spread sheet</Button>
                    <Button size="small">Generate report</Button>
                </CardActions>
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