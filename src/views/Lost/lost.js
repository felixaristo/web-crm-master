import React,{useEffect,useState} from 'react'
import './style.css'
import Layout from 'components/Layouts'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import {getMasterData,tabToggle,getEmployee} from 'redux/actions/master'
import {modalToggle} from 'redux/actions/general'
import {getLostDeal,getDetailDeal} from 'redux/actions/pipeline'
import { useDispatch, useSelector } from "react-redux";
import {Button,FormControl,InputLabel,OutlinedInput,InputAdornment
,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import SearchImg from 'assets/icon/Search.png'
import filter from 'assets/icon/filter.svg'
import Skeleton from 'components/Skeleton'
import { TablePagination } from '@trendmicro/react-paginations';
import CevronRight from 'assets/icon/chevron-right.svg'
import CevronLeft from 'assets/icon/chevron-left.svg'
import * as actionType from 'redux/constants/pipeline'
import {debounce} from 'lodash'
import {setSearch} from 'redux/actions/client'
import NumberFormat from 'react-number-format';

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#cccccc',
            contrastText: '#777777',
        }
    } 
})

export default function Index(props) {
    const dispatch=useDispatch()
    const pipeline=useSelector(state=>state.pipeline)
    const master=useSelector(state=>state.master)
    const general=useSelector(state=>state.general)
    const client=useSelector(state=>state.client)
    const [pagination,setPagination]=useState({
        page:1,
        pageLength:10
    })
    let {tribe,segment,rm,probability,textPeriode,periode}=pipeline.filter
    let tribe_filter=master.tribes.filter((data)=>{return data.id===tribe})
    let segment_filter=master.segments.filter((data)=>{return data.id===segment})
    useEffect(()=>{
        if(master.rm.length<1){
            dispatch(getMasterData(props.token))
        }
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        if(pipeline.lost_deal.legth>0){
            dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${pipeline.lost_deal_pagination.page}/${pipeline.lost_deal_pagination.perPage}/${client.search.length>0?client.search:'*'}`))

        }else{
            dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1/10/${client.search.length>0?client.search:'*'}`))
            
        }
    },[])

    const getProbability=(key)=>{
        switch (key) {
            case 10:
                return 0.1
                break;
            case 20:
                return 0.2
                break;
            case 30:
                return 0.3
                break;
            case 40:
                return 0.4
                break;
            case 50:
                return 0.5
                break;
            case 60:
                return 0.6
                break;
            case 70:
                return 0.7
                break;
            case 80:
                return 0.8
                break;
            case 90:
                return 0.9
                break;
            case 100:
                return 1
            default:
                break;
        }
    }
    const addFilter=()=>{
        
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Lost deal Filter",
            modal_component: "lostdeal_filter",
            modal_data:null ,
            modal_size:300,
            modal_action:'lost_deal_filter',
        }))
    }
    const reopenDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure reopen this deal?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>Deal will appear in pipeline</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, reopen deal'
            },
            modal_action:'reopen_deal'
        }))
    }
    const togglePagination=(page,pageLength)=>{
        // console.log('pagination',pageLength)
        setPagination({
            page,
            pageLength
        })
        dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${page}/${pageLength}/*`))

    }
    const detailDeal=async (dealId)=>{
        let res=await dispatch(getDetailDeal(props.token,dealId))
        
        if(res){
            
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))
            }
            props.tabToggle('detail','lost_deal')
        }
        
    }
    const searchByType=debounce(async(value)=>{
        dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1/10/${value}`))
    },1000)
    const searchToggle=async(value)=>{
        
        await dispatch(setSearch(value))
        if(client.search.length>0){
            searchByType(value)
        }else{
            dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1/10/*`))

        }
        
    }
    const handleKeyPress = e => {
        if (e.key === "Enter") {
            //     this.setState(state => ({
            //         district: option
            //     }));
            // this.getClient();
            dispatch(dispatch(getLostDeal(props.token,`/${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/1/10/${client.search}`)))
        }
    };
    return (
        <div>
                <MuiThemeProvider theme={themeButton}>
                <div className='head-section'>
                    <h4>Lost deal</h4>
                </div>
                <div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    value={client.search}
                                    id="input-with-icon-textfield"
                                    name='password'
                                    onChange={(e)=>searchToggle(e.target.value)}
                                    onKeyPress={e =>
                                        handleKeyPress(e)
                                    }
                                    required
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{display:'flex',alignItems:'center',}}>
                                <div>
                                    <p className='pipeline-filterby'><b>Filter by:</b></p>
                                    <div style={{display:'flex',flexWrap:'wrap',width:500}}>
                                        <p className='pipeline-filterby'>Tribe : {tribe===0?'All Tribe':tribe_filter[0].text}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <p className='pipeline-filterby'>Deal period : {textPeriode}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <p className='pipeline-filterby'>Segment : {segment===0?'All Segment':segment_filter[0].text} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <p className='pipeline-filterby'>RM : {rm!==null?rm.label:'All RM'} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <p className='pipeline-filterby'>{probability.length>0&&"Probability: "+probability.map((data)=>`${getProbability(data.id)}`)} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        
                                    </div>
                                </div>
                                <button onClick={addFilter} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
                            </div>
                       </div>
                       <br/>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Deals name</TableCell>
                                <TableCell align="left">Client company name</TableCell>
                                <TableCell align="left">RM</TableCell>
                                <TableCell align="left">Value</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable?
                                    <Skeleton count={5}/>
                                :
                                pipeline.lost_deal.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell onClick={()=>detailDeal(data.dealId)} style={{maxWidth:200,minHeight:100,color:'#3B99EB',cursor:'pointer'}}><b>{data.dealName}</b></TableCell>
                                        <TableCell >{data.clientName}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{
                                            data.rms.map((rm)=>`${rm.text},`)
                                        }</TableCell>
                                        <TableCell >IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell  align="center">
                                            <Button onClick={()=>reopenDeal(data.dealId)} size='small' variant='text' color='primary' className='remove-capital'>Reopen</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                               
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                            {pipeline.lost_deal_pagination!==null&&
                            <TablePagination
                                    className="card-pagination"
                                    type="reduced"
                                    page={pipeline.lost_deal_pagination.page}
                                    pageLength={pipeline.lost_deal_pagination.perPage}
                                    totalRecords={pipeline.lost_deal_pagination.total}
                                    onPageChange={({ page, pageLength }) => {
                                        togglePagination(page,pageLength)
                                    }}
                                    prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                    nextPageRenderer={() => <img src={CevronRight}/>}
                                />
                            }
                        </div>
                       </div>
                   </div>
                </div>
                </MuiThemeProvider>
        </div>
    )
}
