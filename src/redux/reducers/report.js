import * as actionType from '../constants/report'
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
    // chart1:null,
    // chart2:null,
    // chart3:null,
    // chart4:null,
    chart:[],
    report_excel:null,

    filter_individual_all:{
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
        tribes:[]
    },
    individual_all:null,
    individual_all_pagination:null
}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionType.GET_SUMMARY_REPORT:
            return{
                ...state,
                report_summary:action.payload
            }
        case actionType.GET_REPORT_TABLE:
            return{
                ...state,
                report_table:action.payload
            }
        case actionType.SET_REPORT_FILTER:
            return{ 
                ...state,
                filter:{...state.filter,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.SET_TABLE_TITLE:
            return{
                ...state,
                table_title:action.payload
            }
        case actionType.GET_CHART:
            return{
                ...state,
                // chart1:action.payload.chart1,
                // chart2:action.payload.chart2,
                // chart3:action.payload.chart3,
                // chart4:action.payload.chart4,
                chart:action.payload
            }
        case actionType.GET_REPORT_EXCEL:
            return{
                ...state,
                report_excel:action.payload
            }
        case actionType.SET_FILTER_INDIVIDUAL_ALL:
            return{ 
                ...state,
                filter_individual_all:{...state.filter_individual_all,[Object.keys(action.payload)]:Object.values(action.payload)[0]}
            }
        case actionType.GET_INDIVIDUAL_ALL:
            return{
                ...state,
                individual_all:action.payload
            }
        default:
            return state;
    }
}