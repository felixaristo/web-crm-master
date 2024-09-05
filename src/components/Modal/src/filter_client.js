import React,{useState,useEffect} from 'react'
import Select from 'react-select';
import {modalToggleReset} from 'redux/actions/general'
import {connect} from 'react-redux'
import {Radio,FormControlLabel,RadioGroup,Button} from '@material-ui/core'
import {getClient,setClientFilter} from 'redux/actions/client'
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import AutoCompleteSelect from 'components/Select'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#AFE597',
            contrastText: '#FFFFFF',
        },
    } 
})
const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#afe597',
            contrastText: '#FFFFFF',

        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',

        }
    } 
})
export default function Filter_client(props) {
    const [state, setstate] = useState({
        filter_by:'cs',
        industry:{label:'All industry',value:0},
        segment:{label:'All segment',value:0},
        rm:{label:'All RM',value:0}
    })
    const dispatch=useDispatch()
    const client=useSelector(state=>state.client)
    const toggleRadio=(e)=>{
        setstate({
            ...state,
            filter_by:e.target.value
        })
    }
    const onChange=(option,name)=>{
        
        dispatch(setClientFilter({
            [name.name]:option.value
        }))

    }
    const onClickSave=async()=>{
        const {industry,segment,rm}=state
        console.log('props.token', props.token)
        await dispatch(modalToggleReset())
        
        let res=await dispatch(getClient(props.token,`/${industry.value}/${segment.value}/${rm.value}/1/${client.client_pagination.perPage}/${client.search===''?'*':client.search}`))
        if(res){
            dispatch(setClientFilter({industry:state.industry}))
            dispatch(setClientFilter({segment:state.segment}))
            dispatch(setClientFilter({rm:state.rm}))
        }

    }
    console.log('client.client_filter', client.client_filter)
    return (
        <div>
            <MuiThemeProvider theme={themeField}>
            <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,industry:value})}
                options={[{label:'All Industry',value:0},...client.list_industries]}
                getOptionLabel={(option) => option.label}
                label={<>Industry</>}
                value={state.industry}
                disableClearable={true}

            />
             {/* <Select 
                placeholder='Industry'
                options={client.list_industries} 
                name='industry'
                value={client.list_industries.length>0&&client.list_segments.filter(option=>{return option.value===client.client_filter.industry})}
                onChange={onChange}
                theme={theme => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                    ...theme.colors,
                    primary: '#ffb100',
                    },
                })}
            /> */}
            <RadioGroup style={{marginTop:'-10px'}} aria-label="gender" name="gender2" value={state.filter_by} onChange={toggleRadio}>
            <FormControlLabel
                value="cs"
                control={<Radio style={{color:'#afe597'}} />}
                label="Client Segment"
                labelPlacement="end"
            />
            {/* <Select 
                 isDisabled={state.filter_by!=='cs'?true:false}
                placeholder='Choose client segment'
                options={client.list_segments} 
                name='segment'
                // isClearable={true}
                // isMulti
                value={client.list_segments.length>0&&client.list_segments.filter(option=>{return option.value===client.client_filter.segment})}
                onChange={onChange}
                theme={theme => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                    ...theme.colors,
                    primary: '#ffb100',
                    },
                })}
            /> */}
            <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,segment:value})}
                options={[{label:'All Segments',value:0},...client.list_segments]}
                getOptionLabel={(option) => option.label}
                label={<>Choose client segment</>}
                value={state.segment}
                disableClearable={true}
                disabled={state.filter_by!=='cs'?true:false}

            />
            <FormControlLabel
            style={{marginTop:'-10px'}}
                value="rm"
                control={<Radio style={{color:'#afe597'}}/>}
                label="Relationship manager"
                labelPlacement="end"
            />
            {/* <Select 
                placeholder='Choose relationship manager'
                options={client.rm_filter} 
                name='rm'
                isDisabled={state.filter_by!=='rm'?true:false}
                // isClearable={true}
                // isMulti
                value={client.rm_filter.length>0&&client.rm_filter.filter(option=>{return option.value===client.client_filter.rm})}
                onChange={onChange}
                theme={theme => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                    ...theme.colors,
                    primary: '#ffb100',
                    },
                })}
            /> */}
            <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,rm:value})}
                options={[{label:'All RM',value:0},...client.rm_filter]}
                getOptionLabel={(option) => option.label}
                label={<>Choose relationship manager</>}
                value={state.rm}
                disableClearable={true}
                disabled={state.filter_by!=='rm'?true:false}

            />
            </RadioGroup>
            </MuiThemeProvider>
        <div className='modal-footer'>
            <MuiThemeProvider theme={themeButton}>
            <Button onClick={onClickSave}  size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded'>Save</Button>
            </MuiThemeProvider>
        </div>
        </div>
    )
}
