import React from 'react'
import '../style.css'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
import {Button } from '@material-ui/core'
import {useDispatch,useSelector} from 'react-redux'
import {modalToggleReset,modalToggle} from 'redux/actions/general'
import {getContact,getEmployee} from 'redux/actions/master'
import {setProposal} from 'redux/actions/pipeline'
import * as actionType from 'redux/constants/pipeline'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
        },
        secondary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',
        }
    } 
})
export default function Direct_proposal(props) {
    const dispatch = useDispatch()
    const master = useSelector(state => state.master)

    const addProposal=async ()=>{
        let {clientId,dealId}=props.modal_data
        let res=await dispatch(getContact(props.token,clientId))
        if(res){
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))
            }
            dispatch(setProposal({
                dealId:dealId
            }))
            dispatch({
                type:actionType.RESET_PROPOSAL
            })
            dispatch({
                type:actionType.SET_CLIENT_ID,
                payload:clientId
            })
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `Upload Proposal for ${res.data.client.company}`,
                modal_component: "proposal",
                modal_data:{clientId:clientId,dealId:dealId} ,
                modal_size:550,
                modal_action:'add_proposal',
                modal_type:'multi'
            }))
        }
    }
    return (
        <div>
            <div className='confirm-container'>
                <h3>Directly upload proposals?</h3>
                <p>You can upload a proposal at the same time in this step if you have a proposal and payment period information.</p>
                {/* <p>Are you sure delete <b>{modal_data.title}</b></p> */}
                <div className='card-footer'>
                    <MuiThemeProvider theme={themeButton}>
                        <Button onClick={()=>dispatch(modalToggleReset())}   size='small' color='secondary' className='btn-remove-capital' variant='text'>No, Later</Button>
                        <Button onClick={()=>addProposal()}   size='small' color='secondary' variant='contained' className='head-add-section__btn '>Yes I have proposal</Button>
                    </MuiThemeProvider>
                </div>
            </div>
        </div>
    )
}
