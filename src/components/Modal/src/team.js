import React,{useState,useEffect} from 'react'
import AutoCompleteSelect from 'components/Select'
import { useSelector,useDispatch } from 'react-redux'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { modalToggleReset } from 'redux/actions/general'
import { Button } from '@material-ui/core'
import TextField from 'components/TextField'
import * as actionTeam from 'redux/actions/team'
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
export default function Filter_rm(props) {
    const [state, setstate] = useState({
        id:0,
        name:'',
        leader:null,
        mentor:null,
        members:[],
        options:[]
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
                id:modal_data.id,
                name:modal_data.text,
                leader:modal_data.leader,
                mentor:modal_data.mentor,
                members:modal_data.members,
                options:master.rm_text
            })
        }
    }, [])
    const handleDisable=()=>{
        if(state.leader&&state.members.length>0){
            return false
        }else{
            return true
        }
    }
    const onClickApply=()=>{
        let new_member=[]
        state.members.map((d)=>{
            new_member.push(d.id)
        })
        let data={
            id:state.id,
            name:state.name,
            leaderId:state.leader===null?0:state.leader.id,
            mentorId:state.mentor===null?0:state.mentor.id,
            members:new_member
        }
        if(modal_action==='add_team'){
            dispatch(actionTeam.postTeam(data))
        }else{
            dispatch(actionTeam.putTeam(data))
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
            <TextField
                value={state.name}
                onChange={(e)=>setstate({...state,name:e.target.value})}
                color="secondary"
                variant="outlined"
                size="small"
                label="Team Name"
                style={{marginBottom:15}}
            />
             <AutoCompleteSelect
                onChange={(event,value)=>onChange(value,'leader',event)}
                options={state.options}
                value={state.leader}
                getOptionLabel={(option) => option.text}
                label="Leader"
                color="secondary"
                

            />
             <AutoCompleteSelect
                onChange={(event,value,reason)=>onChange(value,'members',reason)}
                options={state.options}
                value={state.members}
                getOptionLabel={(option) => option.text}
                label="Members"
                multiple
                color="secondary"
                filterSelectedOptions

            />
            <AutoCompleteSelect
                onChange={(event,value)=>onChange(value,'mentor')}
                options={state.options}
                value={state.mentor}
                getOptionLabel={(option) => option.text}
                label="Mentor"
                color="secondary"

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
