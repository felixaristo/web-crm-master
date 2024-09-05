import React,{useState, useEffect} from 'react'
import Edit from 'assets/icon/edit.png'
import Building from 'assets/icon/Building.svg'
import User from 'assets/icon/User.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import {Button,TextField,Table,TableHead,TableRow,TableCell,TableBody,
InputLabel,Select,MenuItem,FormControl,} from '@material-ui/core'
import Select1 from 'react-select'
import Add from 'assets/icon/Add.svg'
import { useDispatch, useSelector } from "react-redux";
import {updateClient2} from 'redux/actions/master'
import {setClientAction,detailClient} from 'redux/actions/client'
import {getDetailDeal} from 'redux/actions/pipeline'
import AutoCompleteSelect from 'components/Select'
import {getClient as getForClient} from 'redux/actions/client'
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
export default function Information(props) {
    const classes=useStyles()
    const dispatch=useDispatch()
    const [state, setstate] = useState({
        companyName:'',
        contactId:null,
        memberIds:[]
    })
    const pipeline=useSelector(state=>state.pipeline)
    const {clientCompany,clientContact,clientMembers,id,rms}=pipeline.detail_deal
    
    useEffect(()=>{
        if(pipeline.detail_deal!==null){
           
            setstate({
                ...state,
                companyName:clientCompany.text,
                contactId:clientContact.id!==0?clientContact:null,
                memberIds:clientMembers
            })
        }
        
    },[])
    const [edit,setEdit]=useState(false)
    const master=useSelector(state=>state.master)
    
    const onClickSave= async ()=>{
        let new_member=[]
        state.memberIds.map((data)=>{
            new_member.push(data.id)
        })
        let data={
            clientId:pipeline.detail_deal.clientCompany.id,
            dealId:pipeline.detail_deal.id,
            userId:props.profile.id,
            companyName:state.companyName,
            contactId:state.contactId.value,
            memberIds:new_member
        }
        await dispatch(updateClient2(props.token,data))
        dispatch(getDetailDeal(props.token,pipeline.detail_deal.id))
        setEdit(false)
        // console.log('data', data,state.memberIds)
    }
    const clickDetail=async ()=>{
        await dispatch(detailClient(props.token,pipeline.detail_deal.clientCompany.id))

        await dispatch(getForClient(props.token,`/0/0/0/1/10/*`))
        dispatch(setClientAction('see_client'))

        props.tabToggle('client','detail')
    }
    const new_rms_for_access=[]
     rms.map((data)=>{
         new_rms_for_access.push({id:data.userId,text:data.name})
     })
    return (
        <div>
           <div className='detail-card-wrapper'>
                <div className='detail-card-header'>
                    <h3>Client Information</h3>
                    <div style={{display:'flex',justifyContent:'flex-end',textAlign:'right'}}>
                        <MuiThemeProvider theme={themeButton2}>
                            <Button onClick={clickDetail} size='small' variant='text' color='secondary' className='btn-remove-capital'>Detail Client</Button>
                            
                            {edit?
                            <Button onClick={onClickSave} size='small' variant='text' color='secondary' className='btn-remove-capital'>Save</Button>
                            :
                            <>
                            {/*  */}
                            {pipeline.detail_deal.state.text!=='Lost'&&handle_access(props.profile.id,props.profile.roleId,[],new_rms_for_access)&&<>&nbsp;&nbsp;&nbsp;<img onClick={()=>setEdit(true)} src={Edit} className='card-header-icon' /></>}
                            </>
                            }
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='detail-card-body'>
                    <TextField
                        label={<p style={{marginTop:-2}}>Client company name<span style={{color:'red'}}>*</span></p>}
                        type='text'
                        disabled={edit?false:true}
                        value={state.companyName}
                        onChange={(e)=>setstate({...state,companyName:e.target.value})}
                        variant='outlined'
                        size='small'
                        className={classes.textField}
                        multiline
                    />
                    <AutoCompleteSelect
                        disabled={edit?false:true}
                        onChange={(event,value)=>setstate({...state,contactId:value})}
                        options={master.contact}
                        value={state.contactId}
                        getOptionLabel={(option) => option.text}
                        label={<>Client contact</>}
                    />
                    {/* <div style={{marginBottom:15}}>
                        <Select1
                            placeholder={<p>Client contact<span style={{color:'red'}}>*</span></p>}
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
                            
                            isDisabled={edit?false:true}
                            options={master.contact} 
                            value={state.contactId}
                            onChange={(data)=>setstate({...state,contactId:data})}
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
                    <AutoCompleteSelect
                        multiple

                        disabled={edit?false:true}
                        onChange={(event,value)=>setstate({...state,memberIds:value})}
                        options={master.contact}
                        value={state.memberIds}
                        getOptionLabel={(option) => option.text}
                        label={<>Client member</>}
                    />
                    {/* <div style={{marginBottom:10}}>
                        <Select1
                            isMulti
                            isClearable
                            placeholder={<p>Client member</p>}
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
                            isDisabled={edit?false:true}
                            options={master.contact} 
                            value={state.clientMembers}
                            onChange={(data)=>setstate({...state,clientMembers:data})}
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
