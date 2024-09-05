import React from 'react';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,

      },
      width:'100%',
    //   marginBottom:15,
  },
}));
 
function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  }

export default function Index(props) {
    const classes=useStyles()

    return (
        <TextField
            {...props}
            className={classes.textField}
            InputProps={{
                inputComponent: NumberFormatCustom,
            }}
      />
    )
}
