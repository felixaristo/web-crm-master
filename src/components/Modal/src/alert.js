import React, { Component } from 'react'
import Checklist from 'assets/icon/checklist.png'
import close from 'assets/icon/close.svg'
import Warning from 'assets/icon/Warning.svg'
import {connect} from 'react-redux'
import {modalToggleReset,modalToggle} from 'redux/actions/general'
import {tabToggle} from 'redux/actions/master'
// import {setAction} from 'redux/actions/event'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
import {Button } from '@material-ui/core'
import {getDetailDeal} from 'redux/actions/pipeline'
import {getContact,getEmployee} from 'redux/actions/master'
import {setTabInvoice} from 'redux/actions/invoices'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#00ACC1',
        },
        secondary: {
            main:'#FFB100',
            contrastText: '#FFFFFF',
        }
    } 
})
class alert extends Component {
    detailDeal=async (dealId,clientId)=>{
        let {master}=this.props
        if(master.contact.length>0&&master.employee.length>0){
            await this.props.tabToggle('detail',master.tab_back)
            this.props.modalToggleReset()
        }else{
            await this.props.getDetailDeal(this.props.token,dealId)
            await this.props.getContact(this.props.token,clientId)
            // await this.props.getEmployee(this.props.token)
            await this.props.tabToggle('detail',master.tab_back)
            this.props.modalToggleReset()
        }
        
        
    }
    toPipeline=async ()=>{
        await this.props.tabToggle('pipeline','pipeline')
        this.props.modalToggleReset()
    }
    goToInvoice=()=>{
        this.props.tabToggle('invoice')
        this.props.modalToggleReset()

    }
    renderFooter=()=>{
        const {modal_component,modal_data,success_msg}=this.props.general
        switch (modal_component) {
            case 'add_client':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>See detail client</Button>
                ) 
            case 'delete_client':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>See detail client</Button>
                )      
            case 'upload_client':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>See client list</Button>

                )
            case 'update_deals':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Close</Button>

                )
            case 'add_deals':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Close</Button>

                )
            case 'add_invoices':
                return(
                    <Button onClick={()=>this.goToInvoice()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Go to invoice</Button>

                )
            case 'see_detail_deal':
                return(
                    <Button onClick={()=>this.detailDeal(modal_data.dealId,modal_data.clientId)}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>See detail deal</Button>

                )
            case 'to_pipeline':
                return(
                    <Button onClick={()=>this.toPipeline()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Go to pipeline</Button>

                )
            case 'add_target':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Go to report sales</Button>

                )
            case 'on_authorize':
                return(
                    <Button onClick={()=>this.props.modalToggleReset()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Close</Button>

                )
            
            default:
                break;
        }
    }
    render() {
        const {modal_data,modal_title,modal_action}=this.props.general
        return (
            <div className='alert-container'>
                <img src={modal_action==='error'?close:modal_action==='on_authorize'?Warning:Checklist} style={{width:'40%'}}/>
                <br/>
                <h4>{modal_title}</h4>
                {/* <p>{modal_data.msg}</p> */}
                <div dangerouslySetInnerHTML={{ __html: modal_data.msg }}></div>
                <MuiThemeProvider theme={themeButton}>
                    {this.renderFooter()}
                </MuiThemeProvider>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    master:state.master
})
const mapDispatchToProps={
    modalToggleReset,
    modalToggle,
    tabToggle,
    getDetailDeal,getContact,getEmployee,
    setTabInvoice
    // setAction
}
export default connect(mapStateToProps,mapDispatchToProps)(alert)