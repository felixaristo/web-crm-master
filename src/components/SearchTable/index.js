import React ,{useState,useMemo}from 'react'
import SearchImg from 'assets/icon/Search.png'
import {FormControl,InputLabel,OutlinedInput,InputAdornment} from '@material-ui/core'
import { debounce } from 'lodash'
const SearchTable=React.memo((props)=>{
    
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
            <OutlinedInput
                size='small'
                {...props}
                style={{height:30,width:200,}}
                // value={props.search}
                id="input-with-icon-textfield"
                name='password'
                onChange={(e)=>props.searchToggle(e.target.value)}
                // onKeyPress={e =>props.handleKeyPress(e)}
                required
                startAdornment={
                <InputAdornment position="start">
                    <img alt="search" src={SearchImg} style={{width:15}}/>
                </InputAdornment>
                }
                labelWidth={50}
            />
        </FormControl>
    )
})
export default SearchTable