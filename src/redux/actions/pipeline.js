
import * as actionType from '../constants/pipeline'
import {setLoading,setLoadingTable,modalToggle} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import { get,isEmpty } from "lodash";
import moment from 'moment'
import { act } from 'react-dom/test-utils';
export const setFilter=(data)=>dispatch=>{
    // console.log('data set filter', data)
    dispatch({
        type:actionType.SET_FILTER,
        payload:data
    })
}
export const setDetailDeal=(data)=>dispatch=>{
    
    dispatch({
        type:actionType.GET_DETAIL_DEAL,
        payload:data
    })
}
export const setProposal=(data)=>dispatch=>{
    // console.log('data set PROOSAL', data)
    dispatch({
        type:actionType.SET_PROPOSAL,
        payload:data
    })
}
export const setSalesVisit=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_SALES_VISIT,
        payload:data
    })
}

export const setDeals=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_DEALS,
        payload:data
    })
}
export const setCards=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_CARDS,
        payload:data
    })
}
export const setCardsProjection=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_CARDS_PROJECTION,
        payload:data
    })
}
export const setCardOrder=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_CARD_ORDER,
        payload:data
    })
}

export const getPipeline=(token,slug='0/0/0/0')=>async(dispatch)=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/pipeline/${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            let deals={}
            let cards={
                'lead-in':{
                    id:'lead-in',
                    card_probability:10,
                    title:'Lead in',
                    dealsId:[],
                    stage_id:1
                },
                'proposal-development':{
                    card_probability:20,
                    id:'proposal-development',
                    title:'Proposal Development',
                    dealsId:[],
                    stage_id:2

                },
                'proposal-made':{
                    card_probability:30,
                    id:'proposal-made',
                    title:'Proposal sent',
                    dealsId:[],
                    stage_id:3

                },
                'presentation':{
                    card_probability:50,
                    id:'presentation',
                    title:'Presentation',
                    dealsId:[],
                    stage_id:4

                },
                'negotiations':{
                    card_probability:80,
                    id:'negotiations',
                    title:'Negotiations',
                    dealsId:[],
                    stage_id:5

                },
            }
            let cardOrder=['lead-in','proposal-development','proposal-made','presentation','negotiations']
            let {data}=res
            let total_pv=null
            if(data.length>0){
                data.map((data,i)=>{
                    if(data.stage===1){
                        cards['lead-in']={
                            ...cards['lead-in'],
                            dealsId:[...cards['lead-in'].dealsId,`${data.dealId}`]
                        }

                    }else if(data.stage===2){
                        cards['proposal-development']={
                            ...cards['proposal-development'],
                            dealsId:[...cards['proposal-development'].dealsId,`${data.dealId}`]
                        }

                    }else if(data.stage===3){
                        cards['proposal-made']={
                            ...cards['proposal-made'],
                            dealsId:[...cards['proposal-made'].dealsId,`${data.dealId}`]
                        }

                    }else if(data.stage===4){
                        cards['presentation']={
                            ...cards['presentation'],
                            dealsId:[...cards['presentation'].dealsId,`${data.dealId}`]
                        }

                    }else{
                        cards['negotiations']={
                            ...cards['negotiations'],
                            dealsId:[...cards['negotiations'].dealsId,`${data.dealId}`]
                        }

                    }
                    deals[`${data.dealId}`]={
                        id:`${data.dealId}`,
                        title:data.dealName,
                        age:data.age,
                        dealDate:data.dealDate,
                        clientName:data.clientName,
                        clientId:data.clientId,
                        proposalValue:data.proposalValue,
                        probability:data.probability,
                        access:data.access,
                        rms:data.rms,
                        invoicePeriod:data.invoicePeriod,
                        statusDate: data.statusDate
                    }
                    total_pv=data.proposalValue+total_pv
                })
                
                dispatch({
                    type:actionType.SET_TOTAL_PV,
                    payload:total_pv
                })
                 dispatch({
                     type:actionType.SET_PIPELINE,
                     payload:{
                         cards:cards,
                         deals:deals,
                         cardOrder:cardOrder
                     }
                 })
                // console.log('deals', cards)
                dispatch(setLoading(false))

            }else{
                dispatch({
                    type:actionType.SET_TOTAL_PV,
                    payload:0
                })
                dispatch(setCards(cards))
                dispatch(setLoading(false))

            }
            
            

            return res
        }else{
            dispatch(setLoading(false))
            // return res
            
        }
}
export const getProject=(token,slug='/0/0/0/0')=>async(dispatch)=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/pipeline/projection/${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==200){
            let project={}
            let {data}=res
            let cards_hihi={}
            res.data.stages.map((data)=>{
                cards_hihi={
                    ...cards_hihi,
                    [data.stage]:{
                        id:data.month,
                        title:`${data.text} ${data.year}`,
                        projectsId:[],
                        stage_id:data.stage,
                        year:data.year,
                        month:data.month,
                        total_pv:0
                    }
                }
            })
            // data.projection.map((data)=>{
            //     cards_hihi[data.month]={
            //         ...cards[data.month],
            //         projectsId:[...cards_hihi[data.month].projectsId,`${data.invoiceId}`],
            //         total_pv:cards[data.month]+data.value
            //     }
            // })
            // console.log('cards hihihi', cards_hihi)
            let cards={
                [data.stages[0].stage]:{
                    id:data.stages[0].stage,
                    card_probability:10,
                    title:`${data.stages[0].text} ${data.stages[0].year}`,
                    projectsId:[],
                    stage_id:data.stages[0].stage,
                    year:data.stages[0].year,
                    month:data.stages[0].month,
                    total_pv:0

                },
                [data.stages[1].stage]:{
                    id:data.stages[1].stage,
                    card_probability:20,
                    title:`${data.stages[1].text} ${data.stages[1].year}`,
                    projectsId:[],
                    stage_id:data.stages[1].stage,
                    year:data.stages[1].year,
                    month:data.stages[1].month,
                    total_pv:0
                },
                [data.stages[2].stage]:{
                    id:data.stages[2].stage,
                    card_probability:30,
                    title:`${data.stages[2].text} ${data.stages[2].year}`,
                    projectsId:[],
                    stage_id:data.stages[2].stage,
                    year:data.stages[2].year,
                    month:data.stages[2].month,
                    total_pv:0
                },
                [data.stages[3].stage]:{
                    id:data.stages[3].stage,
                    card_probability:50,
                    title:`${data.stages[3].text} ${data.stages[3].year}`,
                    projectsId:[],
                    stage_id:data.stages[3].stage,
                    year:data.stages[3].year,
                    month:data.stages[3].month,
                    total_pv:0
                },
                [data.stages[4].stage]:{
                    id:data.stages[4].stage,
                    card_probability:10,
                    title:`${data.stages[4].text} ${data.stages[4].year}`,
                    projectsId:[],
                    stage_id:data.stages[4].stage,
                    year:data.stages[4].year,
                    month:data.stages[4].month,
                    total_pv:0
                },
            }
            let cardProjectionOrder=[]
            data.stages.map((data)=>{
                cardProjectionOrder.push(data.stage)
            })
            // let {data}=res
            
            let total_pv=null
            let all_total_pv=null
            if(data.projection.length>0){
                data.projection.map((data,i)=>{
                    if(data.stage===1){
                        cards[data.stage]={
                            ...cards[data.stage],
                            projectsId:[...cards[data.stage].projectsId,`${data.invoiceId}`],
                            total_pv:cards[data.stage]+data.value
                        }

                    }else if(data.stage===2){
                        cards[data.stage]={
                            ...cards[data.stage],
                            projectsId:[...cards[data.stage].projectsId,`${data.invoiceId}`],
                            total_pv:cards[data.stage]+data.value
                        }

                    }else if(data.stage===3){
                        cards[data.stage]={
                            ...cards[data.stage],
                            projectsId:[...cards[data.stage].projectsId,`${data.invoiceId}`],
                            total_pv:cards[data.stage]+data.value
                        }

                    }else if(data.stage===4){
                        cards[data.stage]={
                            ...cards[data.stage],
                            projectsId:[...cards[data.stage].projectsId,`${data.invoiceId}`],
                            total_pv:cards[data.stage]+data.value
                        }

                    }else{
                        // console.log('hehoh', cards,cards[data.stage],data.stage)
                        cards[data.stage]={
                            ...cards[data.stage],
                            projectsId:[...cards[data.stage].projectsId,`${data.invoiceId}`],
                            total_pv:cards[data.stage]+data.value
                        }

                    }
                    project[`${data.invoiceId}`]={
                        id:`${data.invoiceId}`,
                        dealId:data.dealId,
                        title:data.dealName,
                        age:data.age,
                        dealDate:data.dealDate,
                        clientName:data.clientName,
                        clientId:data.clientId,
                        probability:data.probability,
                        invoiceDate:data.invoiceDate,
                        value:data.value,
                        remarks:data.remarks,
                        year:data.year,
                        month:data.month,
                        stage:data.stage,
                        access:data.access,
                        rms:data.rms
                    }
                    total_pv=data.proposalValue+total_pv
                    all_total_pv=data.value+all_total_pv
                    // console.log('all_total_pv', all_total_pv)
                    
                })
                // console.log('cards', project)
                
                dispatch({
                    type:actionType.SET_TOTAL_PV_PROJECT,
                    payload:all_total_pv
                })
                // if(!isEmpty(project)){
                    dispatch({
                        type:actionType.SET_PROJECTION,
                        payload:{
                           card_projections:cards,
                            projection:project,
                            cardProjectionOrder:cardProjectionOrder
                        }
                    })
                // }
                
                
                dispatch(setLoading(false))

            }else{
                dispatch({
                    type:actionType.SET_TOTAL_PV_PROJECT,
                    payload:0
                })
                dispatch({
                    type:actionType.SET_PROJECTION,
                    payload:{
                       card_projections:cards,
                        projection:project,
                        cardProjectionOrder:cardProjectionOrder
                    }
                })
                // dispatch(setCards(cards))
                dispatch(setLoading(false))

            }
            
            

            return res
        }else{
            dispatch(setLoading(false))
            // return res
            
        }
}

export const getRm=(token,slug='*')=>async(dispatch)=>{
    let dataReq={
        url:`/user/list/rm/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let for_select=[]
        res.data.map((data,i)=>{
            for_select.push({label:data.text,value:data.id})
        })
        dispatch({
            type:actionType.GET_RM_PIPELINE,
            payload:for_select
        })
    }
}
export const updateStage=(token,slug)=>async(dispatch)=>{
    // dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/drop${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // dispatch(getPipeline(token))
        // dispatch(modalToggle({ 
        //     modal_open: true,
        //     modal_title: "Deals Updated",
        //     modal_component: "update_deals",
        //     modal_size:400,
        //     modal_type:'alert',
        //     modal_data:{
        //         msg:`<p>Deals <b>${res.data.dealName}</b> succesfully Updated</p> `
        //     },
        //     modal_action:'success'
        // }))
        return res.data
    }else{
        // return res
        // dispatch(setLoading(false))

    }
}
export const updateStageProjection=(token,slug)=>async(dispatch)=>{
    // dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/projection/drop${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // dispatch(getPipeline(token))
        // dispatch(modalToggle({ 
        //     modal_open: true,
        //     modal_title: "Deals Updated",
        //     modal_component: "update_deals",
        //     modal_size:400,
        //     modal_type:'alert',
        //     modal_data:{
        //         msg:`<p>Deals <b>${res.data.dealName}</b> succesfully Updated</p> `
        //     },
        //     modal_action:'success'
        // }))
    }else{
        // dispatch(setLoading(false))

    }
}
export const addDeal=(token,data,url_get)=>async (dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getPipeline(token,url_get))
        if(data.stageId<=1){
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Deal successfully created",
                modal_component: "add_deals",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>New deal have been successfully registered with deal name is <b>${res.data.name}</b> </p> `
                },
                modal_action:'success'
            }))
        }
       
        return res
    }else{
        dispatch(setLoading(false))

    }
}
export const addSalesVisit=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/visit`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res
        await dispatch(getDetailDeal(token,data.dealId))
        dispatch(setLoading(false))

        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Sales visit recorded successfully",
            modal_component: "add_deals",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p></p> `
            },
            modal_action:'success'
        }))
        dispatch({
            type:actionType.RESET_SALES_VISIT
        })
    }else{
        dispatch(setLoading(false))

    }
}
export const addSalesVisitWithoutDeal=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/visit`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res
        // await dispatch(getDetailDeal(token,data.dealId))
        dispatch(setLoading(false))

        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Sales visit recorded successfully",
            modal_component: "add_deals",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p></p> `
            },
            modal_action:'success'
        }))
        dispatch({
            type:actionType.RESET_SALES_VISIT
        })
    }else{
        dispatch(setLoading(false))

    }
}
export const addProposal=(token,data,dealId)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/proposal`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // await dispatch(getPipeline(token))
        // dispatch(setLoading(false))
        let {data}=res
        await dispatch(getDetailDeal(token,dealId))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Upload Proposal success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Proposal with deal type <b>${data.proposalType.text}</b> and <b>${data.filename}</b> uploaded</p> `
            },
            modal_action:'success'
        }))
        dispatch({
            type:actionType.RESET_PROPOSAL
        })
    }else{
        dispatch(setLoading(false))

    }
}
export const updateProposal=(token,data,dealId,get_url)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/proposal/${data.id}`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res

        await dispatch(getPipeline(token,get_url))
        await dispatch(getDetailDeal(token,dealId))
        // dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Proposal success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Proposal with deal type <b>${data.proposalType.text}</b> and <b>${data.filename}</b> updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const getDetailDeal=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/Pipeline/detail/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        
        // await dispatch(getPipeline(token))
        dispatch(setLoading(false))
        dispatch({
            type:actionType.GET_DETAIL_DEAL,
            payload:res.data
        })
        return res
    }else{
        dispatch(setLoading(false))

    }
}

export const getStatusUpdate=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/Pipeline/status/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        
        // await dispatch(getPipeline(token))
        dispatch(setLoading(false))
        dispatch({
            type:actionType.GET_STATUS_UPDATE,
            payload:res.data
        })
        return res
    }else{
        dispatch(setLoading(false))

    }
}

export const createStatusUpdate=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/status`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getStatusUpdate(token,res.data.dealId))
        dispatch(setLoading(false))
        let {data}=res
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Status",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Status successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}

export const editStatusUpdate=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/status/${data.id}`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getStatusUpdate(token,data.dealId))
        dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Status",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Status successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}

export const deleteUpdateStatus=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/status/${data.id}/${data.userId}`,
        method:'DELETE',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getStatusUpdate(token,data.dealId))
        dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Status",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Status successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}

export const addOwner=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/owners`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getDetailDeal(token,res.data.dealId))
        dispatch(setLoading(false))
        let {data}=res
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Owner",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Owners successfully update</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const addOwnerWithoutAlert=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/owners`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        // await dispatch(getDetailDeal(token,res.data.dealId))
        dispatch(setLoading(false))
        // let {data}=res
        // dispatch(modalToggle({ 
        //     modal_open: true,
        //     modal_title: "Update Owner",
        //     modal_component: "see_detail_deal",
        //     modal_size:400,
        //     modal_type:'alert',
        //     modal_data:{
        //         msg:`<p>Owners successfully update</p> `
        //     },
        //     modal_action:'success'
        // }))
    }else{
        dispatch(setLoading(false))

    }
}
export const wonDeal=(token,data,get_url)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/state/${data.dealId}/${data.userId}/2`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res
        await dispatch(getPipeline(token,get_url))
        await dispatch(getDetailDeal(token,data.dealId))

        dispatch(setLoading(false))
        
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Change status success",
            modal_component: "to_pipeline",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                dealId:data.dealId,
                clientId:data.clientId,
                msg:`<p><b>${data.dealName}</b> status change to WON</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const lostDeal=(token,data,get_url)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/state/${data.dealId}/${data.userId}/3`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        
        let {data}=res
        await dispatch(getPipeline(token,get_url))
        await dispatch(getDetailDeal(token,data.dealId))
        dispatch(setLoading(false))

        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Change status success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                dealId:data.dealId,
                clientId:data.clientId,
                msg:`<p><b>${data.dealName}</b> status change to LOST</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const reopenDeal=(token,data,get_url)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/state/${data.dealId}/${data.userId}/4`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res

        await dispatch(getDetailDeal(token,data.dealId))
        await dispatch(getPipeline(token,get_url))
        dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Change status success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                dealId:data.dealId,
                clientId:data.clientId,
                msg:`<p><b>${data.dealName}</b> status change to Open</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const deleteDeal=(token,data,get_url)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/${data.dealId}/${data.userId}`,
        method:'DELETE',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getPipeline(token,get_url))
        dispatch(setLoading(false))
        let {data}=res
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Deal successfully deleted",
            modal_component: "to_pipeline",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p><b>${data.name}</b></b> successfully deleted in our system</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const updateDeal=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/${data.id}`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        await dispatch(getDetailDeal(token,res.data.id))
        dispatch(setLoading(false))
        let {data}=res
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Deal successfully updated",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p><b>${data.name}</b></b> successfully updated in our system</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}

export const updateSalesVisit=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))
    // console.log('data', data)
    let dataReq={
        url:`/pipeline/visit/${data.id}`,
        method:'PUT',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res

        // await dispatch(getPipeline(token))
        await dispatch(getDetailDeal(token,data.dealId))
        // dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Sales visit success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Sales visit successfully updated</p> `
            },
            modal_action:'success'
        }))
        dispatch({
            type:actionType.RESET_SALES_VISIT
        })
    }else{
        dispatch(setLoading(false))

    }
}
export const updateProbability=(token,data_prob)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/probability/${data_prob.dealId}/${data_prob.userId}/${data_prob.probability}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res

        await dispatch(getDetailDeal(token,data_prob.dealId))
        await dispatch(getPipeline(token))

        // dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Probability success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Probability successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const postInvoice=(token,data_payload,clientId)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/projection/invoice`,
        method:'POST',
        data:{
            data:data_payload,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        let {data}=res

        // await dispatch(getPipeline(token))
        // await dispatch(getDetailDeal(token,data_prob.dealId))
        dispatch(setLoading(false))
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Update Invoice success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                dealId:data_payload.dealId,
                clientId:clientId,
                msg:`<p>Invoice successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}
export const viewFile=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/File/view/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        window.open(res.data, '_blank');
        dispatch(setLoading(false))
        
    }else{
        dispatch(setLoading(false))

    }
}

export const postPricing=(token,data)=>async(dispatch)=>{
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
            modal_title: "Update Pricing success",
            modal_component: "see_detail_deal",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Pricing successfully updated</p> `
            },
            modal_action:'success'
        }))
    }else{
        dispatch(setLoading(false))

    }
}



export const getSummary=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))

    let dataReq={
        url:`/pipeline/summary/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch({
            type:actionType.SET_SUMMARY,
            payload:res.data
        })
        dispatch(setLoading(false))
        return res
    }else{
        dispatch(setLoading(false))

    }
}

export const getLostDeal=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable(true))
    let dataReq={
        url:`/pipeline/lostdeal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch({
            type:actionType.GET_LOST_DEAL,
            payload:{
                lost_deal:res.data.items,
                pagination:res.data.info
            }
        })
        dispatch(setLoadingTable(false))
        return res
    }else{
        dispatch(setLoadingTable(false))

    }
}
