import React from 'react'
import {Button,TextField,FormControl,InputLabel,OutlinedInput,MenuItem,Select,
    Switch ,FormHelperText,FormControlLabel,Checkbox,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import avadefault from 'assets/icon/avadefault.svg'

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
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
        },
        secondary:{
            main:'#ffb100',
            contrastText: '#FFFFFF',

        }
    } 
})
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
      marginBottom:15
  },
    textField2: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
    //   marginBottom:15
  }
  
}));
export default function Employee() {
    const classes=useStyles()

    return (
        <div style={{display:'flex',justifyContent:'space-between'}}>
            
            <div style={{width:'60%'}}>
                <MuiThemeProvider theme={themeField}>
                    <TextField
                        label='Name'
                        type='text'
                        // value={event.address}
                        // onChange={(e)=>dispatch(setAddress(e.target.value))}
                        variant='outlined'
                        size='small'
                        className={classes.textField}

                    />
                    <TextField
                        label='NIK'
                        type='text'
                        // value={event.address}
                        // onChange={(e)=>dispatch(setAddress(e.target.value))}
                        variant='outlined'
                        size='small'
                        className={classes.textField}

                    />
                    <TextField
                        label='Job title'
                        type='text'
                        // value={event.address}
                        // onChange={(e)=>dispatch(setAddress(e.target.value))}
                        variant='outlined'
                        size='small'
                        className={classes.textField}

                    />
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Tribe</InputLabel>
                        <Select  value='project'  onChange={(e)=>null} labelId="label" id="select"  labelWidth={40} className='field-radius'>
                            <MenuItem value="project">KMD</MenuItem>
                            <MenuItem value="workshop">Workshop</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Branch</InputLabel>
                        <Select  value='project'  onChange={(e)=>null} labelId="label" id="select"  labelWidth={55} className='field-radius'>
                            <MenuItem value="project">Jakarta</MenuItem>
                            <MenuItem value="workshop">Workshop</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" className='add-proposal__field' >
                        <InputLabel  htmlFor="category">Authority</InputLabel>
                        <Select  value='project'  onChange={(e)=>null} labelId="label" id="select"  labelWidth={65} className='field-radius'>
                            <MenuItem value="project">Regular</MenuItem>
                            <MenuItem value="workshop">Workshop</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label='Email'
                        type='email'
                        // value={event.address}
                        // onChange={(e)=>dispatch(setAddress(e.target.value))}
                        variant='outlined'
                        size='small'
                        className={classes.textField}

                    />
                    <div style={{display:'flex',alignItems:'center'}}>
                        <p className='semi-bold'>Status</p>
                        &nbsp;&nbsp;
                        <FormControlLabel
                            style={{marginTop:-10}}
                            control={
                            <Switch
                                checked={true}
                                onChange={null}
                                name="checkedB"
                                color="secondary"
                            />
                            }
                            label="Active"
                        />
                    </div>
                   
                </MuiThemeProvider>
            </div>
            <div style={{width:'30%'}}>
                <div className='ava-rounded'>
                   <img src={avadefault} style={{width:130}} />
               </div>
            </div>
        </div>
    )
}
