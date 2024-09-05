import React,{useEffect,useState} from 'react'
import {Button,TextField,CircularProgress,Table,TableBody,TableCell,TableHead,TableRow,FormControl,Select,MenuItem } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import ChevronBlue from 'assets/icon/chevron-right-blue.svg'
import filter from 'assets/icon/filter.svg'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle} from 'redux/actions/general'
import {getSummary} from 'redux/actions/pipeline'
import NumberFormat from 'react-number-format';

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ff7165',
            contrastText: '#FFFFFF',
            // contrastText: '#777777',
        }
    } 
})
const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',

        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',

        }
    } 
})
const MuiTableCell = withStyles({
    root: {
      borderBottom: "none"
    }
  })(TableCell);
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
      marginBottom:15
  }
  
}));
export default function Summary(props) {
    const dispatch=useDispatch()
    const pipeline=useSelector(state=>state.pipeline)
    const master=useSelector(state=>state.master)
    const [prob,setProb]=useState({
        prob1:0,
        prob2:0.2,
        prob3:0.4
    })
    let {tribe,segment,rm,probability,periode,textPeriode}=pipeline.filter
    useEffect(()=>{
        dispatch(getSummary(props.token,`${periode.fromMonth}/${periode.toMonth}/10,20/30,40,50/70,80/${tribe}/${segment}/${rm.value}`))
    },[])
    const addFilter=()=>{
        
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Pipeline Filter",
            modal_component: "pipeline_filter",
            modal_data:null ,
            modal_size:300,
            modal_action:'add_projection_filter',
        }))
    }
    let tribe_filter=master.tribes.filter((data)=>{return data.id===tribe})
    let segment_filter=master.segments.filter((data)=>{return data.id===segment})
    return (
        <div style={{padding:'10px 0px 10px 10px'}}>
            <div className='head-section'>
                <div style={{display:'flex',alignItems:'center'}}>
                <Button style={{fontWeight:600,color:'#3B99EB'}} onClick={()=>props.tabToggle('pipeline','projection')} size='small'  variant='text' className='btn-remove-capital ' >Pipeline</Button>
                &nbsp;
                <img src={ChevronBlue} style={{width:5}}/>
                &nbsp;&nbsp;
                <p className='bold'>Projection summary</p>
                </div>
            </div>
            <br/>
            <div className='summary-wrapper'>
                <div className='summary-header'>
                    <h2>Projection summary</h2>
                    <div style={{display:'flex',alignItems:'center',}}>
                    <div>
                    <p className='pipeline-filterby'><b>Filter by:</b></p>
                    <div style={{display:'flex',flexWrap:'wrap',width:'100%'}}>
                        <p className='pipeline-filterby'>Tribe : {tribe===0?'All Tribe':tribe_filter[0].text}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p className='pipeline-filterby'>Deal period : {textPeriode}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p className='pipeline-filterby'>Segment : {segment===0?'All Segment':segment_filter[0].text} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p className='pipeline-filterby'>RM : {rm!==null?rm.label:'All RM'} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                        {/* <p className='pipeline-filterby'>{probability.length>0&&"Probability: "+probability.map((data)=>`${data.text}`)} &nbsp;&nbsp;&nbsp;&nbsp;</p> */}
                        
                    </div>
                    </div>
                    <button onClick={addFilter} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
                </div>
                </div>
                <div className='summary-table'>
                    <div className='summary-table-head' style={{width:420}}>
                        <p className='semi-bold'>Total value</p>
                    </div>
                    <div className='summary-table-head' style={{width:250}}>
                        <p className='semi-bold'>Probability</p>
                    </div>
                    <div className='summary-table-head' style={{marginLeft:50}}>
                        <p className='semi-bold'>Total after Probability</p>
                    </div>
                </div>
                <div className='summary-table'>
                    <div className='summary-table-cell' style={{width:420,borderBottom:'1px solid #ccc'}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={pipeline.summary[0].amount} displayType={'text'} thousandSeparator={true}  /><br/><span className='summary-table-probability'>Probability: 0.1, 0.2</span></p>
                    </div>
                    <div className='summary-table-cell' style={{width:250,borderBottom:'1px solid #ccc'}}>
                        <FormControl variant="outlined" size="small" className='add-deals__field'>
                            <Select
                                color='primary'
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={prob.prob1}
                                onChange={(e)=>setProb({...prob,prob1:e.target.value})}
                                className='field-radius'
                                style={{width:100}}
                                // labelWidth={80}
                            >
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={0.1}>0.1</MenuItem>
                                    <MenuItem value={0.2}>0.2</MenuItem>
                                    <MenuItem value={0.3}>0.3</MenuItem>
                                    <MenuItem value={0.4}>0.4</MenuItem>
                                    <MenuItem value={0.5}>0.5</MenuItem>
                                    <MenuItem value={0.6}>0.6</MenuItem>
                                    <MenuItem value={0.7}>0.7</MenuItem>
                                    <MenuItem value={0.8}>0.8</MenuItem>
                                {/* <MenuItem value={90}>0.9 - Agreement</MenuItem> */}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='summary-table-cell' style={{marginLeft:50}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={Math.round(pipeline.summary[0].amount*prob.prob1)} displayType={'text'} thousandSeparator={true}  /></p>
                    </div>
                </div>
                <div className='summary-table'>
                    <div className='summary-table-cell' style={{width:420,borderBottom:'1px solid #ccc'}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={pipeline.summary[1].amount} displayType={'text'} thousandSeparator={true}  /><br/><span className='summary-table-probability'>Probability: 0.3, 0.4, 0.5</span></p>
                    </div>
                    <div className='summary-table-cell' style={{width:250,borderBottom:'1px solid #ccc'}}>
                    <FormControl variant="outlined" size="small" className='add-deals__field'>
                            <Select
                                color='primary'
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={prob.prob2}
                                onChange={(e)=>setProb({...prob,prob2:e.target.value})}

                                // onChange={(e)=>handleChangeStage(e.target.value)}
                                className='field-radius'
                                style={{width:100}}
                                // labelWidth={80}
                            >
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={0.1}>0.1</MenuItem>
                                    <MenuItem value={0.2}>0.2</MenuItem>
                                    <MenuItem value={0.3}>0.3</MenuItem>
                                    <MenuItem value={0.4}>0.4</MenuItem>
                                    <MenuItem value={0.5}>0.5</MenuItem>
                                    <MenuItem value={0.6}>0.6</MenuItem>
                                    <MenuItem value={0.7}>0.7</MenuItem>
                                    <MenuItem value={0.8}>0.8</MenuItem>
                                {/* <MenuItem value={90}>0.9 - Agreement</MenuItem> */}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='summary-table-cell' style={{marginLeft:50}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={Math.round(pipeline.summary[1].amount*prob.prob2)} displayType={'text'} thousandSeparator={true}  /></p>
                    </div>
                </div>
                <div className='summary-table'>
                    <div className='summary-table-cell' style={{width:420}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={pipeline.summary[2].amount} displayType={'text'} thousandSeparator={true}  /><br/><span className='summary-table-probability'>Probability: 0.6, 0.7, 0.8</span></p>
                    </div>
                    <div className='summary-table-cell' style={{width:250}}>
                    <FormControl variant="outlined" size="small" className='add-deals__field'>
                            <Select
                                color='primary'
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={prob.prob3}
                                onChange={(e)=>setProb({...prob,prob3:e.target.value})}

                                // onChange={(e)=>handleChangeStage(e.target.value)}
                                className='field-radius'
                                style={{width:100}}
                                // labelWidth={80}
                            >
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={0.1}>0.1</MenuItem>
                                    <MenuItem value={0.2}>0.2</MenuItem>
                                    <MenuItem value={0.3}>0.3</MenuItem>
                                    <MenuItem value={0.4}>0.4</MenuItem>
                                    <MenuItem value={0.5}>0.5</MenuItem>
                                    <MenuItem value={0.6}>0.6</MenuItem>
                                    <MenuItem value={0.7}>0.7</MenuItem>
                                    <MenuItem value={0.8}>0.8</MenuItem>
                                {/* <MenuItem value={90}>0.9 - Agreement</MenuItem> */}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='summary-table-cell' style={{marginLeft:50}}>
                        <p className='summary-table-price'>IDR <NumberFormat value={Math.round(pipeline.summary[2].amount*prob.prob3)} displayType={'text'} thousandSeparator={true}  /></p>
                    </div>
                </div>
                <div className='summary-table'>
                    <div className='summary-table-cell' style={{width:420}}>
                    </div>
                    <div className='summary-table-cell' style={{width:250}}>
                    </div>
                    <div className='summary-table-cell' style={{display:'flex',alignItems:'center'}}>
                        <p className='summary-total'>Total </p>&nbsp;&nbsp;
                        <div style={{width:160,backgroundColor:'#70bf4e',padding:'5px 5px 5px 10px',color:'white',fontWeight:600}}>
                            IDR <NumberFormat value={Math.round(pipeline.summary[0].amount*prob.prob1+pipeline.summary[1].amount*prob.prob2+pipeline.summary[2].amount*prob.prob3)} displayType={'text'} thousandSeparator={true}  />
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        </div>
    )
}
