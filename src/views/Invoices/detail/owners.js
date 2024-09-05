import React,{useState,useEffect} from 'react'
import Edit from 'assets/icon/edit.png'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,} from '@material-ui/core'
import Select1 from 'react-select'
import Add from 'assets/icon/Add.svg'
import ClientInformation from './information'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle} from 'redux/actions/general'
import AutoCompleteSelect from 'components/Select'
import {handle_access} from 'service/handle_access'
import ReactNumberFormat from 'react-number-format'
import { setDetailDeal,addOwner,addOwnerWithoutAlert } from 'redux/actions/pipeline'

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
        },
        warning:{
            main:'#ffb100',
            contrastText: '#FFFFFF',
        }
    } 
})
const themeButton2 = createMuiTheme({ 
    palette: { 
        primary:{
            main:'#ffb100',
            contrastText: '#FFFFFF',
        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        },

    } 
})
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
      marginBottom:15
  }
  
}));

export default function Owners(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const [newconsultant, setconsultants] = useState([])
    let {branch,tribe,segment,rms,consultants,id,tribes,proposal,pic}=pipeline.detail_deal
    // console.log('pipeline.detail_deal', pipeline.detail_deal)
    useEffect(() => {
        let new_consultant=[]
        consultants.map((data)=>{
            new_consultant.push({label:data.text,value:data.id})
        })
        setconsultants(new_consultant)
        if(proposal){
            configProposalValueChange()
        }
    }, [pipeline.detail_deal])
    const configProposalValueChange=async ()=>{
        let total_nominal_tribe=0;
        tribes.map(d=>total_nominal_tribe+=d.nominal)
        let total_nominal_rm=0;
        rms.map(d=>total_nominal_rm+=d.nominal)
        if(total_nominal_rm!==proposal.proposalValue||total_nominal_tribe!==proposal.proposalValue){
            let new_consultants=[]
            consultants.map((data)=>{
                new_consultants.push(data.id)
            })
            let new_tribes=[]
            tribes.map((data)=>{
                let percent = data.percent
                let nominal = (percent/100)*proposal.proposalValue
                new_tribes.push({tribeId:data.id,percent:data.percent,nominal,usePercent:data.usePercent})
            })
            let new_rms=[]
            rms.map((data)=>{
                let percent = data.percentage;
                let nominal = (percent/100)*proposal.proposalValue
                new_rms.push({userId:data.userId,percent:data.percentage,nominal,usePercent:data.usePercent})
            })
            let data={
                dealId:id,
                userId:props.profile.id,
                segmentId:segment.id,
                branchId:branch.id,
                consultants:new_consultants,
                rms:new_rms,
                tribes:new_tribes,
                picId:pic.id
            }   
            dispatch(addOwnerWithoutAlert(props.token,data))
        }
    }
    const detailOwner=()=>{
        let new_rms=[]
        rms.map((data)=>{
            new_rms.push({percent:data.percentage,...data,full_user:{name:data.name,email:data.email,userId:data.userId}})
        })
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Deal Owners",
            modal_component: "owner",
            modal_data:{dealId:id,branch:branch,tribe:tribes,rms:new_rms,consultants:consultants,segment:segment,proposalValue:proposal?.proposalValue,pic:pic} ,
            modal_size:500,
            modal_action:'edit_owner'
        }))
    }
    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
    //  console.log('handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)', handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access))

    return (
        <div>
            <div className='detail-card-wrapper'>
                <div className='detail-card-header'>
                    <h3>Owners</h3>
                    <div style={{display:'flex'}}>
                    {pipeline.detail_deal.state.text!=='Lost'&&handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<img src={Edit} className='card-header-icon' onClick={detailOwner}/>}
                    </div>
                </div>
                <div className='detail-card-body'>
                <p className='semi-bold'>Tribe</p>
                    <div className='hr'></div>
                    <Table  size="small" aria-label="a dense table" style={{color:'#777777'}}>
                        <TableHead>
                        <TableRow >
                            <TableCell style={{width:150}} className='card-content-item-jurnal-text'>Tribe name</TableCell>
                            <TableCell style={{textAlign:'center'}} className='card-content-item-jurnal-text'>Share</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {tribes.map((data,i)=>(
                                <TableRow key={i}>
                                    <TableCell className='card-content-item-jurnal-text-without-weight'>
                                        {/* <MuiThemeProvider theme={themeButton2}>
                                            <Button onClick={null} size='small' variant='text' color='secondary' className='btn-remove-capital'>{data.name}</Button>
                                        </MuiThemeProvider> */}
                                        {data.text}
                                    </TableCell>
                                    <TableCell style={{textAlign:'center'}} className='card-content-item-jurnal-text-without-weight'>
                                        {data.usePercent?`${data.percent}%`:<ReactNumberFormat prefix='Rp ' value={data.nominal} displayType={'text'} thousandSeparator={true} />}
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                    <br/>
                    <p className='semi-bold'>Relationship Manager</p>
                    <div className='hr'></div>
                    <Table  size="small" aria-label="a dense table" style={{color:'#777777'}}>
                        <TableHead>
                        <TableRow >
                            <TableCell style={{width:150}} className='card-content-item-jurnal-text'>Name</TableCell>
                            <TableCell style={{textAlign:'center'}} className='card-content-item-jurnal-text'>Share</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {rms.map((data,i)=>(
                                <TableRow key={i}>
                                    <TableCell className='card-content-item-jurnal-text-without-weight'>
                                        <MuiThemeProvider theme={themeButton2}>
                                            <Button onClick={null} size='small' variant='text' color='secondary' className='btn-remove-capital'>{data.name}</Button>
                                        </MuiThemeProvider>
                                    </TableCell>
                                    <TableCell style={{textAlign:'center'}} className='card-content-item-jurnal-text-without-weight'>
                                        {data.usePercent?`${data.percentage}%`:<ReactNumberFormat prefix='Rp ' value={data.nominal} displayType={'text'} thousandSeparator={true} />}
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                    {/* <div style={{display:'flex'}}>
                        <p className='semi-bold' style={{width:130}}>Tribe</p>
                        <p className='semi-bold'>{tribe.text}</p>
                    </div> */}
                    <br/>
                    <div style={{display:'flex',width:'100%'}}>
                        <p className='semi-bold' style={{width:130}}>Segment</p>
                        <p className='semi-bold'>{segment.text}</p>
                    </div>
                    <div style={{display:'flex',width:'100%',marginBottom:20}}>
                        <p className='semi-bold' style={{width:130}}>Branch</p>
                        <p className='semi-bold'>{branch.text}</p>
                    </div>
                    <div style={{marginTop:15}}>
                    <AutoCompleteSelect
                        // multiple
                        disabled={true}
                        // onChange={(event,value)=>setconsultants({...state,contactId:value})}
                        options={[]}
                        value={pipeline.detail_deal.pic}
                        getOptionLabel={(option) => option.text}
                        label={<>Person in Charge</>}
                    />
                    </div>
                    <div style={{marginTop:15}}>
                    <AutoCompleteSelect
                        multiple
                        disabled={true}
                        // onChange={(event,value)=>setconsultants({...state,contactId:value})}
                        options={master.employee}
                        value={newconsultant}
                        getOptionLabel={(option) => option.label}
                        label={<>Consultan</>}
                    />
                    </div>
                    {/* <div style={{marginBottom:15,marginTop:15}}>
                        <Select1
                            isDisabled={true}
                            isMulti
                            isClearable
                            placeholder={<p >Consultan<span style={{color:'red'}}>*</span></p>}
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
                            options={master.employee} 
                            value={newconsultant}
                            // onChange={(data)=>this.props.setEventId(data.value)}
                            theme={theme => ({
                                ...theme,
                                borderRadius: 10,
                                colors: {
                                ...theme.colors,
                                primary: '#afe597',
                                zIndex:1000
                                },
                            })}
                        />
                    </div> */}
                </div>
            </div>
        </div>
    )
}
