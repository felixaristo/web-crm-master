import React,{useRef,useState,useEffect} from 'react'
import TextField from 'components/TextField'
import Picker from 'react-month-picker'
import { useSelector,useDispatch } from 'react-redux'
import moment from 'moment'
import 'react-month-picker/css/month-picker.css';
import { setFilterSalesVisit } from 'redux/actions/account'
import AutoCompleteSelect from 'components/Select'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core';
import { modalToggleReset } from 'redux/actions/general'
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
const MonthBox=(props)=>{
    const _handleClick=(e)=> {
        props.onClick && props.onClick(e);
    }
    return(
        <TextField
            label='Deal period'
            value={props.textPeriode}
            onFocus={_handleClick}
            color='primary'
            variant='outlined'
            size='small'
            name='name'
            style={{marginBottom:20}}
        />
    )
}
export default function Filter_sales_visit({modal_data,profile}) {
    const [state, setstate] = useState({
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
        tribes:[]
    })
    const dispatch = useDispatch()
    const account = useSelector(state => state.account)
    const master = useSelector(state => state.master)
    const pickRange=useRef(null)
    const pickerLang = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        from: 'From', to: 'To',
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    let {filter_sales_visit}=account
    useEffect(() => {
        setstate({
            rangeValue:filter_sales_visit.rangeValue,
            textPeriode:filter_sales_visit.textPeriode,
            periode:filter_sales_visit.periode,
            tribes:filter_sales_visit.tribes
        })
    }, [])
    const makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
        return '?'
    }
    const _handleClickRangeBox=(e)=>{
        pickRange.current.show()
    }
    const handleRangeChange=(value, text, listIndex)=> {
       
    }
    const handleRangeDissmis=(value)=> {
        let fromMonth=value.from.month
        let toMonth=value.to.month
        
        setstate({
            ...state,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        // dispatch(setFilterSalesVisit({
        //     periode:{fromMonth:fromMonth,toMonth:toMonth},
        // }))
        // dispatch(setFilterSalesVisit({
        //     rangeValue:value
        // }))
        // dispatch(setFilterSalesVisit({
        //     textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        // }))
        
    }
    const onClickApply=async ()=>{
        await dispatch(setFilterSalesVisit({
            periode:state.periode,
        }))
        await dispatch(setFilterSalesVisit({
            rangeValue:state.rangeValue
        }))
        await dispatch(setFilterSalesVisit({
            textPeriode:state.textPeriode
        }))
        await dispatch(setFilterSalesVisit({tribes:state.tribes}))
        let new_tribes=[]
        state.tribes.map((d)=>{
            new_tribes.push(d.id)
        })
        await modal_data.action(`/${profile.id}/${state.periode.fromMonth}/${state.periode.toMonth}/${state.rangeValue.from.year}/${new_tribes.length>0?new_tribes.join(','):0}`)
        dispatch(modalToggleReset())
    }
    return (
        <div>
            <Picker
                ref={pickRange}
                years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                value={state.rangeValue}
                lang={pickerLang}
                theme="light"
                onChange={handleRangeChange}
                onDismiss={handleRangeDissmis}
            >
                <MonthBox textPeriode={state.textPeriode} value={makeText(state.rangeValue.from) + ' - ' + makeText(state.rangeValue.to)} onClick={_handleClickRangeBox} />
            </Picker>
            <AutoCompleteSelect
                onChange={(event,value)=>setstate({...state,tribes:value})}
                options={master.tribes}
                value={state.tribes}
                getOptionLabel={(option) => option.text}
                label="Tribe"
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
