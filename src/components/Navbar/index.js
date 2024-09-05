import React, { Component } from 'react'
import './style.css'
import Logo from 'assets/image/logo_topbar.svg'
import {Input} from '@material-ui/core'
import Search from 'assets/icon/Search.svg'
import avadefault from 'assets/icon/avadefault.svg'
import {connect} from 'react-redux'
import {modalToggle} from 'redux/actions/general'
import { useDispatch } from 'react-redux'
export default function Index(props) {
    let {profile}=props
    const dispatch = useDispatch()
    const profileClick=()=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: ``,
            modal_component: "",
            modal_size:300,
            modal_type:'profile',
            modal_data:null,
            modal_action:'profile'
        }))
    }
    return (
        <div>
            <nav>
               <div className='hamburger' >
                   <div className='hamburger__list'/>
                   <div className='hamburger__list'/>
                   <div className='hamburger__list'/>
               </div>
               <div className='logo'>
                    <img src={Logo} />
                    <div className='vertical-line'></div>
                    <h4>Customer Relationship Management</h4>
               </div>
               {/* <div className='search hide-mobile'>
                   <img src={Search}/>
                   <Input 
                        disableUnderline 
                        className='search-field'
                        placeholder='Hi Rifky, mencari sesuatu? ketikkan berdasarkan keyword'
                    />
               </div> */}
               {/* <div style={{flex:1}}></div> */}
               <div className='profile hide-mobile'>
                   <img src={profile.profilePic?profile.profilePic:avadefault}  onClick={profileClick}/>
               </div>
           </nav>
        </div>
    )
}

