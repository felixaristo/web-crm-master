import React from 'react'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,

      },
      width:'100%',
    //   marginBottom:15,
  },
}));
 
export default function Index(props) {
    const classes=useStyles()

    return (
        <TextField
            {...props}
            className={classes.textField}
        />
    )
}
