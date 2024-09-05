import React,{useState,useEffect} from 'react'
import AutoCompleteSelect from 'components/Select'
import { useSelector,useDispatch } from 'react-redux'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { modalToggleReset } from 'redux/actions/general'
import { Button } from '@material-ui/core'
import TextField from 'components/TextField'
import * as actionStatus from 'redux/actions/pipeline'
import _ from 'lodash'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffc466',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        },
    } 
})
export default function Update_status(props) {
    const [state, setstate] = useState({
        id:0,
        status:'',
        dealId: 0
    })
    const dispatch = useDispatch()
    let {modal_data,modal_action}=props

    const master = useSelector(state => state.master)
    useEffect(() => {
        console.log(`master.rm_text`, master.rm_text)
        setstate({...state,options:master.rm_text})
        if(modal_data!==null){
            setstate({
                ...state,
                id: modal_data.id,
                dealId: modal_data.dealId,
                status: modal_data.status
            })
        }
    }, [])
    const handleDisable=()=>{
        if(state.status.length>0){
            return false
        }else{
            return true
        }
    }
    const onClickApply=()=>{
        let data={
            id:state.id,
            status:state.status,
            dealId:state.dealId,
            userId:props.profile.id
        }
        if(modal_action==='add_status'){
            dispatch(actionStatus.createStatusUpdate(props.token, data))
        }else{
            dispatch(actionStatus.editStatusUpdate(props.token, data))
        }
    }
    const onChange=(value,name,reason)=>{
        let new_opt=[]
        if(Array.isArray(value)){
            if(reason==='select-option'){
                value.map((v)=>{
                    new_opt=state.options.filter((d)=>{
                        return d.id!==v.id
                    })
                })
            }else{
                if(_.isEmpty(value)){
                    new_opt=[...state.members,...state.options]
                }else{
                    value.map((v)=>{
                        new_opt=master.rm_text.filter((d)=>{
                            return d.id!==v.id
                        })
                        
                    })
                }
            }
        }else{
            if(value){
                new_opt=state.options.filter((d)=>{
                    return d.id!==value.id
                })
            }else{
                new_opt=[state[name],...state.options]
            }
        }
        setstate({...state,[name]:value,options:new_opt})
    }

    return (
        <div>
            {/* <TextField
                value={state.name}
                onChange={(e)=>setstate({...state,name:e.target.value})}
                color="secondary"
                variant="outlined"
                size="small"
                label="Team Name"
                style={{marginBottom:15}}
            /> */}
            <TextField
                label='Set Status'
                type='textarea'
                value={state.status}
                onChange={(e)=>setstate({...state,status:e.target.value})}
                rows={3}
                variant='outlined'
                size='small'
                name='remark'
                multiline
                style={{marginBottom:15}}
            />
            
            <div style={{textAlign:'right'}}>
                <MuiThemeProvider theme={themeButton}>
                    <Button disabled={handleDisable()} onClick={onClickApply} size="small" color="primary" className='btn-remove-capital btn-rounded' variant="contained">Save</Button>
                </MuiThemeProvider>
            </div>
            <br/>
        </div>
    )
}
