import React from 'react'
import {TextField,CircularProgress} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab';
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
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
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,

      },
      width:'100%',
      marginBottom:20,
  },
  
  
}));
export default function Index(props) {
    const classes=useStyles()
    return (
        // <MuiThemeProvider theme={themeField}>
            <Autocomplete
                {...props}
                size='small'
                id="combo-box-demo"
                options={props.options}
                getOptionLabel={props.getOptionLabel}
                onInputChange={props.onInputChange}
                loading={props.loading}
                loadingText='Loading...'
                onChange={props.onChange}
                renderInput={(params) => 
                
                <TextField  className={classes.textField} 
                    {...params} 
                    label={props.label} 
                    variant="outlined" 
                />
            }
            />
        // </MuiThemeProvider>
    )
}
