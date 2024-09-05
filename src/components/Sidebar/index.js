import React, { Component } from 'react'
import './style.css'
import handshake from 'assets/icon/handshake.svg'
import Users from 'assets/icon/Users.svg'
import User from 'assets/icon/User.png'
import Report from 'assets/icon/Report.svg'
import Invoice from 'assets/icon/Invoice.svg'
import LostDeal from 'assets/icon/Lost-deal.svg'
import Pipeline from 'assets/icon/Pipeline.svg'
import Userconfig from 'assets/icon/Userconfig.png'
import Cookie from 'universal-cookie'
const cookie=new Cookie()
const profile=cookie.get('profile_cookie')

export default function Index() {
    let sidebar=[
        {
            url:'/deals',
            title:'Pipeline',
            icon:Pipeline
        },
        {
            url:'/invoices',
            title:'Invoice',
            icon:Invoice
        },
        {
            url:'/lostdeal',
            title:'Lost Deal',
            icon:LostDeal
        },
        {
            url:'/salesreport',
            title:'Sales Report',
            icon:Report
        },
        {
            url:'/account',
            title:'Individual Sales Report',
            icon:Report
        },
        {
            url:'/rm',
            title:'Relationship Manager',
            icon:Users
        },
        
        {
            url:'/teamconfig',
            title:'Team Configuration',
            icon:Userconfig
        },
        {
            url:'/profile',
            title:'Profile',
            icon:User
        },
        {
            url:'/clients',
            title:'Client',
            icon:handshake
        },
    ]
    let hakAkses=()=>{
        let {roleId}=profile
        if(roleId===1){
            return [0,1,2,3,4,5,6,7,8]
        }else if(roleId===2){
            return [0,1,2,3,4,7,8]
        }else if(roleId===5){
            return [0,1,2,4,7,8]
        }else{
            return []
        }
    }
    console.log('profile', profile)
    return (
        <div className='sidebar-wrapper'>
            {hakAkses().map((d,i)=>(
                <a href={sidebar[d].url} key={i} style={{textDecoration:'none'}}>
                    <div className={window.location.pathname===sidebar[d].url?'active-sidebar':'list-sidebar'} >
                        <img src={sidebar[d].icon} className='icon-size'/>
                        &nbsp;&nbsp;
                        <a href={sidebar[d].url}>{sidebar[d].title}</a>
                    </div>
                </a>
            ))}
            {/* {sidebar.map((d,i)=>(
                <a href={d.url} key={i} style={{textDecoration:'none'}}>
                    <div className={window.location.pathname===d.url?'active-sidebar':'list-sidebar'} >
                        <img src={d.icon} className='icon-size'/>
                        &nbsp;&nbsp;
                        <a href={d.url}>{d.title}</a>
                    </div>
                </a>
            ))} */}
                {/* <div className={window.location.pathname==='/deals'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/deals')}>
                    <img src={Pipeline} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/deals'>Pipeline</a>
                </div>
                <div className={window.location.pathname==='/invoices'?'active-sidebar':'list-sidebar'}  onClick={()=>window.location.assign('/invoices')}>
                    <img src={Invoice} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/invoices'>Invoice</a>
                </div>
                <div className={window.location.pathname==='/lostdeal'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/lostdeal')}>
                    <img src={LostDeal} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/lostdeal'>Lost Deal</a>
                </div>
                <div className={window.location.pathname==='/salesreport'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/salesreport')}>
                    <img src={Report} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/salesreport'>Sales Report</a>
                </div>
                <div className={window.location.pathname==='/account'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/account')}>
                    <img src={Report} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/account'>Individual Sales Report</a>
                </div>
                {profile.roleId===1&&<div className={window.location.pathname==='/rm'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/rm')}>
                    <img src={Users} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/rm'>Relationship Manager</a>
                </div>}
                {profile.roleId===1&&<div className={window.location.pathname==='/teamconfig'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/teamconfig')}>
                    <img src={Userconfig} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/teamconfig'>Team Configuration</a>
                </div>}
                <div className={window.location.pathname==='/profile'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/profile')}>
                    <img src={User} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/profile'>Profile</a>
                </div>
                <div className={window.location.pathname==='/clients'?'active-sidebar':'list-sidebar'} onClick={()=>window.location.assign('/clients')}>
                    <img src={handshake} className='icon-size'/>
                    &nbsp;&nbsp;
                    <a href='/clients'>Client</a>
                </div> */}
                
            </div>
    )
}
