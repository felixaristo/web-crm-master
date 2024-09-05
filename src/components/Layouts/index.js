import React,{useEffect} from 'react'
import './style.css'
import Navbar from 'components/Navbar'
import Sidebar from 'components/Sidebar'
import Modal from 'components/Modal'
import Cookie from 'universal-cookie'
import Loading from 'components/Loading'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Modal as Modal2} from '@material-ui/core'
import { isMobile } from 'react-device-detect'
import { useSelector,useDispatch } from 'react-redux'
import * as actionMaster from 'redux/actions/master'
import * as actionClient from 'redux/actions/client'
const cookie=new Cookie()

const token=cookie.get('login_cookie')
const profile=cookie.get('profile_cookie')
function Index(props) {
    let url=props.location.pathname
    const dispatch = useDispatch()
    const reducer = useSelector(reducer => reducer)
    useEffect(() => {
        dispatch(actionMaster.getMasterData())
        dispatch(actionClient.getClient(token))
        dispatch(actionMaster.getEmployee(token))
    }, [])
    return (
        <div>
             <Modal2
                        className='modal'
                        open={isMobile}
                        // onClose={modalToggle}
                        style={{magrin:'auto',width:'100%'}}
                    >
                        <div className='modal-content' style={{width:400,padding:10}}>
                        <p className='semi-bold'>This application is not compatible for mobile device, access CRM application from desktop (PC/Laptop) browser.</p>

                        </div>
                    </Modal2>
                <Navbar profile={profile}/>
                <Sidebar/>
                <Loading/>
                <div className={url!=='/deals'&&url!=='/invoices'||reducer.master.tab_active==='add_invoice'?'content-wrapper':'content-wrapper-pipeline'}>
                    <Modal token={token} profile={profile}/>
                    {props.children}
                </div>
        </div>
    )
}

export default withRouter(Index)