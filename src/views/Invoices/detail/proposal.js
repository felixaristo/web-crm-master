import React from 'react'
import Edit from 'assets/icon/edit.png'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,} from '@material-ui/core'
import Select1 from 'react-select'
import moment from 'moment'
import ReactNumberFormat from 'react-number-format'
import {modalToggle} from 'redux/actions/general'
import {setProposal} from 'redux/actions/pipeline'
import { useDispatch, useSelector } from "react-redux";
import {viewFile} from 'redux/actions/pipeline'
import {handle_access} from 'service/handle_access'

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
export default function Proposal(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const master=useSelector(state=>state.master)
    const pipeline=useSelector(state=>state.pipeline)
    const {rms}=pipeline.detail_deal
    const editProposal=(data)=>{
        dispatch(setProposal({
            typeId:data.proposalType.id,
        }))
        dispatch(setProposal({
            filename:data.filename,
        }))
        dispatch(setProposal({
            proposalValue:data.proposalValue,
        }))
        dispatch(setProposal({
            sendDate:data.sentDate,
        }))
        
        let new_invoice=[]
        let new_contact=[]
        let new_sentById=master.rm.filter((rm)=>{
            return rm.value===data.sentById
        })
        data.contactIds.map((contact)=>{
            let filter=master.contact.filter((data)=>{
                return data.id===contact
            })
            new_contact.push(filter[0])
            console.log('filter', contact,filter,master.contact)
        })
        data.invoices.map((data)=>{
            new_invoice.push({
                invoiceDate:moment(data.invoiceDate).format('YYYY-MM-DD'),
                invoiceAmount:data.invoiceAmount,
                remarks:data.remarks
            })
        })
        dispatch(setProposal({
            sentById:new_sentById[0],
        }))
        
        dispatch(setProposal({
            contactIds:new_contact,
        }))
        dispatch(setProposal({
            invoices:new_invoice
        }))
        dispatch(setProposal({
            dealId:pipeline.detail_deal.id
        }))

        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Edit Proposal for ${pipeline.detail_deal.clientCompany.text}`,
            modal_component: "proposal",
            modal_data:{id:data.id,dealId:pipeline.detail_deal.id} ,
            modal_size:550,
            modal_action:'edit_proposal',
            modal_type:'multi'
        }))
        console.log('new_contact', new_contact,data.contactIds)
    }
    const onClickView=(url)=>{
        let {proposal}=pipeline.detail_deal
        // console.log('proposal', proposal.proposalType.id,proposal.id)
        // console.log('pipeline.detail_deal', pipeline.detail_deal)
        dispatch(viewFile(props.token,`1/${proposal.id}/${props.profile.id}`))
    }
    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
    console.log('pipeline.detail_deal.proposal', pipeline.detail_deal.proposal)
    return (
        <div>
           <div className='detail-card-wrapper'>
                <div className='detail-card-header'>
                    <h3>Proposal <span style={{color:'red'}}>*</span></h3>
                    <div style={{display:'flex'}}>
                        <MuiThemeProvider theme={themeButton2}>
                            {/* <Button onClick={detailProposal} size='small' variant='text' color='secondary' className='btn-remove-capital'>Detail Proposal</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp; */}
                            {pipeline.detail_deal.state.text!=='Lost'&&handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<img onClick={()=>pipeline.detail_deal.proposal!==null?editProposal(pipeline.detail_deal.proposal):null} src={Edit} className='card-header-icon' />}
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='detail-card-body'>
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Deal type</InputLabel>
                        <Select disabled value={pipeline.detail_deal.proposal!==null&&pipeline.detail_deal.proposal.proposalType.id}  onChange={(e)=>null} labelId="label" id="select"  labelWidth={70} className='field-radius'>
                            {master.proposalTypes.map((data,i)=>(
                                <MenuItem key={i} value={data.id}>{data.text}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p className='semi-bold' style={{marginBottom:5}}>Proposal file</p>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <p className='semi-bold' >{pipeline.detail_deal.proposal!==null&&pipeline.detail_deal.proposal.filename}</p>
                        <MuiThemeProvider theme={themeButton2}>
                            {pipeline.detail_deal.proposal!==null&&
                            <Button style={{fontWeight:'bold'}} onClick={()=>onClickView(pipeline.detail_deal.proposal.url)} size='small' variant='text' color='secondary' className='btn-remove-capital'>
                                View
                            </Button>}
                        </MuiThemeProvider>
                    </div>
                    <p className='semi-bold' >Invoice period</p>
                    <Table  size="small" aria-label="a dense table" style={{color:'#777777',marginTop:10}}>
                    <TableHead>
                    <TableRow >
                        <TableCell style={{width:100}} className='card-content-item-jurnal-text'>Period</TableCell>
                        <TableCell style={{width:110}} className='card-content-item-jurnal-text'>Value</TableCell>
                        <TableCell className='card-content-item-jurnal-text'>Remark</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {pipeline.detail_deal.proposal!==null&&pipeline.detail_deal.proposal.invoices.map((data,i)=>(
                            <TableRow >
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    {moment(data.invoiceDate).format('MMMM YYYY')}
                                </TableCell>
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    IDR <ReactNumberFormat value={data.invoiceAmount} displayType={'text'} thousandSeparator={true} />
                                </TableCell>
                                <TableCell className='card-content-item-jurnal-text-without-weight'>
                                    {data.remarks}
                                </TableCell>
                            </TableRow>
                        ))}
                        
                    </TableBody>
                </Table>
                </div>
                <div className='card-proposal-footer'>
                    <p>Proposal value (IDR)</p>
                    <p><ReactNumberFormat value={pipeline.detail_deal.proposal!==null&&pipeline.detail_deal.proposal.proposalValue} displayType={'text'} thousandSeparator={true} /></p>
                </div>
            </div>
        </div>
    )
}
