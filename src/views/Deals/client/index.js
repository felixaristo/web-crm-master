import React, { Component } from 'react'
import '../style.css'
import {Button,FormControl,InputLabel,OutlinedInput,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
 } from '@material-ui/core/styles'
import ClientInfo from './client_information'
import Contact from 'assets/icon/Contact.svg'
import Close from 'assets/icon/close.svg'
import AddRm from './add_rm'
import AddContact from './add_contact'
import {connect} from 'react-redux'
import {addClient,updateClient,setClientAction} from 'redux/actions/client'
import {modalToggle} from 'redux/actions/general'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        }
    } 
})

class index extends Component {
    onSave=()=>{
        const {selected_rm,employee,name,industry,phone_no,fax,address1,address2,address3,website,remarks,id,client_action}=this.props.client
        // console.log('this.props.client', this.props.client)
        let realmanagerid=[]
        let employee_with_no_id=[]
        selected_rm.map(rm=>{
            realmanagerid.push(rm.relManagerId)
        })
        employee.map(emp=>{
            employee_with_no_id.push({name:emp.name,salutation:emp.salutation,valid:emp.valid,email:emp.email,phone:emp.phone,department:emp.department,position:emp.position})
        })

        let data={userId:this.props.profile.id,company:name,industryId:industry,phone:phone_no,address1,
            address2,address3,website,fax,remarks,relManagerIds:realmanagerid,contacts:employee_with_no_id}
        let data_update={userId:this.props.profile.id,id:id,company:name,industryId:industry,phone:phone_no,address1,
            address2,address3,website,fax,remarks,relManagerIds:realmanagerid,contacts:employee_with_no_id}
        // console.log('data', data)
        if(client_action==='add_client'){
            this.props.addClient(this.props.token,data)

        }else if(client_action==='edit_client'){
            this.props.updateClient(this.props.token,data_update)
        }else{
            this.props.setClientAction('edit_client')
        }
    }
    deleteClient=(id,name)=>{
        console.log('id,name', id,name)
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `form`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'Client',
                id:id,
                userId:this.props.profile.id,
                msg:`<p>Delete <b>${name}</b> will impact to project or workshop connected to <b>${name}</b>. make sure you have downloaded file project or workshop.</p>`
            },
            modal_action:'delete_client'
        })
    }
    handleDisable=()=>{
        const {client_action}=this.props.client
        if(client_action==='see_client'){
            return true
        }else{
            return false
        }
    }
    render() {
        let {tabToggle,client,master}=this.props
        console.log('client.client_action', client.client_action)
        return (
            <div>
                 <div className='head-section'>
                    <div>
                        <h4>{client.client_action==='edit_client'||client.client_action==='see_client'?'Client company detail':'Add new client company'}</h4>
                    </div>
                    <div>
                        <MuiThemeProvider theme={themeButton}>
                            <Button onClick={()=>tabToggle(master.tab_back,'pipeline')} size='small' color='primary' variant='outlined' className='head-section__btn'>Back</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {/* {client.client_action!=='add_client'&&
                            <>
                            <Button disabled={this.handleDisable()} onClick={()=>this.deleteClient(client.id,client.name)} size='small' color='secondary' variant='contained' className='head-section__btn'>
                                Delete
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </>
                            }    */}
                            <Button  onClick={()=>this.onSave()} size='small' color='primary' variant='contained' className='head-section__btn'>
                            {client.client_action==='add_client'||client.client_action==='edit_client'?'Save':'Edit'}
                                {/* Save */}
                            </Button>
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='card-content'>
                    <div className='add-client-top'>
                        <div className='add-client__information'>
                            <p className='bold'>Client company information</p>
                            <br/>
                            <ClientInfo handleDisable={this.handleDisable}/>
                        </div>
                        <div className='add-client__rm'>
                            <AddRm tabToggle={this.tabToggle} handleDisable={this.handleDisable}/>
                            <br/>
                        </div>
                    </div>
                    <div className='hr'></div>
                    <div className='add-client-bottom'>
                        <p className='bold'>List contact</p>
                        <br/>
                        <AddContact handleDisable={this.handleDisable}/>
                    </div>
                </div>
                <br/>
                <div className='head-section'>
                    <div>
                        {/* <h4>Add new client company</h4> */}
                    </div>
                    <div>
                        <MuiThemeProvider theme={themeButton}>
                        <Button onClick={()=>tabToggle(master.tab_back,'pipeline')} size='small' color='primary' variant='outlined' className='head-section__btn'>Back</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {/* {client.client_action!=='add_client'&&
                            <>
                            <Button disabled={this.handleDisable()} onClick={()=>this.onSave()} size='small' color='secondary' variant='contained' className='head-section__btn'>
                                Delete
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            </>
                            }    */}
                            <Button  onClick={()=>this.onSave()} size='small' color='primary' variant='contained' className='head-section__btn'>
                                {client.client_action==='add_client'||client.client_action==='edit_client'?'Save':'Edit'}
                                {/* Save */}
                            </Button>
                        </MuiThemeProvider>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    client:state.client,
    master:state.master,
})
const mapDispatchToProps={
    addClient,
    updateClient,
    modalToggle,
    setClientAction
}
export default connect(mapStateToProps,mapDispatchToProps)(index)