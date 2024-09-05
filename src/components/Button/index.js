import React from 'react'
import {Button } from '@material-ui/core'
import { withStyles, ThemeProvider } from "@material-ui/styles";
const Button = withStyles(theme => ({
root: props =>
    props.color === "success" && props.variant === "contained"
    ? {
        color: theme.palette.success.contrastText,
        backgroundColor: theme.palette.success.main,
        "&:hover": {
            backgroundColor: theme.palette.success.dark,
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
            backgroundColor: theme.palette.success.main
            }
        }
        }
    : {}
}))(Button);
export default function Index() {
    return (
        <div>
            
        </div>
    )
}
