import * as actionTypes from '../constants/pipeline'
import moment from 'moment'
// // console.log('object', object)

const initialState={
    filter:{
        tribe:0,
        segment:0,
        rm:{label:'All RM',value:0},
        periode:{fromMonth:0,toMonth:0},
        probability:[],
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:'All Period'
    },
    deals:{},
    cards:{
        'lead-in':{
            id:'lead-in',
            card_probability:10,
            title:'Lead in',
            dealsId:[],
        },
        'proposal-development':{
            card_probability:20,
            id:'proposal-development',
            title:'Proposal Development',
            dealsId:[]
        },
        'proposal-made':{
            card_probability:30,
            id:'proposal-made',
            title:'Proposal Made',
            dealsId:[]
        },
        'presentation':{
            card_probability:50,
            id:'presentation',
            title:'Presentation',
            dealsId:[]
        },
        'negotiations':{
            card_probability:80,
            id:'negotiations',
            title:'Negotiations',
            dealsId:[]
        },
    },
    cardOrder:['lead-in','proposal-development','proposal-made','presentation','negotiations'],

    //proposal
    proposal:{
        userId:null,
        dealId:null,
        sentById:null,
        typeId:null,
        sendDate:null,
        contactIds:[],
        filename:'',
        fileBase64:null,
        proposalValue:null,
        invoices:[],
    
    },
    sales_visit:{
        visitDate:null,
        startTime:null,
        endTime:null,
        contacts:[],
        rms:[],
        tribes:[],
        consultants:[],
        location:'',
        objective:'',
        nextStep:'',
        remark:'',
        id:0
    },
    clientId:null,

    detail_deal:null,
    total_pv:0,
    total_pv_project:0,
    projection:{},
    card_projections:{
        'Jan':{
            id:'Jan',
            card_probability:10,
            title:'Januari 2020',
            projectsId:[],
        },
        'Feb':{
            card_probability:20,
            id:'Feb',
            title:'February 2020',
            projectsId:[]
        },
        'Mar':{
            card_probability:30,
            id:'Mar',
            title:'Maret 2020',
            projectsId:[]
        },
        'Apr':{
            card_probability:50,
            id:'Apr',
            title:'April 2020',
            projectsId:[]
        },
        'May':{
            card_probability:80,
            id:'May',
            title:'May 2020',
            projectsId:[]
        },
    },
    cardProjectionOrder:['Jan','Feb','Mar','Apr','May'],
    summary:[
        {amount:0},
        {amount:0},
        {amount:0},
    ],
    lost_deal:[],
    lost_deal_pagination:null

}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionTypes.SET_DEALS:
            return{
                ...state,
                deals:action.payload
            }
        case actionTypes.SET_CARDS:
            return{
                ...state,
                cards:action.payload
            }
        case actionTypes.SET_CARDS_PROJECTION:
            return{
                ...state,
                card_projections:action.payload
            }
        case actionTypes.SET_CARD_ORDER:
            return{
                ...state,
                cardOrder:action.payload
            }
        case actionTypes.SET_PIPELINE:
            return{
                ...state,
                cards:action.payload.cards,
                deals:action.payload.deals,
                cardOrder:action.payload.cardOrder
            }
        case actionTypes.SET_PROJECTION:
            return{
                ...state,
                card_projections:action.payload.card_projections,
                projection:action.payload.projection,
                cardProjectionOrder:action.payload.cardProjectionOrder
            }
        case actionTypes.SET_FILTER:
            return{
                ...state,
                filter:{
                    ...state.filter,
                    [Object.keys(action.payload)]:Object.values(action.payload)[0]
                }
            }
        case actionTypes.SET_PROPOSAL:
            return{
                ...state,
                proposal:{
                    ...state.proposal,
                    [Object.keys(action.payload)]:Object.values(action.payload)[0]
                }
            }
        case actionTypes.SET_SALES_VISIT:
            return{
                ...state,
                sales_visit:{
                    ...state.sales_visit,
                    [Object.keys(action.payload)]:Object.values(action.payload)[0]
                }
            }
        case actionTypes.GET_RM_PIPELINE:
            return{
                ...state,
                rmPipeline:action.payload
            }
        case actionTypes.GET_DETAIL_DEAL:
            return{
                ...state,
                detail_deal:action.payload
            }
        case actionTypes.SET_TOTAL_PV:
            return{
                ...state,
                total_pv:action.payload
            }
        case actionTypes.SET_TOTAL_PV_PROJECT:
            return{
                ...state,
                total_pv_project:action.payload
            }
        case actionTypes.SET_CLIENT_ID:
            return{
                ...state,
                clientId:action.payload
            }
        case actionTypes.SET_SUMMARY:
            return{
                ...state,
                summary:action.payload
            }
        case actionTypes.RESET_PROPOSAL:
            return {
                ...state,
                clientId:null,
                proposal:{
                    ...state.proposal,
                    userId:null,
                    // dealId:null,
                    sentById:null,
                    typeId:null,
                    sendDate:null,
                    contactIds:[],
                    filename:'',
                    fileBase64:null,
                    proposalValue:null,
                    invoices:[],
                
                },
            }
        case actionTypes.RESET_SALES_VISIT:
            return {
                ...state,
                sales_visit:{
                    ...state.sales_visit,
                    visitDate:moment().format('YYYY-MM-DD'),
                    startTime:null,
                    endTime:null,
                    contacts:[],
                    rms:[],
                    consultants:[],
                    location:'',
                    objective:'',
                    nextStep:'',
                    remark:''
                
                },
            }
        case actionTypes.GET_LOST_DEAL:
            return {
                ...state,
                lost_deal:action.payload.lost_deal,
                lost_deal_pagination:action.payload.pagination
            }
        case actionTypes.GET_STATUS_UPDATE:
            return {
                ...state,
                data_status_update:action.payload
            }
        // case actionTypes.SET_PAGINATION:
        //     return{
        //         ...state,
        //         lost_deal_pagination:action.payload
        //     }
        default:
            return state;
    }
}