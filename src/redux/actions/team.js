import * as actionType from 'redux/constants/team'
import * as actionGeneral from './general'
import {apiCall} from 'service/apiCall'
import _ from "lodash";

import Cookie from 'universal-cookie'
const cookie=new Cookie()
const token=cookie.get('login_cookie')
const profile=cookie.get('profile_cookie')
export const setTeam=(obj)=>async dispatch=>{
    dispatch({
        type:actionType.SET_TEAM,
        payload:obj
    })
}
export const getTeam=()=>async(dispatch)=>{
    dispatch(actionGeneral.setLoadingTable(true))
    let dataReq={
        url:`/Pipeline/team`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},

        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(setTeam({list_team:res.data}))
       
        dispatch(actionGeneral.setLoadingTable(false))
        return res
    }else{
        dispatch(actionGeneral.setLoadingTable(false))

    }
}

export const postTeam=(data)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/team`,
        method:'POST',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
            data
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(getTeam())
        dispatch(actionGeneral.setLoading(false))
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Team Config",
            modal_component: "add_team",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Add Team successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}
export const putTeam=(data)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/team/${data.id}`,
        method:'PUT',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
            data
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(getTeam())
        dispatch(actionGeneral.setLoading(false))
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Team Config",
            modal_component: "put_team",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Update Team successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}

export const deleteTeam=(id)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/team/${id}/${profile.id}`,
        method:'DELETE',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(getTeam())
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Team Config",
            modal_component: "delete_team",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Delete Team successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        dispatch(actionGeneral.setLoading(false))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}