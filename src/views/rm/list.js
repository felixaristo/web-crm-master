import React,{useState,useEffect} from 'react'
import {Button,FormControl,InputLabel,OutlinedInput,InputAdornment
    ,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import SearchTable from 'components/SearchTable'
import { debounce } from 'lodash'
import DataTable from 'components/DataTable'
import * as actionRm from 'redux/actions/rm'
import filter from 'assets/icon/filter.svg'
import Eye from 'assets/icon/eye.png'
import Edit from 'assets/icon/edit.png'
import Close from 'assets/icon/close.svg'
import Excel from  'assets/icon/Excel.png'
import { modalToggle,modalToggleReset } from 'redux/actions/general'
import { DatePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import _ from 'lodash'
import moment from 'moment'

const RenderHead=(props)=>(
    <div className='div-flex div-space-between' style={{alignItems:'flex-end'}}>
        <SearchTable
            {...props}
            searchToggle={(value)=>props.searchToggle(value)}
        />
        <div className='div-flex ' style={{alignItems:'flex-end'}}>
            <div >
                <p className='pipeline-filterby'><b>Filter by:</b></p>
                <div style={{display:'flex',flexWrap:'wrap',maxWidth:500}}>
                    <p className='pipeline-filterby'>Segment : {_.isEmpty(props.reducer.rm.filter.segments)?'All Segments':props.reducer.rm.filter.segments.map((d)=>{return d.text}).join(' , ')}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <p className='pipeline-filterby'>Branch : {_.isEmpty(props.reducer.rm.filter.branches)?'All Branches':props.reducer.rm.filter.branches.map((d)=>{return d.text}).join(' , ')}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </div>
            </div>
        <button onClick={props.filterRm} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
        </div>
    </div>
)
export default function List(props) {
    const [filter_chart,setFilterChart]=useState(moment())
    const [open_picker,setOpen]=useState(false)
    const [choosen_rm, setchoosen_rm] = useState(null)

    const [search, setsearch] = useState('')
    let {dispatch,reducer,profile}=props
    useEffect(() => {
        getRm(`/0/0/1/10/*`)
    }, [])
    const getRm=async (slug)=>{
        let res=await dispatch(actionRm.getRmList(slug))
        return res
    }
    const searchToggle=debounce(async (e)=>{
        setsearch(e)
        getRm(`/0/0/1/10/${e.length>0?e:'*'}`)
    },1000)

    const togglePagination=(page,pageLength)=>{
        getRm(`/0/0/${page}/${pageLength}/${search.length>0?search:'*'}`)
    }
    const addRm=()=>{
        dispatch(actionRm.setRm({
            detail_rm:{
                id:0,
                name:'',
                nik:'',
                email:'',
                phone:'',
                address:'',
                jobTitle:'',
                platformId:null,
                segmentId:null,
                branchId:null,
                fileBase64:'',
                filename:'',
                file_url:''
            }
        }))
        props.settab('add')
    }
    const editRm=(data)=>{
        dispatch(actionRm.setRm({
            detail_rm:{
                id:data.id,
                name:data.name,
                nik:data.nik,
                email:data.email,
                phone:data.phone,
                address:data.address,
                jobTitle:data.jobTitle,
                platformId:data.platform,
                segmentId:data.segment,
                branchId:data.branch,
                fileBase64:'',
                filename:'',
                file_url:data.profileURL
            }
        }))
        props.settab('edit')
    }
    const detailRm=(data)=>{
        dispatch(actionRm.setRm({
            detail_rm:{
                id:data.id,
                name:data.name,
                nik:data.nik,
                email:data.email,
                phone:data.phone,
                address:data.address,
                jobTitle:data.jobTitle,
                platformId:data.platform,
                segmentId:data.segment,
                branchId:data.branch,
                fileBase64:'',
                filename:'',
                file_url:data.profileURL
            }
        }))
        props.settab('detail')
    }
    const deleteAction=async (data)=>{
        
        console.log(`data`, data)
        let res=await dispatch(actionRm.deleteRm(data.id))
        if(res){
            let new_segment=[]
            let new_branch=[]
            reducer.rm.filter.segments.map((d)=>{
                new_segment.push(d.id)
            })
            reducer.rm.filter.branches.map((d)=>{
                new_branch.push(d.id)
            })
            getRm(`/${_.isEmpty(new_segment)?0:new_segment.join(',')}/${_.isEmpty(new_branch)?0:new_branch.join(',')}/${reducer.rm.pagination.page}/${reducer.rm.pagination.perPage}/${search!==''?search:'*'}`)
        }
    }
    const deleteRm=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `list`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'RM',
                modalAction:()=>deleteAction(data),
                msg:`<p>Are you sure Delete <b>${data.name}</b> ?</p>`
            },
            modal_action:'delete_rm_list'
        }))
    }
    const filterAction=async (data)=>{
        dispatch(modalToggleReset())

        let new_segment=[]
        let new_branch=[]
        data.segments.map((d)=>{
            new_segment.push(d.id)
        })
        data.branches.map((d)=>{
            new_branch.push(d.id)
        })
        let res=await getRm(`/${_.isEmpty(new_segment)?0:new_segment.join(',')}/${_.isEmpty(new_branch)?0:new_branch.join(',')}/1/10/*`)
        if(res){
            dispatch(actionRm.setRm({filter:data}))
        }
        
    }
    const filterRm=()=>{
        props.dispatch(modalToggle({
            modal_open: true,
            modal_title: "Filter",
            modal_component: 'filter_rm',
            modal_data:{modalAction:(data)=>filterAction(data),filter:reducer.rm.filter} ,
            modal_size:300,
            modal_action:'filter_rm',
        }))
    }
    const getExcel=(data,date)=>{
        // console.log(`data,date`, data,date)
        dispatch(actionRm.getExcelRm(`/${data.userId}/${moment(date).year()}/*`,data.name))
    }
    const onAccept=(date,data)=>{
        // getExcel(data,date)
        dispatch(actionRm.getExcelRm(`/${choosen_rm.userId}/${moment(date).year()}/*`,choosen_rm.name,moment(date).year()))
        // console.log(`date,data`, date,data)
    }
    const openYearFilter=(data)=>{
        // console.log(`data`, data)
        setchoosen_rm(data)
        setOpen(!open_picker)
    }
    // console.log(`reducer.rm.list_rm`, reducer.rm.list_rm)
    return (
        <div>
            <div className='head-section'>
                <h4><b>Relationship Manager List</b></h4>
                {props.profile.roleId===1&&<Button onClick={addRm} className='btn-remove-capital btn-rounded' variant='contained' color="primary">Add new RM</Button>}
            </div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
                // disableFuture
                openTo="year"
                format="dd/MM/yyyy"
                label="Date of birth"
                views={["year"]}
                value={filter_chart}
                onChange={(date)=>setFilterChart(date)}
                open={open_picker}
                onAccept={(date)=>onAccept(date)}
                onClose={()=>setOpen(!open_picker)}
                TextFieldComponent={()=>(
                    <>
                    
                    {/* <button onClick={()=>setOpen(!open_picker)} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp; */}
                    </>
                )}
            />
            <DataTable
                head={['No.','Name','Job Title','Platform','Segment','Branch','Email','Action']}
                body={()=>{
                    return reducer.rm.list_rm.map((data,i)=>(
                        <TableRow key={i}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.jobTitle}</TableCell>
                            <TableCell>{data.platform.text}</TableCell>
                            <TableCell>{data.segment.text}</TableCell>
                            <TableCell>{data.branch.text}</TableCell>
                            <TableCell>{data.email}</TableCell>
                            <TableCell align="right">
                                <img src={Eye} onClick={()=>detailRm(data)} className='icon-action'/>
                                <img src={Edit} onClick={()=>editRm(data)} className='icon-action'/>
                                <img src={Close} onClick={()=>deleteRm(data)} className='icon-action'/>
                                <img src={Excel} onClick={()=>openYearFilter(data)} className='icon-action'/>
                                
                            </TableCell>
                        </TableRow>
                    ))
                }}
                cardHead={<RenderHead {...props} filterRm={filterRm} searchToggle={searchToggle} />}
                loading={reducer.general.isLoadingTable}
                pagination={reducer.rm.pagination}
                togglePagination={togglePagination}
            />
            </MuiPickersUtilsProvider>

        </div>
    )
}
