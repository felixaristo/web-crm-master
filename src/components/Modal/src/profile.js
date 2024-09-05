import React, { Component } from 'react'
import Close from 'assets/icon/close.svg'
import {Badge,Avatar,Typography,Divider,Button,TextField,Collapse,CircularProgress} from '@material-ui/core'
import {CameraAlt} from '@material-ui/icons'
import AvaDefault from 'assets/icon/avadefault.svg'
import Key from 'assets/icon/Key.png'
import Add from 'assets/icon/Add.svg'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
import {logout,changePassword} from 'redux/actions/auth'
import {connect} from 'react-redux'
import {getClient,getContact,getEmployee} from 'redux/actions/master'
import {getClient as getClientForIndustry} from 'redux/actions/client'
import {modalToggle} from 'redux/actions/general'
import * as actionType from 'redux/constants/pipeline'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',

        },
        secondary: {
            main:'#FFFFFF',
        }
    } 
})
class profile extends Component {
    state={
        password_toggle:false,
        edited:false,
        oldPassword:'',
        newPassword:'',
        name:''
    }
    togglePassword=()=>{
        this.setState({password_toggle:!this.state.password_toggle,edited:!this.state.edited})
    }
    onChange=(e)=>{
        e.preventDefault()
        this.setState({[e.target.name]:e.target.value})
    }
    onSave=()=>{
        let {oldPassword,newPassword}=this.state
        let data={oldPassword,newPassword}
        // console.log('this.props.token', this.props.token)
        this.props.changePassword(this.props.token,data)
    }
    addSalesVisit=async (clientId)=>{
        // dispatch({
        //     type:actionType.RESET_SALES_VISIT
        // })
        // await this.props.getContact(this.props.token,clientId)
        console.log(`this.props.master.employee`, this.props.master.employee)
        if(this.props.master.employee.length>0){
            this.props.modalToggle({
                modal_open: true,
                modal_title: "Sales Visit ",
                modal_component: "sales_visit_without_deal",
                modal_data:{clientId:clientId} ,
                modal_size:500,
                modal_action:'add_sales_visit'
            })
        }else{
            // alert('asdf')
            await this.props.getClientForIndustry(this.props.token)
            await this.props.getEmployee(this.props.token)
            this.props.modalToggle({
                modal_open: true,
                modal_title: "Sales Visit ",
                modal_component: "sales_visit_without_deal",
                modal_data:{clientId:clientId} ,
                modal_size:500,
                modal_action:'add_sales_visit'
            })
        }
        
    }
    render() {
        const {password_toggle,edited}=this.state
        const {profile,general,master}=this.props
        let branch=master.branches.filter((data)=>{
            return data.id===profile.branchId
        })
        let segment=master.segments.filter((data)=>{
            return data.id===profile.segmentId
        })
        return (
            <div>
                    <div className='modal-body' >
                        <div className='profile-container'>
                            <Badge
                                overlap="circle"
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                                badgeContent={<div style={{backgroundColor:'white',width:30,height:30,display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'50%',border:'2px solid white'}}><CameraAlt fontSize="inherit" color="primary" style={{fontSize:19}} /></div>}

                            >
                                <Avatar alt="Travis Howard" src={profile.profilePic?profile.profilePic:AvaDefault} style={{width:80,height:80}} />
                            </Badge>
                            <br/>
                            <h2>{profile.name}</h2>
                            <p>{profile.email}</p>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <p>Branch <b>{master.branches.length>0&&profile.branchId!==0?branch[0].text:'-'}</b></p>
                                &nbsp;<div style={{width:1,height:20,marginTop:-10,backgroundColor:'#777777'}}></div>&nbsp;
                                <p>Segment <b>{master.segments.length>0&&profile.segmentId!==0?segment[0].text:'-'}</b></p>
                            </div>
                        </div>
                        <Divider />
                        <div style={{padding:10}}>
                        <p style={{margin:3,fontSize:14,fontWeight:600,color:'#777777'}}>Activity</p>
                        <Button
                            onClick={this.addSalesVisit}
                            className='btn-remove-capital'
                            style={{textTransform:'none',fontWeight:'bold',color:'#777777'}}
                            variant="text"
                            color="default"
                            size="small"
                            // className={classes.button}
                            startIcon={<img src={Add} style={{width:15}}/>}
                        >
                            Add sales visit
                        </Button>
                        </div>
                        <Divider />
                        <div style={{padding:10}}>
                            <Button className='btn-remove-capital' color='primary' variant='text'
                                startIcon={<img src={Key} style={{width:20}} />}
                                onClick={this.togglePassword}
                            >
                                Change password
                            </Button>
                            <Collapse in={password_toggle}>
                                <TextField type="password" name="oldPassword" onChange={this.onChange} id="outlined-basic1" label="Old password" variant="outlined"  size="small" style={{width:'100%',marginTop:10}}/>
                                <TextField type="password" name="newPassword" onChange={this.onChange} id="outlined-basic1" label="New password" variant="outlined"  size="small" style={{width:'100%',marginTop:10,marginBottom:10}} />
                            </Collapse>
                            {general.error_msg!==null&&<p style={{color:'red'}}>{general.error_msg}</p>}
                        </div>
                        <Divider />
                        <div style={{display:'flex',justifyContent:'flex-end',marginTop:10,marginBottom:10}}>
                            {/* <Button onClick={()=>window.location.assign('/account')} className='btn-remove-capital' style={{fontWeight:'bold'}} color='primary' variant='text'>
                                Individual Report
                            </Button> */}
                            <MuiThemeProvider theme={themeButton}>
                            {edited?
                            <Button onClick={this.onSave} className='btn-rounded btn-remove-capital' variant='contained' color='primary'>
                                Update
                            </Button>
                            :
                            <Button onClick={this.props.logout} className='btn-rounded btn-remove-capital' variant='contained' color='secondary'>
                                Log out
                            </Button>
                            }
                            </MuiThemeProvider>
                        </div>
                    </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    master:state.master
})
export default connect(mapStateToProps,{getClientForIndustry,logout,changePassword,getEmployee,getContact,getClient,modalToggle})(profile)