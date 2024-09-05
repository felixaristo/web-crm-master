import * as actionType from '../constants/client'
import {setLoading,setLoadingTable,modalToggle,setLoadingTable2} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import { get } from "lodash";
// import {setError} from './alert'
import XLSX from 'xlsx';
export const setRm=(rm)=>dispatch=>{
    dispatch({
        type:actionType.SET_RM,
        payload:rm
    })
}
export const setEmp=(emp)=>dispatch=>{
    dispatch({
        type:actionType.SET_EMP,
        payload:emp
    })
}
export const setName=(emp)=>dispatch=>{
    dispatch({
        type:actionType.SET_NAME,
        payload:emp
    })
}
export const setIndustry=(emp)=>dispatch=>{
    
    dispatch({
        type:actionType.SET_INDUSTRY,
        payload:emp
    })
}
export const setPhoneNo=(emp)=>dispatch=>{
    
    dispatch({
        type:actionType.SET_PHONE_NO,
        payload:emp
    })
}
export const setAddres1=(emp)=>dispatch=>{
    dispatch({
        type:actionType.SET_ADDRESS1,
        payload:emp
    })
}
export const setAddres2=(emp)=>dispatch=>{
    dispatch({
        type:actionType.SET_ADDRESS2,
        payload:emp
    })
}
export const setAddres3=(emp)=>dispatch=>{
    
    dispatch({
        type:actionType.SET_ADDRESS3,
        payload:emp
    })
}
export const setFax=(emp)=>dispatch=>{
    
    dispatch({
        type:actionType.SET_FAX,
        payload:emp
    })
}
export const setWebsite=(emp)=>dispatch=>{
    
    
    dispatch({
        type:actionType.SET_WESITE,
        payload:emp
    })
}
export const setRemarks=(emp)=>dispatch=>{
    
    dispatch({
        type:actionType.SET_REMARKS,
        payload:emp
    })
}
export const setListRm=(payload)=>dispatch=>{
    dispatch({
        type:actionType.GET_RM,
        payload:payload
    })
}
export const setSearch=(payload)=>dispatch=>{
    dispatch({
        type:actionType.SET_SEARCH,
        payload:payload
    })
}
export const setSearch2=(payload)=>dispatch=>{
    dispatch({
        type:actionType.SET_SEARCH2,
        payload:payload
    })
}
export const setClientAction=(payload)=>dispatch=>{
    dispatch({
        type:actionType.CLIENT_ACTION,
        payload:payload
    })
}
export const setClientFilter=(payload)=>dispatch=>{
    console.log('payload', payload)
    dispatch({
        type:actionType.CLIENT_FILTER,
        payload:payload
    })
}
export const setContactFilter=(payload)=>dispatch=>{
    dispatch({
        type:actionType.SET_FILTER_CONTACT,
        payload:payload
    })
}
export const clearState=()=>dispatch=>{
    dispatch({
        type:actionType.CLEAR_STATE,
    })
}
export const getRm=(token,slug='/0/0/0/1/10/*')=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/list${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
                const {data}=res
                let new_industries=[]
                let new_segments=[]
                let branch=[]
                data.industries.map((data)=>{
                    new_industries.push({label:data.industry,value:data.id})
                })
                data.segments.map((data)=>{
                    new_segments.push({label:data.segment,value:data.id})
                })
               
                dispatch(setListRm(data.relManagers))
                dispatch({
                    type:actionType.GET_INDUSTRY,
                    payload:new_industries
                })
                dispatch({
                    type:actionType.GET_SEGMENT,
                    payload:new_segments
                })
                
            }else{
                dispatch(setLoading(false))
                // dispatch(setError('terjadi kesalahan, isi field dengan benar'))
                // console.log('d',res.data)
            }
    }
}
export const getClient=(token,slug='/0/0/0/1/10/*')=>{
    return async dispatch=>{
        dispatch(setLoadingTable(true))
        let dataReq={
            url:`/clients/list${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
        dispatch(setLoadingTable(false))
            const {data}=res
            let new_industries=[]
            let new_segments=[]
            let rm_filter=[]
            let new_branch=[]
            data.industries.map((data)=>{
                new_industries.push({label:data.industry,value:data.id})
            })
            data.segments.map((data)=>{
                new_segments.push({label:data.segment,value:data.id})
            })
            data.relManagers.map((data)=>{
                rm_filter.push({label:data.name,value:data.id})
            })
            
            dispatch({
                type:actionType.SET_CLIENT,
                payload:data.clients
            })
            dispatch({
                type:actionType.GET_RM,
                payload:data.relManagers
            })
            dispatch({
                type:actionType.GET_INDUSTRY,
                payload:new_industries
            })
            dispatch({
                type:actionType.GET_RM_FILTER,
                payload:rm_filter
            })
            dispatch({
                type:actionType.GET_SEGMENT,
                payload:new_segments
            })
            dispatch({
                type:actionType.SET_PAGINATION,
                payload:data.info
            })
            return res
        }else{
            dispatch(setLoadingTable(false))
            return res
            // dispatch(setError('terjadi kesalahan, isi field dengan benar'))
            // console.log('d',res.data)
        }
    }
}
export const addClient=(token,data)=>{
    
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients`,
            method:'POST',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Add client success",
                modal_component: "add_client",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Add client  successfully</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
            dispatch(setClientAction('edit_client'))
            dispatch({
                type:actionType.SET_ID,
                payload:res.data.client.id
            })
        }else if(get(res,'status')===400){
            dispatch(setLoading(false))
            
        }else{
            dispatch(setLoading(false))

        }
    }
}
export const detailClient=(token,slug)=>{
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
            const {data}=res
            let new_contact=[]
            data.contacts.map((cont,i)=>{
                new_contact.push({index:i,...cont})
            })
            // console.log('data.client', data.client)
            dispatch({
                type:actionType.SET_ID,
                payload:data.client.id
            })
            dispatch({
                type:actionType.SET_EMP,
                payload:new_contact
            })
            dispatch({
                type:actionType.GET_DETAIL_CLIENT,
                payload:data.client
            })
            const {client}=data
            dispatch(setName(client.company))
            dispatch(setAddres1(client.address1))
            dispatch(setAddres2(client.address2))
            dispatch(setAddres3(client.address3))
            dispatch(setFax(client.fax))
            dispatch(setRemarks(client.remarks))
            dispatch(setWebsite(client.website))

            dispatch(setPhoneNo(client.phone))
            dispatch(setIndustry(client.crmIndustryId))
            dispatch(setRm(data.relManagers))
            return res
        }else{
            console.log('qwe',res)
            dispatch(setLoading(false))

        }
    }
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
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Update client success",
                modal_component: "add_client",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Client <b>${data.company}</b> successfully updated</p> `,
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
export const deleteClient=(token,data)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/${data.id}/${data.userId}`,
            method:'DELETE',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            dispatch(getClient(token,'/0/0/0/1/10/*'))
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Client Deleted",
                modal_component: "delete_client",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Client <b>${res.data.company}</b> successfully deleted in our system</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
        }else{
            dispatch(setLoading(false))


        }
    }
}

export const uploadCsv=(token,data)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/Upload/csv`,
            method:'POST',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`,'Content-Type': 'multipart/form-data'},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        console.log('asdf',res)
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            if(res.data.code==='invalid'||res.data.code==='extension'){
                // dispatch(setError(res.data.description))
                dispatch(modalToggle({ 
                    modal_open: true,
                    modal_title: "",
                    modal_component: "",
                    modal_size:400,
                    modal_type:'alert',
                    modal_data:{
                        msg:`<p>${res.data.description}</p>`
                    },
                    modal_action:'error'
                }))
            }else{
                console.log('berhasil')
                dispatch(getClient(token))
                // dispatch(alertToggle({ isOpen: true,button_title:'See client list',title: "Upload file ",componentName: "alert_client",size:4,message:"Upload file success" }))
                dispatch(modalToggle({ 
                    modal_open: true,
                    modal_title: "Upload file",
                    modal_component: "upload_client",
                    modal_size:400,
                    modal_type:'alert',
                    modal_data:{
                        msg:`<p>Upload file success</p> `,
                        ...res.data
                    },
                    modal_action:'success',
                    // success_msg:success_msg
                }))
            }
            // window.location.reload()
        }else{
            dispatch(setLoading(false))
            // alert('error upload')
        }
    }
}
export const getContact=(token,slug)=>{
    return async dispatch=>{
        dispatch(setLoadingTable2(true))
        let dataReq={
            url:`/clients/contact${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoadingTable2(false))
            dispatch({
                type:actionType.GET_CONTACT,
                payload:{
                    contact:res.data.contacts,
                    contact_pagination:res.data.info
                }
            })
            return res
        }else{
            dispatch(setLoadingTable2(false))
            // alert('error upload')
        }
    }
}

export const exportContact=(token,slug)=>{
    return async dispatch=>{
        dispatch(setLoadingTable2(true))
        let dataReq={
            url:`/clients/contact/exportjson${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`,'Content-Disposition': 'attachment'},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoadingTable2(false))
            const borders = {
                top: { style: "medium" },
                bottom: { style: "medium" },
                left: { style: "medium" },
                right: { style: "medium" }
              }
              const alignment = {
                horizontal: "center"
              }  
            let data_export=[{
                    columns:[{title:"INFO",style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"COMPANY",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"EXECUTIVE",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"TITLE",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"Department",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"ADDRRESS 1",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"ADDRRESS 2",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"ADDRRESS 3",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"HP",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"HP 1",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"HP 2",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"PHONE",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"FAX",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"E-MAIL 1",style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"E-MAIL 2",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"E-MAIL 3",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"E-MAIL 4",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"WEBSITE",width: {wpx: 150},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"INDUSTRY",width: {wpx: 130},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }},{title:"BIDANG USAHA",width: {wpx: 200},style: { fill: {patternType: "solid", fgColor: {rgb: "b3b3b3"}},alignment: alignment, border: borders, font: { sz:"14" } }}],
                    data:[]
            }]
            
            // res.data.headers.map((data)=>{
            //     data_export[0].columns.push({title:data,width: {wpx: 200}})
            // })
            res.data.items.map((data)=>{
                data_export[0].data.push([{value:data.info!==null?data.info:'',style: { alignment: alignment, border: borders }},{value:data.company!==null?data.company:'',style: { border: borders }},{value:data.executive!==null?data.executive:'',style: { border: borders }},{value:data.title!==null?data.title:'',style: { border: borders }},{value:data.department!==null?data.department:'',style: { border: borders }},{value:data.address1!==null?data.address1:'',style: { border: borders }},{value:data.address2!==null?data.address2:'',style: { border: borders }},{value:data.address3!==null?data.address3:'',style: { border: borders }},{value:data.hp!==null?data.hp:'',style: { border: borders }},{value:data.hP1!==null?data.hP1:'',style: { border: borders }},{value:data.hP2!==null?data.hP2:'',style: { border: borders }},{value:data.phone!==null?data.phone:'',style: { border: borders }},{value:data.fax!==null?data.fax:'',style: { border: borders }},{value:data.email1!==null?data.email1:'',style: { border: borders }},{value:data.email2!==null?data.email2:'',style: { border: borders }},{value:data.email3!==null?data.email3:'',style: { border: borders }},{value:data.email4!==null?data.email4:'',style: { border: borders }},{value:data.website!==null?data.website:'',style: { border: borders }},{value:data.industry!==null?data.industry:'',style: { border: borders }},{value:data.remarks!==null?data.remarks:'',style: { border: borders }}])
            })
            console.log('data_export', data_export)
            dispatch({
                type:actionType.GET_DATA_EXPORT,
                payload:data_export
            })
            return res
        }else{
            dispatch(setLoadingTable2(false))
            // alert('error upload')
        }
    }
}
export const deleteContact=(token,slug)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/contact${slug}`,
            method:'DELETE',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            dispatch(setLoading(false))
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Delete contact",
                modal_component: "add_deals",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Delete client contact successfully</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
            return res
        }else{
            dispatch(setLoading(false))
            // alert('error upload')
        }
    }
}
export const updateContact=(token,data,profileId)=>{
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/clients/contact/${data.id}/${data.clientId}/${profileId}`,
            method:'PUT',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')===200){
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Update contact",
                modal_component: "add_deals",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>Update client contact successfully</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
            dispatch(setLoading(false))
            
            // alert('asdf')
        }else{
            dispatch(setLoading(false))
            // alert('error upload')
        }
    }
}