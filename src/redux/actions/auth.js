import {apiCall} from 'service/apiCall'
import {setLoading,setError,modalToggle} from './general'
import Cookie from 'universal-cookie'
import {get} from 'lodash'
import { URL, USER,PASS } from 'service/base_url'

const cookie=new Cookie()
export const login=(data)=>async dispatch=>{
    dispatch(setLoading(true))
        let dataReq={
            url:'/auth/login',
            method:'POST',
            data:{data:data,auth:{username:USER,password:PASS}}
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')===200){
            dispatch(setLoading(false))
            cookie.set('login_cookie',res.data.accessToken.token)
            cookie.set('refresh_cookie',res.data.refreshToken)  
            let profile={
                email:res.data.email,
                name:res.data.userName,
                id:res.data.id,
                tribeId:res.data.tribeId,
                segmentId:res.data.segmentId,
                branchId:res.data.branchId,
                roleId:res.data.roleId,
                profilePic:res.data.profilePic
            }
            cookie.set('profile_cookie',profile)  
            dispatch(setError(null))
            
            window.location.assign('/deals')
        }else{
            dispatch(setLoading(false))
            // return res
            // dispatch(setError('The Email or password is incorrect. Please try again '))
        }
}


export const refreshToken=(token,refreshtoken)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:'/auth/refreshtoken',
            method:'POST',
            data:{
                auth:{username:USER,password:PASS},
                data:{accessToken:token,refreshToken:refreshtoken}
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')===200){
            dispatch(setLoading(false))
            cookie.set('login_cookie',res.data.accessToken.token)
            cookie.set('refresh_cookie',res.data.refreshToken)  
            window.location.assign('/deals')
        }else{
            dispatch(setLoading(false))
            dispatch(logout())
            // console.log('d',res.data)
        }
    }
}
export const logout=()=>{
    cookie.remove('login_cookie')
    cookie.remove('refresh_cookie')
    cookie.remove('profile_cookie')
    window.location.assign('/')
}
export const changePassword=(token,data)=>{
    return async(dispatch)=>{
        dispatch(setLoading(true))
        let dataReq={
            url:'/Profile/changepassword',
            method:'PUT',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')===200){
            dispatch(setLoading(false))
            if(res.data.code==='old_password'){
                dispatch(setError(res.data.description))

            }else if(res.data.code==='new_password'){
                dispatch(setError(res.data.description))

            }else if(res.data.code==='ok'){
                dispatch(modalToggle({ 
                    modal_open: true,
                    modal_title: "Change password",
                    modal_component: "change_password",
                    modal_size:400,
                    modal_type:'alert',
                    modal_data:{
                        msg:`<p>${res.data.description}</p> `,
                        ...res.data
                    },
                    modal_action:'success',
                    // success_msg:success_msg
                }))
                // dispatch(alertToggle({ isOpen: true,button_title:'Close',title: "Change password" ,componentName: "alert_client",size:4,message:res.data.description }))
                // dispatch(setError(res.data.description))

            }
        }else{
            console.log('123')
            dispatch(setLoading(false))

        }
       
    }
}
