import React, { Component } from 'react'
import Skeleton  from 'react-loading-skeleton';
import {TableRow,TableCell} from '@material-ui/core'
export default class index extends Component {
   
    render() {
        const {count}=this.props
        let skeleton=[] 
        for (let index = 0; index < count; index++) {
            skeleton.push(<TableCell><Skeleton count={4} height={30}/> </TableCell>)
            
        }
        return (
                <TableRow >
                   {skeleton}
                </TableRow>
        )
    }
}
