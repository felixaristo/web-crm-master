import * as actionType from '../constants/account'
import moment from 'moment'
const initialState={
    report_summary:[],
    report_table:null,
    filter:{
        unit:'tribe',
        year:moment().format('YYYY'),
        month:moment().format('M'),
        periode:{
            from: {
                year: parseInt(moment().format('YYYY')), 
                month:parseInt(moment().format('M')) 
            }, 
            to: {
                year: parseInt(moment().format('YYYY')), 
                month: parseInt(moment().format('M'))
            },
            
        }
    },
    table_title:'',
    chart:[],
    report_excel:null,
    visit:[],
    proposal:[],
    visit_pagination:null,
    proposal_pagination:null,
    visit_search:'',
    proposal_search:'',

    target:{
        year:{
            id:moment().year(),
            value:moment(),
            text:moment().year().toString()
        },
        status:"Not Submitted yet",
        target_month:[
            {
                month:'Januari',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'February',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'March',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'April',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'May',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'June',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'July',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'August',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'September',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'October',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'November',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            {
                month:'December',
                no_proposal:0,
                sales_visit:0,
                proposal_value:0,
                sales:0
            },
            
        ]
    },
    filter_sales_visit:{
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
        tribes:[]
    },
    filter_sales_visit_mentor:{
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
        tribes:[]
    },
    report_leader:null,
    report_mentor:null,
    target_status:'',

    proposal_team:[],
    proposal_team_pagination:null
}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionType.SET_TARGET_STATUS:
            return{
                ...state,
                target_status:action.payload
            }
        case actionType.SET_REPORT_LEADER:
            return{
                ...state,
                report_leader:action.payload
            }
        case actionType.SET_REPORT_MENTOR:
            return{
                ...state,
                report_mentor:action.payload
            }
        case actionType.GET_ACCOUNT_SUMMARY_REPORT:
            return{
                ...state,
                report_summary:action.payload
            }
        case actionType.GET_ACCOUNT_REPORT_TABLE:
            return{
                ...state,
                report_table:action.payload
            }
        case actionType.SET_ACCOUNT_REPORT_FILTER:
            return{ 
                ...state,
                filter:{...state.filter,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.SET_TARGET:
            return{ 
                ...state,
                target:{...state.target,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.SET_FILTER_SALES_VISIT:
            return{ 
                ...state,
                filter_sales_visit:{...state.filter_sales_visit,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.SET_FILTER_SALES_VISIT_MENTOR:
            return{ 
                ...state,
                filter_sales_visit_mentor:{...state.filter_sales_visit_mentor,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.SET_ACCOUNT_TABLE_TITLE:
            return{
                ...state,
                table_title:action.payload
            }
        case actionType.GET_ACCOUNT_CHART:
            return{
                ...state,
                
                chart:action.payload
            }
        case actionType.GET_ACCOUNT_REPORT_EXCEL:
            return{
                ...state,
                report_excel:action.payload
            }
        case actionType.GET_ACCOUNT_VISIT:
            return{
                ...state,
                visit:action.payload.visit,
                visit_pagination:action.payload.pagination
            }
        case actionType.GET_ACCOUNT_PROPOSAL:
            return{
                ...state,
                proposal:action.payload.visit,
                proposal_pagination:action.payload.pagination
            }
        case actionType.SET_ACCOUNT_VISIT_SEARCH:
            return{
                ...state,
                visit_search:action.payload
            }
        case actionType.GET_PROPOSAL_TEAM:
            return{
                ...state,
                proposal_team:action.payload.proposal_team,
                proposal_team_pagination:action.payload.proposal_team_pagination
            }
        default:
            return state;
    }
}