import React, { Component } from 'react'
import '../style.css'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
import {Button } from '@material-ui/core'
import {connect} from 'react-redux'

import {modalToggleReset} from 'redux/actions/general'
import {deleteClient,setEmp} from 'redux/actions/client'
import {deleteInvoice} from 'redux/actions/invoices'
import {
    wonDeal,
    lostDeal,
    deleteDeal,
    reopenDeal
} from 'redux/actions/pipeline'
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
const themeButton2 = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',

        },
        secondary: {
            
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        }
    } 
})
const themeButton3 = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#3B99EB',
            contrastText: '#FFFFFF',

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
    wonDeal=async()=>{
        let {modal_data,token,profile}=this.props
        let {tribe,probability,segment,rm,textPeriode,periode}=this.props.pipeline.filter
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        await this.props.modalToggleReset()
        let data={
            userId:profile.id,
            dealId:modal_data.dealId
        }
        this.props.wonDeal(token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`)
    }
    deleteDeal=async()=>{
        let {tribe,probability,segment,rm,textPeriode,periode}=this.props.pipeline.filter
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        let {modal_data,token,profile}=this.props
        let data={
            userId:profile.id,
            dealId:modal_data.dealId
        }
        await this.props.modalToggleReset()
        this.props.deleteDeal(token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`)

    }
    lostDeal=async()=>{
        let {modal_data,token,profile}=this.props
        let {tribe,probability,segment,rm,textPeriode,periode}=this.props.pipeline.filter
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        let data={
            userId:profile.id,
            dealId:modal_data.dealId
        }
        await this.props.modalToggleReset()
        this.props.lostDeal(token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`)

    }
    
    reopenDeals=async()=>{
        let {modal_data,token,profile}=this.props
        let {tribe,probability,segment,rm,textPeriode,periode}=this.props.pipeline.filter
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        let data={
            userId:profile.id,
            dealId:modal_data.dealId
        }
        await this.props.modalToggleReset()
        this.props.reopenDeal(token,data,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`)

    }
    delete_invoice=()=>{
        let {modal_data,token,profile,pipeline}=this.props
        let {tribe,segment,rm,probability,periode,textPeriode}=pipeline.filter
        this.props.deleteInvoice(token,`/${modal_data.invoicesId}/${profile.id}`,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${modal_data.tab==='to_beinvoice'?1:0}`,modal_data.tab)
    }
    
    renderAction=()=>{
        let {modal_data,modal_action,profile,token,pipeline}=this.props
        switch (modal_action) {
            case 'delete_rm':
               return this.deleteRm()
            case 'delete_client':
                return this.deleteClient()
            case 'won_deal':
                return this.wonDeal()
            case 'delete_deal':
                return this.deleteDeal()
            case 'lost_deal':
                return this.lostDeal()
            case 'reopen_deal':
                return this.reopenDeals()
            case 'delete_invoice':
                return this.delete_invoice()
           
            default:
                return modal_data.modalAction()
                break;
        }
    }
    
    render() {
        let {modal_data,modal_title,modal_action}=this.props
        console.log('modal_action', modal_action)

        return (
            <div className='confirm-container'>
                <h3>{modal_title}</h3>
                <div dangerouslySetInnerHTML={{ __html: modal_data.msg }}></div>
                <div className='card-footer'>
                    {modal_action==='won'}
                    <MuiThemeProvider theme={modal_action==='won_deal'||modal_action==='reopen_deal'||modal_action==='to_invoice'?themeButton2:modal_action==='lost_deal'?themeButton3:themeButton}>
                        <Button onClick={()=>modal_data.cancelAction?modal_data.cancelAction():this.props.modalToggleReset()}   size='small' color='primary' className='btn-remove-capital'>{modal_data.title_cancel}</Button>
                        <Button onClick={()=>this.renderAction()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>{modal_data.title_yes}</Button>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    client:state.client,
    pipeline:state.pipeline,
})
const mapDispatchToProps={
    modalToggleReset,
    deleteClient,
    wonDeal,
    lostDeal,
    deleteDeal,
    reopenDeal,
    deleteInvoice,
    setEmp
}
export default connect(mapStateToProps,mapDispatchToProps)(confirm_delete)