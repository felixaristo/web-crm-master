import * as actionType from 'redux/constants/team'
const initialState={
    list_team:[],
    
}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionType.SET_TEAM:
            return{
                ...state,
                [Object.keys(action.payload)]:Object.values(action.payload)[0]
            }
    
        default:
            return state
    }
}