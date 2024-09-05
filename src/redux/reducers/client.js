import * as actionTypes from '../constants/client'
import moment from 'moment'
const initialState={
    list_rm:[],
    rm_filter:[],
    selected_rm:[],
    employee:[],
    name:'',
    industry:null,
    phone_no:'+62',
    fax:'+62',

    address1:'',
    address2:'',
    address3:'',
    website:'',
    remarks:'',

    list_client:[],
    detail_client:[],
    list_industries:[],
    list_segments:[],
    list_branch:[],

    client_pagination:null,
    
    search:'',
    search2:'',

    client_filter:{
        industry:{label:'All industry',value:0},
        segment:{label:'All segment',value:0},
        rm:{label:'All RM',value:0}
    },
    contact_filter:{
        // periode:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().format('M'))}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        periode:{year: moment().format('YYYY'), month:moment().format('MM')},
        industry:{value:0,label:'All industry'},
        textPeriode:`${moment().format('MMM')}. ${moment().year()}`
    },
    client_action:'add_client',
    id:null,
    contact:[],
    contact_pagination:null,
    contact_export:[]
}

export default (state=initialState,action)=>    {
    switch(action.type){
        case actionTypes.SET_RM:
            return{
                ...state,
                selected_rm:action.payload
            }
        case actionTypes.GET_RM_FILTER:
            return{
                ...state,
                rm_filter:action.payload
            }
        case actionTypes.SET_EMP:
            return{
                ...state,
                employee:action.payload
            }
        case actionTypes.SET_NAME:
            return{
                ...state,
                name:action.payload
            }

        case actionTypes.SET_INDUSTRY:
            return{
                ...state,
                industry:action.payload
            }
        case actionTypes.SET_PHONE_NO:
            return{
                ...state,
                phone_no:action.payload
            }
        case actionTypes.SET_ADDRESS1:

            return{
                ...state,
                address1:action.payload
            }  
        case actionTypes.SET_ADDRESS2:

            return{
                ...state,
                address2:action.payload
            }  
        
        case actionTypes.SET_ADDRESS3:
            return{
                ...state,
                address3:action.payload
            }  
        case actionTypes.SET_CLIENT:
            return{
                ...state,
                list_client:action.payload
            }
        case actionTypes.SET_FAX:
            return{
                ...state,
                fax:action.payload
            }
        case actionTypes.SET_WESITE:
            return{
                ...state,
                website:action.payload
            }
        case actionTypes.SET_REMARKS:
            return{
                ...state,
                remarks:action.payload
            }
        case actionTypes.GET_INDUSTRY:
            return{
                ...state,
                list_industries:action.payload
            }
        case actionTypes.GET_SEGMENT:
            return{
                ...state,
                list_segments:action.payload
            }
        case actionTypes.GET_RM:
            return{
                ...state,
                list_rm:action.payload
            }
        case actionTypes.GET_BRANCH:
            return{
                ...state,
                list_branch:action.payload
            }
        case actionTypes.GET_DETAIL_CLIENT:
            return{
                ...state,
                detail_client:action.payload
            }
        case actionTypes.SET_PAGINATION:
            return{
                ...state,
                client_pagination:action.payload
            }
        case actionTypes.SET_SEARCH:
            return{
                ...state,
                search:action.payload
            }
        case actionTypes.SET_SEARCH2:
            return{
                ...state,
                search2:action.payload
            }
        case actionTypes.CLIENT_ACTION:

            return{
                ...state,
                client_action:action.payload
            }
        case actionTypes.CLIENT_FILTER:
            return{
                ...state,
                client_filter:{
                    ...state.client_filter,
                    [Object.keys(action.payload)]:Object.values(action.payload)[0]
                }
            }
        case actionTypes.SET_ID:
            return{
                ...state,
                id:action.payload
            }
        case actionTypes.CLEAR_STATE:
            return{
                ...state,
                rm_filter:[],
                selected_rm:[],
                employee:[],
                name:'',
                industry:'',
                phone_no:'+62',
                fax:'+62',
            
                address1:'',
                address2:'',
                address3:'',
                website:'',
                remarks:'',
            }
        case actionTypes.SET_FILTER_CONTACT:
            return{
                ...state,
                contact_filter:action.payload
            }
        case actionTypes.GET_CONTACT:
            return{
                ...state,
                contact:action.payload.contact,
                contact_pagination:action.payload.contact_pagination
            }
        case actionTypes.GET_DATA_EXPORT:
            return{
                ...state,
               contact_export:action.payload
            }
        default:
            return state;
    }
}