import React,{useState,useEffect} from 'react'
import AutoCompleteSelect from 'components/Select'
import { useSelector,useDispatch } from 'react-redux'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { modalToggleReset } from 'redux/actions/general'
import { Button } from '@material-ui/core'
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
        segments:[],
        branches:[]
    })
    const dispatch = useDispatch()
    const master = useSelector(state => state.master)
    useEffect(() => {
        if(props.modal_data!==null){
            setstate(props.modal_data.filter)
        }
    }, [])
    const onClickApply=()=>{
        props.modal_data.modalAction(state)
    }
    return (
        <div>
             <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,segments:value})}
                options={master.segments}
                value={state.segments}
                getOptionLabel={(option) => option.text}
                label="Segment"
                multiple
            />
             <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,branches:value})}
                options={master.branches}
                value={state.branches}
                getOptionLabel={(option) => option.text}
                label="Branch"
                multiple
            />
            <div style={{textAlign:'right'}}>
                <MuiThemeProvider theme={themeButton}>
                    <Button onClick={onClickApply} size="small" color="primary" className='btn-remove-capital btn-rounded' variant="contained">Apply Filter</Button>
                </MuiThemeProvider>
            </div>
            <br/>
        </div>
    )
}
