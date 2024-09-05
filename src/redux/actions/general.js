import * as actionTypes from 'redux/constants/general'

export const modalToggle=(obj)=>async dispatch=>{
    dispatch({
        type:actionTypes.MODAL_SHOW,
        payload:obj
    })
}

export const modalToggleReset=(obj)=>async dispatch=>{
    dispatch({
        type: actionTypes.MODAL_RESET,
        payload: obj
      });
}

export const setLoading =(payload)=>dispatch=>{
    dispatch({
        type:actionTypes.SET_LOADING,
        payload
    })
}
export const setLoadingTable =(payload)=>dispatch=>{
    dispatch({
        type:actionTypes.SET_LOADING_TABLE,
        payload
    })
}
export const setLoadingTable2 =(payload)=>dispatch=>{
    dispatch({
        type:actionTypes.SET_LOADING_TABLE2,
        payload
    })
}

export const setError =(payload)=>dispatch=>{
    dispatch({
        type:actionTypes.SET_ERROR,
        payload
    })
}

