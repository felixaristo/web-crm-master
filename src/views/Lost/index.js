import React,{useState, useEffect} from 'react'
import Layout from 'components/Layouts'
import Client from './client' 

import Detail from './detail' 
import LostDeal from './lost'
import './style.css'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import {getMasterData,tabToggle,getEmployee} from 'redux/actions/master'
import { useDispatch, useSelector } from "react-redux";

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#cccccc',
            // contrastText: '#FFFFFF',
            contrastText: '#777777',
        }
    } 
})
export default function Index(props) {
    // const [tab_active, setTabActive] = useState('pipeline')
    const master=useSelector(state=>state.master)
    const {tab_active}=master
    const dispatch=useDispatch()
    
    const tabsToggle=(key,back)=>{
        dispatch(tabToggle(key,back))
    }
    // console.log('props.token', props.token)

    return (
        <div>
            <Layout>
                <MuiThemeProvider theme={themeButton}>
                    {tab_active==='lost_deal'&&<LostDeal token={props.token} profile={props.profile} tabToggle={tabsToggle}/>}
                    {tab_active==='detail'&&<Detail token={props.token} profile={props.profile} tabToggle={tabsToggle}/>}
                    {tab_active==='client'&&<Client token={props.token} profile={props.profile} tabToggle={tabsToggle}/>}
                </MuiThemeProvider>
            </Layout>
        </div>
    )
}
