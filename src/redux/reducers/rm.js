import * as actionType from 'redux/constants/rm'
const initialState={
    list_rm:[],
    pagination:null,
    filter:{
        segments:[],
        branches:[]
    },
    detail_rm:{
        id:0,
        name:'',
        nik:'',
        email:'',
        phone:'',
        address:'',
        jobTitle:'',
        platformId:null,
        segmentId:null,
        branchId:null,
        fileBase64:'',
        filename:'',
        file_url:''
    }
}

export default (state=initialState,action)=>{
    switch (action.type) {
        case actionType.SET_RM:
            return{
                ...state,
                [Object.keys(action.payload)]:Object.values(action.payload)[0]
            }
    
        default:
            return state
    }
}