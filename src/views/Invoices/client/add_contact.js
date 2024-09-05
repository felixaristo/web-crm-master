import React, { Component } from 'react'
import '../style.css'
import {Button,FormControl,InputLabel,OutlinedInput,InputAdornment
    ,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import SearchImg from 'assets/icon/Search.png'
import filter from 'assets/icon/filter.svg'
import Eye from 'assets/icon/eye.png'
import Edit from 'assets/icon/edit.png'
import Close from 'assets/icon/close.svg'
import {connect} from 'react-redux'
import {modalToggle} from 'redux/actions/general'
import {setEmp} from 'redux/actions/client'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
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
class add_contact extends Component {
    state={
        employee:this.props.client.employee,
        search:''
    }
    componentWillReceiveProps(newProps){
        this.setState({employee:newProps.client.employee})
    }
    search=(e)=>{
        let {search,employee}=this.state
        const { value } = e.target
        // console.log('e.target.value', e.target.value)
        this.setState({search:value})
        if(search.length>0){
            let searchresult=this.props.client.employee.filter(data=>{
                return data.name.match(value)
            })
            this.setState({employee:searchresult})
            console.log('searchresult', searchresult)
        }else{
            this.setState({employee:this.props.client.employee})

        }
    }
    addContact=()=>{
        const {client}=this.props
        
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Add client contact`,
            modal_component: "contact",
            modal_size:1100,
            modal_type:'add_contact',
            modal_data:null,
            modal_action:'add_contact'
        })
    }
    editContact=(contact)=>{
        console.log('contact', contact)
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Edit client contact`,
            modal_component: "contact",
            modal_size:1100,
            modal_type:'add_contact',
            modal_data:[contact],
            modal_action:'edit_contact'
        })
    }
    removeEmp=(contact)=>{
        const {employee}=this.props.client
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Detail`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'Contact',
                index:contact.index,
                msg:`<p>Delete <b>${contact.name}</b> from database</p>`
            },
            modal_action:'delete_client_contact'
        })
    }
    render() {
        const {client,handleDisable}=this.props
        const {employee}=this.state
        console.log('client', client)
        return (
            <div >
                {/* <div className='card-table'> */}
                    <div className='card-table__head'>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                            <OutlinedInput
                                // disabled={handleDisable()}
                                size='small'
                                style={{height:30,width:200,}}
                                id="input-with-icon-textfield"
                                name='password'
                                onChange={this.search}
                                required
                                startAdornment={
                                <InputAdornment position="start">
                                    <img alt="search" src={SearchImg} style={{width:15}}/>
                                </InputAdornment>
                                }
                                labelWidth={55}
                            />
                        </FormControl>
                        <div>
                            <MuiThemeProvider theme={themeButton}>
                                <Button disabled={handleDisable()} onClick={this.addContact} size='small' color='primary' variant='contained' className='head-section__btn'>Add new</Button>
                            </MuiThemeProvider>
                        </div>
                    </div>
                    <div className='card-table__content'>
                    <Table  size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell >Phone No.</TableCell>
                            <TableCell >Valid</TableCell>
                            <TableCell >Departement</TableCell>
                            <TableCell >Position</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee.length>0?employee.map((emp,i)=>(
                             <TableRow key={i}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.phone}</TableCell>
                                <TableCell>{emp.valid?'Yes':'No'}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.position}</TableCell>
                                <TableCell align="right">
                                    <img src={Edit} className="icon-table" onClick={()=>handleDisable()?null:this.editContact(emp)} />
                                    <img src={Close} className="icon-table" onClick={()=>handleDisable()?null:this.removeEmp(emp)}/>
                                </TableCell>

                            </TableRow>
                            )):
                            <TableRow>
                                <TableCell colSpan={7} style={{textAlign:'center'}}>
                                    <MuiThemeProvider theme={themeButton}>
                                        <Button onClick={this.addContact} disabled={handleDisable()} color='secondary' variant='text' className='remove-capital'>Add contact</Button>
                                    </MuiThemeProvider>
                                </TableCell>
                            </TableRow>
                            }
                        </TableBody>
                    </Table>
                    </div>
                {/* </div> */}
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    client:state.client
})
const mapDispatchToProps={
    modalToggle,setEmp
}
export default connect(mapStateToProps,mapDispatchToProps)(add_contact)