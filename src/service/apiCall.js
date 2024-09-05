import axios from "axios";
// import { get } from "lodash";
import { URL, USER,PASS } from './base_url'
import {logout,refreshToken} from '../redux/actions/auth'
import Cookie from 'universal-cookie'
import { setError ,modalToggle} from "redux/actions/general";
const cookie=new Cookie()
let contentType = { "Content-Type": "application/json", 'X-Requested-With': 'XMLHttpRequest' }



export const apiCall=({method,url,data='',let404})=>async(dispatch)=>{
    // let head = !isEmpty(data.headers) ? defaultHeader({ Authorization: `Bearer ${data.headers}` }) : contentType
    // let login_url=url==='/auth/login'?{username:USER,password:PASS}:''
    try{
        const response=await axios({
            method:method,
            url:URL+url,
            data:data.data||"",
            auth:data.auth,
            headers:data.headers,
            
            // timeout:20000
        })
        return response
    }catch(error){
        let response=error.response
        if(response!==undefined){
            if(error.response.status===401){
                let refresh=cookie.get('refresh_cookie')
                let token=cookie.get('login_cookie')
                if(response.data!==''){
                    // alert('hello')
                    // console.log('hello',response)
                    dispatch(setError(response.data))
                   
                }else{
                    dispatch(refreshToken(token,refresh))
                }
                // if()
            }else if(error.response.status===400){
                dispatch(modalToggle({ 
                    modal_open: true,
                    modal_title: "",
                    modal_component: "",
                    modal_size:400,
                    modal_type:'alert',
                    modal_data:{
                        msg:'<p>Opps, An error occurred,input field correctly or please contact Support team 🙏</p>'
                    },
                    modal_action:'error'
                }))
                return error
                // alert('else')
                // dispatch(logout())
            }else{
                // dispatch(logout())
                if(!let404){
                    dispatch(modalToggle({ 
                        modal_open: true,
                        modal_title: "",
                        modal_component: "",
                        modal_size:400,
                        modal_type:'alert',
                        modal_data:{
                            msg:'<p>Opps, An error occurred,check your connection or please contact Support team 🙏</p>'
                        },
                        modal_action:'error'
                    }))
                }
                
            }
        }else{
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "",
                modal_component: "",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:'<p>Opps, An error occurred,check your connection or please contact Support team 🙏</p>'
                },
                modal_action:'error'
            }))
            // dispatch(setError([{description:'Opps, An error occurred,check your connection or please contact Support team 🙏'}]))
        }
        // console.log('asdf',error.response.status)
        return error
    }
}