import React, { Component } from 'react'
import '../style.css'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
import {Button } from '@material-ui/core'
import {connect} from 'react-redux'

import {modalToggleReset} from 'redux/actions/general'
import {deleteClient,setEmp,deleteContact,getContact} from 'redux/actions/client'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        }
    } 
})
class confirm_delete extends Component {
    deleteRm=async()=>{
        let {client,modal_data}=this.props
        await client.selected_rm.splice(modal_data.index,1)
        // console.log('object', client)
    }
    deleteClient=async()=>{
        let {modal_data,token}=this.props
        let data={id:modal_data.id,userId:modal_data.userId}
        await this.props.modalToggleReset()
        this.props.deleteClient(token,data)
    }
    delete_client_contact=()=>{
        let {modal_data,token,profile,pipeline}=this.props
        const {employee}=this.props.client

        let new_data=employee.filter(data=>{
            return data.index!==modal_data.index
        })
        this.props.setEmp(new_data)
        this.props.modalToggleReset()

    }
    delete_contact_from_list= async ()=>{
        let {token,profile,modal_data}=this.props
        let {contact_filter}=this.props.client
        let fromMonth=contact_filter.periode.month>9?contact_filter.periode.month:`0${contact_filter.periode.month}`
        let res=await this.props.deleteContact(token,`/${modal_data.contact.clientId}/${modal_data.contact.id}/${profile.id}`)
        if(res){
            this.props.getContact(this.props.token,`/${contact_filter.periode.year}${fromMonth}/${contact_filter.industry.value}/1/5/*`)
        }
       
    }
    delete_rm_list=()=>{
        this.props.modal_data.modalAction()
        // this.props.modalToggleReset()

    }
    renderAction=()=>{
        let {modal_data,modal_action,profile,token}=this.props
        switch (modal_action) {
            case 'delete_rm':
               return this.deleteRm()
            case 'delete_client':
                return this.deleteClient()
            case 'delete_client_contact':
                return this.delete_client_contact()
            case 'delete_client_contact_from_list':
                return this.delete_contact_from_list()
            case 'delete_rm_list':
                return this.delete_rm_list()
            default:
                return this.props.modal_data.modalAction()
        }
        // case
    }
    render() {
        // console.log('this.props.modal_data', this.props.modal_data)
        let {modal_data,modal_title}=this.props
        return (
            <div className='confirm-container'>
                <h4>Delete {modal_data.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: modal_data.msg }}></div>
                {/* <p>Are you sure delete <b>{modal_data.title}</b></p> */}
                <div className='card-footer'>
                    <MuiThemeProvider theme={themeButton}>
                        <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='primary' className='btn-remove-capital'>No, back to {modal_title}</Button>
                        <Button onClick={()=>this.renderAction()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Yes</Button>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    client:state.client
})
const mapDispatchToProps={
    modalToggleReset,
    deleteClient,
    setEmp,
    getContact,
    deleteContact
}
export default connect(mapStateToProps,mapDispatchToProps)(confirm_delete)