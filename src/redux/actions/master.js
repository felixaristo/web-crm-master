
import * as actionType from '../constants/master'
import {setLoading,setLoadingTable,modalToggle} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import { get } from "lodash";
import Cookie from 'universal-cookie'
const cookie=new Cookie()
const token=cookie.get('login_cookie')
export const getMasterData=()=>async dispatch=>{
    dispatch(setLoading(true))
        let dataReq={
            url:`/pipeline/master`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            let for_select=[]
            let rm_text=[]
            let rm_team=[]
            res.data.rms.map((data,i)=>{
                for_select.push({label:data.name,value:data.userId})
                rm_text.push({id:data.userId,text:data.name})
            })
            
            dispatch({
                type:actionType.GET_MASTER_DATA,
                payload:{
                    rm:for_select,
                    rm_full:res.data.rms,
                    segments:res.data.segments,
                    tribes:res.data.tribes,
                    branches:res.data.branches,
                    stages:res.data.stages,
                    proposalTypes:res.data.proposalTypes,
                    rm_text
                }
            })
        }else{
            dispatch(setLoading(false))

        }
}
export const getClient=(token,slug)=>async dispatch=>{
    // dispatch(setLoading(true))
        let dataReq={
            url:`/clients/search/${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            // dispatch(setLoading(false))
            let for_select=[]
            res.data.map((data,i)=>{
                for_select.push({label:data.text,value:data.id})
            })
            dispatch({
                type:actionType.GET_CLIENT_SEARCH,
                payload:for_select
            })
            return res.data
        }else{
            return res.data
            // dispatch(setLoading(false))

        }
}
export const getEmployee=(token,slug='*')=>async dispatch=>{
    dispatch(setLoading(true))
        let dataReq={
            url:`/user/list/employee/${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            let for_select=[]
            res.data.map((data,i)=>{
                for_select.push({label:data.text,value:data.id})
            })
            dispatch({
                type:actionType.GET_EMPLOYEE,
                payload:for_select
            })
        }else{
            dispatch(setLoading(false))

        }
}
export const getContact=(token,slug)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            let for_select=[]
            
            res.data.contacts.map((data,i)=>{
                for_select.push({text:data.name,id:data.id})
            })
            dispatch({
                type:actionType.GET_CONTACT,
                payload:for_select
            })
            dispatch({
                type:actionType.GET_DETAIL_CLIENT,
                payload:res.data
            })
            return res
        }else{
            dispatch(setLoading(false))

        }
    }
}
export const tabToggle=(key,back)=>dispatch=>{
    dispatch({
        type:actionType.SET_TAB,
        payload:{
            tab_active:key,
            tab_back:back
        }
    })
}

export const updateClient=(token,data)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/${data.id}`,
            method:'PUT',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            // dispatch(modalToggle({ 
            //     modal_open: true,
            //     modal_title: "Update client success",
            //     modal_component: "add_client",
            //     modal_size:400,
            //     modal_type:'alert',
            //     modal_data:{
            //         msg:`<p>Client <b>${data.company}</b> successfully updated</p> `,
            //         ...res.data
            //     },
            //     modal_action:'success',
            //     // success_msg:success_msg
            // }))
        }else{
            console.log('qwe',res)
            dispatch(setLoading(false))

        }
    }
}
export const updateClient2=(token,data)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/pipeline/client/${data.clientId}`,
            method:'PUT',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==204){
            dispatch(setLoading(false))
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Update client success",
                modal_component: "add_client",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Client successfully updated</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
        }else{
            console.log('qwe',res)
            dispatch(setLoading(false))

        }
    }
}