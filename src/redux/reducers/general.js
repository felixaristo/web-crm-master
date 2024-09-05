import * as actionTypes from "../constants/general";
const initialState={
    modal_open:false,
    modal_data:null,
    modal_title:'',
    modal_component:'',
    modal_size:400,
    modal_type:'',
    isLoading:false,
    isLoadingTable:false,
    isLoadingTable2:false,
    error_msg:null,
    modal_action:null,
    modal_subtitle:null
}
export default (state=initialState,action)=>{
    switch (action.type) {
        case actionTypes.MODAL_SHOW:
            return{
                ...state,
                modal_open:action.payload.modal_open,
                modal_data:action.payload.modal_data,
                modal_title:action.payload.modal_title,
                modal_component:action.payload.modal_component,
                modal_size:action.payload.modal_size,
                modal_type:action.payload.modal_type,
                modal_action:action.payload.modal_action,
                modal_subtitle:action.payload.modal_subtitle
            }
        case actionTypes.MODAL_RESET:
            
            return {
                ...state,
                modal_open:false,
                modal_data:null,
                modal_title:'',
                modal_component:'',
                modal_size:400,
                modal_type:'',
                error_msg:null,
                modal_action:null,
                modal_subtitle:null
            }

        case actionTypes.SET_LOADING:
            return{
                ...state,
                isLoading:action.payload 
            }
        case actionTypes.SET_LOADING_TABLE:
            return{
                ...state,
                isLoadingTable:action.payload 
            }
        case actionTypes.SET_LOADING_TABLE2:
            return{
                ...state,
                isLoadingTable2:action.payload 
            }
        case actionTypes.SET_ERROR:
            return{
                ...state,
                error_msg:action.payload
            }
        default:
            return state;
    }
}

