import React from 'react'
import Grid from '@material-ui/core/Grid'
import ContainerCard from './ContainerCard'
import { Typography, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MobileStepper from '@material-ui/core/MobileStepper'


export default class ContainerGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            containers: [],
            isLoading: true,
            loadingState: "Initialised",
            pageTotal: 0,
            pageSize: 10,
            currentPageNumber: 0,
        }
    }

    goPageBack = () =>{
        let back = {currentPageNumber: this.state.currentPageNumber-1}
        this.setState(back)
        this.fetchContainers(back.currentPageNumber, this.state.pageSize)
    }
    goPageNext = () =>{
        let next = {currentPageNumber: this.state.currentPageNumber+1}
        this.setState(next)
        this.fetchContainers(next.currentPageNumber, this.state.pageSize)
    }
    
    fetchContainers = (pageNumber, pageSize) =>{
        this.setState({ loadingState: "Retrieving information about your containers... ", isLoading:true, })
        const url = new URL("http://localhost:8080/webapi/containers ")
        url.search = new URLSearchParams({pageNumber: pageNumber, pageSize: pageSize})
        console.log("fetching ", url)
        fetch(url).then(json => {
            return json.json()
        }).then(resp => {
            console.log(resp)
                this.setState({ containers: resp['entities'], isLoading: false, pageTotal:resp['totalPages'] })
            }).catch(e=>{
                console.log(e)
                this.setState({loadingState:"Ooops! " + JSON.stringify(e)})
            })
    }
    componentWillMount = () =>{
        this.fetchContainers(this.state.currentPageNumber, this.state.pageSize)
    }
    // componentDidMount = () => {
    //     this.fetchContainers()
    // }
    render = () => {
        // console.log(this.state.containers)
        const containers = this.state.containers;
        let result = <div className="centeredDiv"><CircularProgress color="secondary"/><Typography noWrap>{this.state.loadingState}</Typography></div>
        if (!this.state.isLoading) {
            result = (
                <div>

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
                <MobileStepper position="static" steps={this.state.pageTotal} activeStep={this.state.currentPageNumber} 
                    backButton={
                        <Button size="small" onClick={this.goPageBack} disabled={this.state.currentPageNumber < 1} >Back</Button>
                    }
                    nextButton={
                        <Button size="small" onClick={this.goPageNext} disabled={this.state.currentPageNumber >= this.state.pageTotal -1}>Next</Button>
                    }
                />
                    </div>
            )
        }
        /*
        /*  */

        return result;

    }
}