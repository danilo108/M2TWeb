import React from 'react'
import Grid from '@material-ui/core/Grid'
import ContainerCard from './ContainerCard'
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
export default class ContainerGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            containers: [],
            isLoading: true,
            loadingState: "Initialised"
        }
    }
    componentDidMount = () => {
        this.setState({ loadingState: "sending request " })
        fetch("http://localhost:8080/webapi/containers ").then(json => {
            let payload = json.json()
            // console.log(payload)
            this.setState({ isLoading: true, loadingState: "Request received " + payload })
            return payload
        }).then(resp => {
            // console.log(resp)
                this.setState({ containers: resp['entities'], isLoading: false })
            })
    }
    render = () => {
        // console.log(this.state.containers)
        const containers = this.state.containers;
        let result = <div class="centeredDiv"><CircularProgress color="secondary"/><Typography noWrap>{this.state.loadingState}</Typography></div>
        if (!this.state.isLoading) {
            result = (
                <Grid container spacing={24}>
                    {containers.map(c => (
                        <Grid item key={c.containerId}>
                            <ContainerCard
                                containerNumber={c.containerNumber}
                                originalFileName={c.originalFileName}
                                spreadSheetId={c.spreadSheetId}
                                spreadSheetURL={c.spreadSheetURL}
                                reportSheetId={c.reportSheetId}
                                reportSheetURL={c.reportSheetURL}
                                numberOfJobs={c.numberOfJobs}
                                numberOfConfirmedDockets={c.numberOfConfirmedDockets}
                                numberOfOriginalDockets={c.numberOfOriginalDockets}
                                totalNumberOfBoxes={c.totalNumberOfBoxes}
                                totalNumberOfFrames={c.totalNumberOfFrames}
                                totalNumberOfPanels={c.totalNumberOfPanels}
                                totalNumberOfBlinds={c.totalNumberOfBlinds}

                            />
                        </Grid>)
                    )}
                </Grid>
            )
        }
        /*
        /*  */

        return result;

    }
}