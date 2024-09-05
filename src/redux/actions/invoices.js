import * as actionType from '../constants/invoices'
import {setLoading,setLoadingTable,modalToggle} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import {getDetailDeal} from './pipeline'
import { get,isEmpty } from "lodash";
import moment from 'moment'
export const setFilter=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_FILTER,
        payload:data
    })
}
export const setTabInvoice=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_TAB_INVOICE,
        payload:data
    })
}
export const setInvoiceAction=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_INVOICE_ACTION,
        payload:data
    })
}

export const getInvoice=(token,slug='0/0/0/0/1',key)=>async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoice/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let invoice={}
        let {data}=res
        let cards_hihi={}
        res.data.stages.map((data)=>{
            cards_hihi={
                ...cards_hihi,
                [data.stage]:{
                    id:data.month,
                    title:`${data.text} ${data.year}`,
                    invoicesId:[],
                    stage_id:data.stage,
                    year:data.year,
                    month:data.month,
                    total_pv:0
                }
            }
        })
        
        let cards={
            [data.stages[0].stage]:{
                id:data.stages[0].stage,
                card_probability:10,
                title:`${data.stages[0].text} ${data.stages[0].year}`,
                invoicesId:[],
                stage_id:data.stages[0].stage,
                year:data.stages[0].year,
                month:data.stages[0].month,
                total_pv:0

            },
            [data.stages[1].stage]:{
                id:data.stages[1].stage,
                card_probability:20,
                title:`${data.stages[1].text} ${data.stages[1].year}`,
                invoicesId:[],
                stage_id:data.stages[1].stage,
                year:data.stages[1].year,
                month:data.stages[1].month,
                total_pv:0
            },
            [data.stages[2].stage]:{
                id:data.stages[2].stage,
                card_probability:30,
                title:`${data.stages[2].text} ${data.stages[2].year}`,
                invoicesId:[],
                stage_id:data.stages[2].stage,
                year:data.stages[2].year,
                month:data.stages[2].month,
                total_pv:0
            },
            [data.stages[3].stage]:{
                id:data.stages[3].stage,
                card_probability:50,
                title:`${data.stages[3].text} ${data.stages[3].year}`,
                invoicesId:[],
                stage_id:data.stages[3].stage,
                year:data.stages[3].year,
                month:data.stages[3].month,
                total_pv:0
            },
            [data.stages[4].stage]:{
                id:data.stages[4].stage,
                card_probability:10,
                title:`${data.stages[4].text} ${data.stages[4].year}`,
                invoicesId:[],
                stage_id:data.stages[4].stage,
                year:data.stages[4].year,
                month:data.stages[4].month,
                total_pv:0
            },
        }
        let cardInvoiceOrder=[]
        data.stages.map((data)=>{
            cardInvoiceOrder.push(data.stage)
        })
        
        let all_total_pv=0
        data.invoice.map((data,i)=>{
            cards[data.stage]={
                ...cards[data.stage],
                invoicesId:[...cards[data.stage].invoicesId,`${data.invoiceId}`],
                total_pv:cards[data.stage]+data.amount
            }
            
            invoice[`${data.invoiceId}`]={
                id:`${data.invoiceId}`,
                invoiceId:data.invoiceId,
                title:data.dealName,
                client:{
                    label:data.client.text,
                    value:data.client.id
                },
                deal:{
                    text:data.dealName,
                    id:data.dealId
                },
                // age:data.age,
                // dealDate:data.dealDate,
                // clientName:data.clientName,
                // clientId:data.clientId,
                // probability:data.probability,
                invoiceDate:data.invoiceDate,
                value:data.amount,
                remarks:data.remarks,
                year:data.year,
                month:data.month,
                stage:data.stage,
                rms:data.rms,
                tribes:data.tribes,
                filename:data.filename,
                contact:data.contact,
                branch:data.branch,
                access:data.access,
                rms:data.rms,
                pic:data.pic
                // dealId:data.dealId
            }
            // total_pv=data.proposalValue+total_pv
            all_total_pv=data.amount+all_total_pv
            // console.log('all_total_pv', all_total_pv)
            
        })
        // console.log('cards', cards,invoice)
        if(key==='to_beinvoice'){
            dispatch({
                type:actionType.GET_TOBE_INVOICE,
                payload:{
                    card_tobe_invoiced:cards,
                    tobe_invoiced:invoice,
                    cardTobeInvoicedOrder:cardInvoiceOrder,
                    total_value:all_total_pv
                }
            })
        }else{
            dispatch({
                type:actionType.GET_INVOICED,
                payload:{
                    card_invoiced:cards,
                    invoiced:invoice,
                    cardInvoicedOrder:cardInvoiceOrder,
                    total_value:all_total_pv

                }
            })

        }
        const alignment = {
            horizontal: "left"
        }  
        let data_export=[{
            columns:[
                {title:'No'},
                {title:'Bulan'},
                {title:'Tahun'},
                {title:'Client'},
                {title:'Program'},
                {title:'RM'},
                {title:'Tribe'},
                {title:'Branch'},
                {title:'Segment'},
                {title:'Invoiced'},
                {title:'To be invoiced'},
                {title:'Total'},
                {title:'Remarks'},
            ],
            data:[]
        }]
        // const renderEmpty=(value)=>{
        //     if(value!==)
        // }
        console.log(`key`, key)
        res.data.invoice.map((data,i)=>{
            let new_rm=[]
            let new_tribe=[]
            data.rms.map((dat)=>{
                new_rm.push(dat.text)
            })
            data.tribes.map((dat)=>{
                new_tribe.push(dat.text)
            })
            var nf = new Intl.NumberFormat();
            let list_month=['January','February','March','April','May','June','July','August','September','October','November','December']
            data_export[0].data.push([
                { value:i+1,style:{alignment:alignment}},
                {value:list_month[data.month-1],style:{alignment:alignment}},
                {value:moment(data.invoiceDate).year(),style:{alignment:alignment}},
                {value:data.client.text,style:{alignment:alignment}},
                {value:data.dealName,style:{alignment:alignment}},
                {value:new_rm.join(),style:{alignment:alignment}},
                {value:new_tribe.join(),style:{alignment:alignment}},
                {value:data.branch.text,style:{alignment:alignment}},
                {value:data.segment.text,style:{alignment:alignment}},
                {value:key==='invoiced'?data.amount:0,style:{alignment:alignment}},
                {value:key==='to_beinvoice'?data.amount:0,style:{alignment:alignment}},
                {value:data.amount,style:{alignment:alignment}},
                {value:data.remarks!==null?data.remarks:'',style:{alignment:alignment}},
            ])
        })
        dispatch({
            type:actionType.TO_EXCEL,
            payload:data_export
        })
        dispatch(setLoading(false))
        return res
    }else{
        dispatch(setLoading(false))
    }
}

export const getDeals=(token,slug)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/deal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch({
            type:actionType.GET_DEALS,
            payload:res.data
        })
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }
}
export const postToBeInvoice=(token,data,url_get)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/tobeinvoiced`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(getInvoice(token,url_get,'to_beinvoice'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully Add Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>added new Invoice information  <b></b> </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}
export const postToInvoice=(token,data,url_get)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoice`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(getInvoice(token,url_get,'invoiced'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully Update Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>success update Invoice information  <b></b> </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}
export const addInvoice=(token,data,url_get)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoicenodeal`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // dispatch(getInvoice(token,url_get,'invoiced'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Invoice successfully created",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Create invoice for <b>${data.dealName}</b> in <b>${moment(res.data.invoiceDate).format('D MMMM YYYY')}</b></p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}
export const putToBeInvoice=(token,data,url_get)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/tobeinvoiced/${data.id}`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(getInvoice(token,url_get,'to_beinvoice'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully Update Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>success update Invoice information  <b></b> </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}
export const putInvoice=(token,data,url_get)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoice`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // dispatch(getInvoice(token,url_get,'to_beinvoice'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully Update Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>success update Invoice information  <b></b> </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}
export const deleteInvoice=(token,slug,url_get,key)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoice${slug}`,
        method:'DELETE',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(getInvoice(token,url_get,key))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully Delete Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>success delete Invoice information  <b></b> </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}

export const postAgreement=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/pricing/upload`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`,'Content-Type': 'multipart/form-data'},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){

        // await dispatch(getPipeline(token))
        await dispatch(getDetailDeal(token,res.data.dealId))
        dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Agreement success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Agreement successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}

export const cancelInvoice=(slug,token)=> async (dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/invoice/cancel${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // dispatch(getInvoice(token,url_get,'invoiced'))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Successfully move Invoice",
            modal_component: "add_invoices",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>success move Invoice to Tobe Invoice </p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))
        return res
        // console.log('res.data', res.data)
    }else{
        dispatch(setLoading(false))
    }
}