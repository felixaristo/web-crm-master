import React,{useEffect, useState} from 'react'
import { DatePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from 'moment'
import AutoCompleteSelect from 'components/Select'
import { useSelector,useDispatch } from 'react-redux';
import { setTarget } from 'redux/actions/account';
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import TextField from 'components/TextField'
import TextFieldCurrency from 'components/TextFieldCurrency'
import { postTargetIndividual,getTargetStatus } from 'redux/actions/account';
import { modalToggle } from 'redux/actions/general';
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,

      },
      width:'100%',
      marginBottom:15,
  },
 
  
}));
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffc466',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        },
    } 
})
const themeButton2 = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        },
    } 
})

export default function Add_target_individual(props) {
    const classes=useStyles()
    const dispatch = useDispatch()
    const [open_picker, setOpen] = useState(false)
    const [tab, settab] = useState('add')
    let monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
    const [target, settarget] = useState({
        name:'',
        year:{
            id:moment().year(),
            value:moment(),
            text:moment().year().toString()
        },
        id:props.profile.id,
        status:"Not Submitted yet",
        target_month:[
            {
                month:'Januari',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'February',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'March',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'April',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'May',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'June',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'July',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'August',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'September',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'October',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'November',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'December',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            
        ]
    })
    let {modal_data}=props
    useEffect(() => {
        if(props.modal_data!==null){
            let new_target_month=[]
            modal_data.items.map((d)=>{
                new_target_month.push({
                    month:monthNames[d.month-1],
                    no_proposal:d.targets[0].amount,
                    sales_visit:d.targets[1].amount,
                    proposal_value:d.targets[2].amount,
                    sales:d.targets[3].amount
                })
            })
            if(modal_data.self_target&&modal_data.status!=='Approved'){
                settab('self')
            }else{
                if(modal_data.status==='Approved'){
                    settab('approve')
    
                }else if(modal_data.status==='Rejected'){
                    settab('rejected')
    
                }else{
                    settab('pending')
    
                }
            }
            let new_year={
                id:modal_data.year,
                value:moment(`1-01-${modal_data.year}`),
                text:moment(`1-01-${modal_data.year}`).year().toString()
            }
            settarget({...target,year:new_year,id:modal_data.id,name:modal_data.name,status:modal_data.status,target_month:new_target_month.length>0?new_target_month:target.target_month})
        }
    }, [])
    

    const onChangeDate=(date)=>{
        console.log(`date`, date)
        settarget({
            ...target,
            year:{
                id:moment(date).year(),
                value:moment(date),
                text:moment(date).year().toString()
            }
        })
    }
    const onChange=(e,i)=>{
        let {name,value}=e.target
        target.target_month[i][name]=value
        settarget({
            ...target,
            target_month:[...target.target_month]
        })
       
    }
    const onSubmit=async (tabs=tab)=>{
        let new_item=[]
        target.target_month.map((d,i)=>{
            new_item.push({
                month:i+1,
                year:parseInt(target.year.text),
                targets:[
                    {
                        id:1,
                        amount:d.no_proposal
                    },
                    {
                        id:2,
                        amount:d.sales_visit
                    },
                    {
                        id:3,
                        amount:d.proposal_value
                    },
                    {
                        id:4,
                        amount:d.sales
                    },
                ]
            })
        })
        let data
        if(tabs==='edit'||tab==='add'){
            data={
                id:target.id,
                type:'rm',
                userId:props.profile.id,
                items:new_item,
                Reject:false,
                Approve:false
            }
            await dispatch(postTargetIndividual(data,tab==='add'?'Add Target':'Update Target'))
            dispatch(getTargetStatus(`/${moment().year()}/${target.id}`))
            // console.log(`from target`, data)
        }else if(tabs==='pending'){
            data={
                id:target.id,
                type:'rm',
                userId:props.profile.id,
                items:new_item,
                Reject:false,
                Approve:true
            }
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: `Are you sure confirm ${target.name} target?`,
                modal_component: "confirm2",
                modal_size:400,
                modal_type:'confirm',
                modal_data:{
                    msg:``,
                    title_cancel:'No, Cancel',
                    title_yes:'Yes, confirm',
                    cancelAction:()=>modal_data.cancelAction(),
                    modalAction:async ()=>{
                        await dispatch(postTargetIndividual(data,'Confirm Target'))
                        dispatch(getTargetStatus(`/${moment().year()}/${target.id}`))
                    }
                },
                modal_action:'approve_target'
            }))
    
        }else{
            data={
                id:target.id,
                type:'rm',
                userId:props.profile.id,
                items:new_item,
                Reject:true,
                Approve:false
            }
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: `Are you sure reject ${target.name} target?`,
                modal_component: "confirm2",
                modal_size:400,
                modal_type:'confirm',
                modal_data:{
                    msg:``,
                    title_cancel:'No, Cancel',
                    title_yes:'Yes, reject',
                    cancelAction:()=>modal_data.cancelAction(),
                    modalAction:async ()=>{
                        await dispatch(postTargetIndividual(data,'Reject Target'))
                        dispatch(getTargetStatus(`/${moment().year()}/${target.id}`))
                    }
                },
                modal_action:'reject_target'
            }))
        }
        
    }
    const handleDisable=()=>{
        if(tab==='add'||tab==='edit'){
            return false
        }else{
            return true
        }
    }
    const renderTitleBtnSubmit=()=>{
        if(tab==='edit'||tab==='add'){
            return 'Submit'
        }else{
            return 'Approve'
        }
    }
    return (
        <div>
            <div className='div-flex div-space-between' style={{alignItems:'flex-start'}}>
            <div className='div-flex' style={{width:'90%'}}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                    // disableFuture
                    openTo="year"
                    format="dd/MM/yyyy"
                    label="Date of birth"
                    views={["year"]}
                    value={moment()}
                    disabled={handleDisable()}
                    onChange={(date)=>onChangeDate(date)}
                    open={open_picker}
                    onAccept={()=>setOpen(!open_picker)}
                    onClose={()=>setOpen(!open_picker)}
                    TextFieldComponent={()=>(
                        <div style={{width:'20%'}}>
                           <AutoCompleteSelect
                                onFocus={()=>setOpen(true)}
                                onChange={(event,value)=>null}
                                options={[]}
                                value={target.year}
                                disabled={handleDisable()}
                                getOptionLabel={(option) => option.text}
                                label="Year"
                                disableClearable
                            />
                        </div>
                    )}
                />
            </MuiPickersUtilsProvider>
            &nbsp;&nbsp;&nbsp;
            <div style={{width:'40%'}}>
                <TextField
                    label="Status"
                    onChange={null}
                    value={target.status}
                    color='primary'
                    variant='outlined'
                    size='small'
                    name='name'
                    // className={classes.textField}
                    disabled
                    style={{marginBottom:15}}
                />
            </div>
            </div>
            {(tab==='detail'||tab==='pending'||tab==='self')&&<MuiThemeProvider theme={themeButton2}>
                <Button onClick={()=>settab('edit')} style={{width:150,fontWeight:'bold'}} className='btn-remove-capital btn-rounded' variant="outlined" color="primary">Edit</Button>
            </MuiThemeProvider>}
            </div>
            <div style={{padding:'0 20px'}}>
                {target.target_month.map((data,i)=>(
                    <div key={i}>
                        <p className='semi-bold'>{data.month}</p>
                        <div style={{display:'flex',gap:15,justifyContent:'space-between'}}>
                            <TextField
                                label="Target No.Proposal"
                                onChange={(e)=>onChange(e,i)}
                                value={data.no_proposal}
                                color='primary'
                                variant='outlined'
                                size='small'
                                name='no_proposal'
                                className={classes.textField}
                                disabled={handleDisable()}
                            />
                            <TextField
                                label="Target Sales Visit"
                                onChange={(e)=>onChange(e,i)}
                                value={data.sales_visit}
                                color='primary'
                                variant='outlined'
                                size='small'
                                name='sales_visit'
                                className={classes.textField}
                                disabled={handleDisable()}
                            />
                            <TextFieldCurrency
                                label="Proposal Value (IDR)"
                                onChange={(e)=>onChange(e,i)}
                                currencySymbol=""
                                decimalCharacter="."
                                digitGroupSeparator=","
                                outputFormat="string"
                                value={data.proposal_value}
                                color='primary'
                                variant='outlined'
                                size='small'
                                name='proposal_value'
                                className={classes.textField}
                                disabled={handleDisable()}
                            />
                            <TextFieldCurrency
                                label="Sales (IDR)"
                                onChange={(e)=>onChange(e,i)}
                                value={data.sales}
                                color='primary'
                                variant='outlined'
                                size='small'
                                name='sales'
                                className={classes.textField}
                                currencySymbol=""
                                decimalCharacter="."
                                digitGroupSeparator=","
                                outputFormat="string"
                                disabled={handleDisable()}
                            />
                        </div>
                        <br/>
                    </div>
                ))}
                <div style={{textAlign:'right'}}>
                    <MuiThemeProvider theme={themeButton}>
                    {(tab==='pending'&&props.profile.roleId!==5)&&<><Button onClick={()=>onSubmit('reject')} color="secondary" className='btn-remove-capital btn-rounded' variant="text">Reject</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;</>}
                    {((tab==='pending'||tab==='edit'||tab==='add')&&tab!=='self')&&<Button onClick={()=>onSubmit(tab)} color="primary" className='btn-remove-capital btn-rounded' variant="contained">{renderTitleBtnSubmit()}</Button>}
                    </MuiThemeProvider>
                </div>
                <br/>
            </div>
        </div>
    )
}
