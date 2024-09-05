import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal} from '@material-ui/core'
import './style.css'
import Close from 'assets/icon/close.svg'
import {modalToggleReset,modalToggle} from 'redux/actions/general'
import Alert from './src/alert'
import Profile from './src/profile'
import AddRm from './src/add_rm'
import Addcontact from './src/add_contact'
import Addcontactdeal from './src/add_contact_deal'
import FilterClient from './src/filter_client'
import AddDeal from './src/add_deal'
import AddInvoice from './src/add_invoice'
import SalesVisit from './src/sales_visit'
import SalesVisitWithoutDeal from './src/sales_visit_without_deal'
import Proposal from './src/proposal'
import PaymentPeriod from './src/payment_period'
import PaymentPeriodProject from './src/payment_period_project'
import PipelineFilter from './src/pipeline_filter'
import LostDealFilter from './src/lost_deal_filter'
import InvoicesFilter from './src/invoices_filter'
import OwnerDeal from './src/owner'
import Employee from './src/employee'
import TargetReport from './src/add_target_report'
import ConfirmDelete from 'components/Modal/src/confirm_delete'
import Confirm from './src/confirm'
import Report_filter from './src/report_filter'
import Report_filter2 from './src/report_filter2'
import Graph_filter from './src/graph_filter'

import ContactFilter from './src/contact_filter'

import DirectProposal from './src/direct_proposal'
import Add_target_individual from './src/add_target_individual'
import Filter_sales_visit from './src/filter_sales_visit'
import Filter_rm from './src/filter_rm'
import Team from './src/team'

import Update_Status from './src/update_status'
import Filter_sales_visit_mentor from './src/filter_sales_visit_mentor'
import Filter_individual_all from './src/filter_individual_all'
class index extends Component {
    renderBody=()=>{
        const {modal_data,modal_title,modal_component,modal_type,modal_action,modal_open,modal_size,modal_subtitle}=this.props.general
        const {token,profile}=this.props
        // console.log('modal_subtitle', modal_subtitle)
        switch (modal_type) {
            case 'confirm':
                return (
                    <>
                        {modal_component==='confirm_delete'&&<ConfirmDelete modal_title={modal_title} token={token} profile={profile} modal_data={modal_data} modal_action={modal_action}/>}
                        {modal_component==='confirm2'&&<Confirm modal_title={modal_title} token={token} profile={profile} modal_data={modal_data} modal_action={modal_action }/>}
                        {modal_component==='direct_proposal'&&<DirectProposal modal_title={modal_title} token={token} profile={profile} modal_data={modal_data} modal_action={modal_action }/>}
                    </>
                )
                break;
            
            case 'alert':
                return(
                    <Modal
                        className='modal'
                        open={modal_open}
                        onClose={this.props.modalToggleReset}
                    >
                        <div className='modal-content' style={{width:modal_size}}>

                        <Alert token={token} profile={profile} modal_data={modal_data}/>
                        </div>
                    </Modal>
                ) 
                
            case 'multi':
                // console.log('asdfsfd')
                return(
                    <>
                    {modal_component==='proposal'||modal_component==='payment_period'?
                    <Modal
                        className='modal'
                        open={modal_open}
                        // onClose={this.props.modalToggleReset}
                    >
                        <div className='modal-content' style={{width:550}}>
                                <div className='modal-header'>
                                        <h2>{modal_title}</h2>
                                        <img src={Close} style={{width:20}} onClick={this.props.modalToggleReset}/>
                                </div>
                                    {/* <hr className='modal-hr' size='1'/> */}
                                <div className='modal-body' >
                                <Proposal modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>
                                </div>

                        </div>
                    </Modal>
                    :null}
                    {modal_component==='payment_period'||modal_component==='payment_period'?
                     <Modal
                        className='modal'
                        open={modal_open}
                        // onClose={()=>
                        //     this.props.modalToggle({
                        //         modal_open: true,
                        //         modal_title: "Upload Proposal for Company Name",
                        //         modal_component: "proposal",
                        //         modal_data:{id:modal_data.id,id:modal_data.id,dealId:modal_data.dealId} ,
                        //         modal_size:550,
                        //         modal_action:'add_proposal',
                        //         modal_type:'multi'
                        //     })
                        //     // this.props.modalToggleReset
                        // }
                    >
                    <div className='modal-content' style={{width:modal_size}}>
                        <div className='modal-header'>
                                <h2>{modal_title}</h2>
                                <img src={Close} style={{width:20}} onClick={()=>
                                    // this.props.modalToggleReset
                                    this.props.modalToggle({
                                        modal_open: true,
                                        modal_title: "Upload Proposal for Company Name",
                                        modal_component: "proposal",
                                        modal_data:{id:modal_data.id,id:modal_data.id,dealId:modal_data.dealId} ,
                                        modal_size:550,
                                        modal_action:'add_proposal',
                                        modal_type:'multi'
                                    })
                                }/>
                        </div>
                            {/* <hr className='modal-hr' size='1'/> */}
                        <div className='modal-body' >
                            <PaymentPeriod modal_action={modal_action} modal_data={modal_data} token={token}/>
                        </div>
                    </div>
                    </Modal>
                    :null}
                    </>
                )
            default:
                return(
                        <>
                            <div className='modal-header'>
                                    <div>
                                    <h2 style={{marginBottom:modal_subtitle!==undefined?5:15}}>{modal_title}</h2>
                                    {modal_subtitle!==undefined&&<p className='semi-bold'>Deal name : {modal_subtitle}</p>}
                                    </div>
                                    <img src={Close} style={{width:20}} onClick={this.props.modalToggleReset}/>
                            </div>
                                {/* <hr className='modal-hr' size='1'/> */}
                            <div className={modal_component!=='pipeline_filter'&&modal_component!=='invoices_filter'&&modal_component!=='report_filter'&&modal_component!=='report_filter2'&&modal_component!=='graph_filter'&&modal_component!=='lostdeal_filter'&&modal_component!=='filter_sales_visit'&&modal_component!=='filter_sales_visit_mentor'&&modal_component!=='contact_filter'&&modal_component!=='filter_individual_all'?'modal-body':'modal-body-filter'} >
                                   {modal_component==='rm'&&<AddRm modal_action={modal_action} modal_data={modal_data}/>}
                                   {modal_component==='contact'&&<Addcontact modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='contact_deal'&&<Addcontactdeal modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='filter_client'&&<FilterClient modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {modal_component==='add_deal'&&<AddDeal modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='add_invoice'&&<AddInvoice modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='sales_visit'&&<SalesVisit modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='sales_visit_without_deal'&&<SalesVisitWithoutDeal modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='pipeline_filter'&&<PipelineFilter modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {modal_component==='lostdeal_filter'&&<LostDealFilter modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {modal_component==='invoices_filter'&&<InvoicesFilter modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {modal_component==='contact_filter'&&<ContactFilter modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {modal_component==='owner'&&<OwnerDeal modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='employee'&&<Employee modal_action={modal_action} modal_data={modal_data} token={token}/>}
                                   {/* {modal_component==='proposal'&&<Proposal modal_action={modal_action} modal_data={modal_data} token={token}/>} */}
                                   {modal_component==='payment_period_project'&&<PaymentPeriodProject modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='add_target_report'&&<TargetReport modal_title={modal_title} modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='report_filter'&&<Report_filter modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='report_filter2'&&<Report_filter2 modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='graph_filter'&&<Graph_filter modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='target_individual'&&<Add_target_individual modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='filter_sales_visit'&&<Filter_sales_visit modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='filter_sales_visit_mentor'&&<Filter_sales_visit_mentor modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='filter_individual_all'&&<Filter_individual_all modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='filter_rm'&&<Filter_rm modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='team'&&<Team modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                                   {modal_component==='update_status'&&<Update_Status modal_action={modal_action} modal_data={modal_data} token={token} profile={profile}/>}
                            </div>
                        </>
                )
                break;
        }
    }
    render() {
        const {modal_open,modal_data,modal_title,modal_component,modal_size,modal_type,modal_action}=this.props.general
        const {token,profile}=this.props
        return (
            <div>
                {modal_type!=='profile'?
                modal_type!=='multi'?
                <Modal
                    className='modal'
                    open={modal_open}
                    // onClose={this.props.modalToggleReset}
                >
                   <div className='modal-content' style={{width:modal_size}}>
                        {this.renderBody()}
                   </div>
                </Modal>
                :
                <Modal
                    className='modal'
                    open={modal_open}
                    // onClose={this.props.modalToggleReset}
                >
                <div className='modal-content' style={{width:modal_size}}>
                        {this.renderBody()}
                </div>
                </Modal>
                :
                <Modal
                    className='modal-profile'
                    open={modal_open}
                    onClose={this.props.modalToggleReset}
                >
                    
                   <div className='modal-content' style={{width:modal_size}}>
                        <Profile modalToggleReset={this.props.modalToggleReset} token={token} profile={profile}/>
                   </div>
                </Modal>
                }
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return{
        general:state.general
    }
}
const mapDispatchToProp={
    modalToggleReset,modalToggle
}
export default connect(mapStateToProps,mapDispatchToProp)(index)