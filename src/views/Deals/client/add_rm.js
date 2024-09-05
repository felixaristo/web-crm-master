import React, { Component } from 'react'
import '../style.css'
import {Button,FormControl,InputLabel,OutlinedInput,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
 } from '@material-ui/core/styles'
 import Contact from 'assets/icon/Contact.svg'
import Close from 'assets/icon/close.svg'
import {connect} from 'react-redux'
import {modalToggle} from 'redux/actions/general'
import {
    setRm,
    setListRm
} from 'redux/actions/client'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#3B99EB',
            contrastText: '#FFFFFF',
        }
    } 
})
class add_rm extends Component {
    addRm=()=>{
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Select relationship manager`,
            modal_component: "rm",
            modal_size:600,
            modal_type:'add_rm',
            modal_data:null,
            modal_action:'add_rm'
        })
    }
    detailRm=(data)=>{
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Detail relationship manager`,
            modal_component: "rm",
            modal_size:600,
            modal_type:'add_rm',
            modal_data:[data],
            modal_action:'detail_rm'
        })
    }
    deleteRm=(data)=>{
        const {client}=this.props
        // this.props.modalToggle({ 
        //     modal_open: true,
        //     modal_title: `Form`,
        //     modal_component: "confirm_delete",
        //     modal_size:400,
        //     modal_type:'confirm',
        //     modal_data:{
        //         index:index,
        //         title:`Relationship manager`,
        //         msg:'<p>Are you sure delete this rm</p>'
        //     },
        //     modal_action:'delete_rm'
        // })
        let new_list=[...client.list_rm,data]
        let new_selected=client.selected_rm.filter((rm)=>{
            return rm.id!==data.id
        })
        this.props.setListRm(new_list)
        this.props.setRm(new_selected)
    }
    render() {
        let {tabToggle,client,handleDisable}=this.props
        console.log('client.selected_rm', client.list_rm)
        return (
            <div >
                <div className='head-section'>
                    <p className='bold'>Relationship manager</p>
                    <MuiThemeProvider theme={themeButton}>
                        <Button disabled={handleDisable()} onClick={()=>this.addRm()} size='small' color='primary' variant='contained' className='head-section__btn'>Add new</Button>
                    </MuiThemeProvider>
                </div>
                <div className='table-section'>
                    <Table  size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Branch</TableCell>
                            <TableCell align="left">Segment</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.selected_rm.length>0?client.selected_rm.map((data,i)=>(
                                <TableRow>
                                    <TableCell style={{maxWidth:50,minHeight:100,}}>{data.name}</TableCell>
                                    <TableCell style={{maxWidth:50,minHeight:100,}}>{data.branch}</TableCell>
                                    <TableCell style={{maxWidth:50,minHeight:100,}}>{data.segment}</TableCell>
                                    <TableCell align="right">
                                        <img src={Contact} onClick={()=>handleDisable()?null:this.detailRm(data)} className='icon-action'/>
                                        <img src={Close} onClick={()=>handleDisable()?null:this.deleteRm(data)} className='icon-action'/>
                                    </TableCell>
                                </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={4} style={{textAlign:'center'}}>
                                    <MuiThemeProvider theme={themeButton}>
                                        <Button disabled={handleDisable()} color='secondary' variant='text' className='remove-capital' onClick={this.addRm}>Add relationship manager</Button>
                                    </MuiThemeProvider>
                                </TableCell>
                            </TableRow>
                            }
                            
                            
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    client:state.client
})
const mapDispatchToProps={
    modalToggle,
    setRm,
    setListRm
}
export default connect(mapStateToProps,mapDispatchToProps)(add_rm)