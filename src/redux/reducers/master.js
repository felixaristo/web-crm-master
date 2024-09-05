import * as actionTypes from '../constants/master'

const getTabByUrl=(url)=>{
    switch (url) {
        case '/deals':
            return 'pipeline'
            break;
        case '/invoices':
            return 'invoice'
            break;
        case '/lostdeal':
            return 'lost_deal'
        default:
            break;
    }
}
const initialState={
    rm:[],
    rm_full:[],
    rm_text:[],
    rm_team:[],
    segments:[],
    tribes:[],
    branches:[],
    stages:[],
    proposalTypes:[],
    client:[],
    contact:[],
    employee:[],
    proposalTypes:[],
    detail_client:null,
    tab_active:getTabByUrl(window.location.pathname),
    tab_back:getTabByUrl(window.location.pathname)
}
export default (state=initialState,action)=>{
    switch (action.type) {
        case actionTypes.GET_MASTER_DATA:
            return{
                ...state,
                rm:action.payload.rm,
                rm_full:action.payload.rm_full,
                segments:action.payload.segments,
                tribes:action.payload.tribes,
                branches:action.payload.branches,
                stages:action.payload.stages,
                proposalTypes:action.payload.proposalTypes,
                rm_text:action.payload.rm_text
            }
        case actionTypes.GET_MASTER_DATA:
            return{
                ...state,
                rm:action.payload,
               
            }
        case actionTypes.GET_CONTACT:
            return{
                ...state,
                contact:action.payload,
               
            }
        case actionTypes.GET_DETAIL_CLIENT:
            return{
                ...state,
                detail_client:action.payload,
               
            }
        case actionTypes.GET_CLIENT_SEARCH:
            return{
                ...state,
                client:action.payload,
               
            }
        case actionTypes.SET_TAB:
            return{
                ...state,
                tab_active:action.payload.tab_active,
                tab_back:action.payload.tab_back,
            }
        case actionTypes.GET_EMPLOYEE:
            return{
                ...state,
                employee:action.payload
            }
        default:
            return state;
    }
}