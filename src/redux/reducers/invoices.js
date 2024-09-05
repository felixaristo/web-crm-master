import * as actionType from '../constants/invoices'
import moment from 'moment'
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
    card_invoiced:{
        'Jan':{
            id:'Jan',
            card_probability:10,
            title:'Januari 2020',
            invoicesId:[],
        },
        'Feb':{
            card_probability:20,
            id:'Feb',
            title:'February 2020',
            invoicesId:[],
        },
        'Mar':{
            card_probability:30,
            id:'Mar',
            title:'Maret 2020',
            invoicesId:[],
        },
        'Apr':{
            card_probability:50,
            id:'Apr',
            title:'April 2020',
            invoicesId:[],
        },
        'May':{
            card_probability:80,
            id:'May',
            title:'May 2020',
            invoicesId:[],
        },
    },
    cardInvoicedOrder:['Jan','Feb','Mar','Apr','May'],
    invoiced:{},
    card_tobe_invoiced:{
        'Jan':{
            id:'Jan',
            card_probability:10,
            title:'Januari 2020',
            invoicesId:[],
        },
        'Feb':{
            card_probability:20,
            id:'Feb',
            title:'February 2020',
            invoicesId:[]
        },
        'Mar':{
            card_probability:30,
            id:'Mar',
            title:'Maret 2020',
            invoicesId:[]
        },
        'Apr':{
            card_probability:50,
            id:'Apr',
            title:'April 2020',
            invoicesId:[]
        },
        'May':{
            card_probability:80,
            id:'May',
            title:'May 2020',
            invoicesId:[]
        },
    },
    cardTobeInvoicedOrder:['Jan','Feb','Mar','Apr','May'],
    tobe_invoiced:{},
    total_value_tobe:0,
    total_value_invoiced:0,
    list_deals:[],
    detail_invoice:null,
    tab_invoice:'to_beinvoice',
    invoice_action:'add_invoice',
    to_excel:[]
}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionType.TO_EXCEL:
            return{
                ...state,
                to_excel:action.payload
            }
        case actionType.GET_INVOICED:
            return{
                ...state,
                card_invoiced:action.payload.card_invoiced,
                invoiced:action.payload.invoiced,
                cardInvoicedOrder:action.payload.cardInvoicedOrder,
                total_value_invoiced:action.payload.total_value
            }
        case actionType.GET_TOBE_INVOICE:
            return{
                ...state,
                card_tobe_invoiced:action.payload.card_tobe_invoiced,
                tobe_invoiced:action.payload.tobe_invoiced,
                cardTobeInvoicedOrder:action.payload.cardTobeInvoicedOrder,
                total_value_tobe:action.payload.total_value

            }
        case actionType.SET_FILTER:
            return{
                ...state,
                filter:{
                    ...state.filter,
                    [Object.keys(action.payload)]:Object.values(action.payload)[0]
                }
            }
        case actionType.SET_TOTALVALUE_TOBE:
            return{
                ...state,
                total_value_tobe:action.payload
            }
        case actionType.SET_TOTALVALUE_INVOICED:
            return{
                ...state,
                total_value_invoiced:action.payload
            }
        case actionType.GET_DEALS:
            return{
                ...state,
                list_deals:action.payload
            }
        case actionType.SET_DETAIL_INVOICED:
            return{
                ...state,
                detail_invoice:action.payload
            }
        case actionType.SET_TAB_INVOICE:
            return{
                ...state,
                tab_invoice:action.payload
            }
        case actionType.SET_INVOICE_ACTION:
            return{
                ...state,
                invoice_action:action.payload
            }
        default:
            return state;
    }
}