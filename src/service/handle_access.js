export const handle_access=(id,roleId,access,rm,title)=>{
    if(roleId==0){
        return false
    }
    if(roleId==1){
        return true
    }
    if(roleId==2){
        return true
    }
    if(roleId==5){
    // console.log('id',id, roleId,access,rm)

        let rm_filter=rm.filter((data)=>{
            return data.id===id
        })
        let access_filter=access.filter((data)=>{
            return data.id===id
        })
        // console.log('rm_filter,access_filter', rm_filter.length>0||access_filter.length>0,title)
        if(rm_filter.length>0||access_filter.length>0){
            return true
        }else{
            return false
        }
        
    }
    if(roleId==4){
       return false 
    }  
    
}

export const handle_access2=(id,access,rm)=>{

}