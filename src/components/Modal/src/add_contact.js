import React, { Component } from 'react'
import {Button,Collapse,FormControl,InputLabel,Select,MenuItem,Divider,
    OutlinedInput,InputAdornment,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {setEmp,updateContact} from 'redux/actions/client'
import {modalToggleReset} from 'redux/actions/general'
import InputMask from 'react-input-mask'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#FFB100',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#AFE597',
            contrastText: '#FFFFFF',
        },
    } 
})
class add_contact extends Component {
    state={
        employee:[
            {index:this.props.client.employee.length+1,valid:false,salutation:'-',name:'',email:'',phone:'+62',department:'',position:'',is_active:false},
        ],
        focus_id:null
    }
    componentDidMount(){
        const {modal_data,modal_action}=this.props
        let {employee}=this.state
        const {client}=this.props
        if(modal_data!==null){
            this.setState({employee:modal_data})
        }
        console.log('ahihi', employee,client.employee)
    }

    onChange=(e,id)=>{
        const {modal_data,modal_action,client}=this.props
        let {employee}=this.state
        let {value,name}=e.target
        employee[id][name]=value
        this.setState({employee:employee})
    }
    onClickSave=async ()=>{
        let removeid=[]
        let {employee}=this.state
        const employee_list=this.props.client.employee
        let last=employee.length
        let afterclearempty=employee.filter(newd=>{
            if(employee.length===1){
                return newd
            }else{
                return newd.index!==employee[last-1].index

            }
        })
        
        let merge=[...employee_list,...afterclearempty]
        let isFillAll=false
        afterclearempty.map((d)=>{
            if(d.valid!==undefined&&d.salutation!==undefined&&d.name!==''&&d.phone!==''&&d.department!==''){
                isFillAll=true
            }else{
                isFillAll=false
            }
        })
        if(isFillAll){
            if(this.props.modal_action==='edit_contact_from_list'){
            
                await this.props.updateContact(this.props.token,this.state.employee[0],this.props.profile.id)
                // this.props.modalToggleReset()
    
            }else{
                await this.props.setEmp(merge)
                this.props.modalToggleReset()
    
            }
        }
        
        
        // let last=employee.pop()
        // let afterclearempty=employee.filter(newd=>{
        //     return newd.index!==last.index
        // })
        // let merge=[...employee_list,...afterclearempty]
        // afterclearempty.map((emp,i)=>{
        //     removeid.push({index:employee.length,name:emp.name,salutation:emp.salutation,valid:emp.valid,email:emp.email,phone:emp.phone,department:emp.department,position:emp.position})
        // })
        // removeid=[...employee_list,...removeid]
        // console.log('afterclearempty', afterclearempty)
        // this.props.setEmp(merge)
        // console.log('employee_list',employee,employee_list)
        // this.props.modalToggleReset()
    }
    onFocus=(emp,index)=>{
        let {employee}=this.state
        const employee_list=this.props.client.employee
        const last=employee.length
        if(!emp.is_active){
            let dummy={index:employee[last-1].index+1,name:'',email:'',phone:'',department:'',position:''}
            let new_data=[...employee,dummy]
            new_data[index].is_active=true
            this.setState({employee:new_data})
        }
       
    }
    renderDisable=()=>{
        const {modal_action} =this.props
        if(modal_action==='see_contact'){
            return true
        }else{
            return false
        }
    }
    render() {
        const {employee}=this.state
        const {modal_action} =this.props
        // console.log('employee', employee)
        return (
            <div>
                <MuiThemeProvider theme={themeButton}>
                {employee.map((emp,i)=>(
                    <div style={{marginBottom:10}} key={i}>
                    <FormControl disabled={this.renderDisable()} variant="outlined" size="small" color='secondary' className='contact-field' >
                        <InputLabel  htmlFor="category">Valid<span style={{color:'red'}}>*</span></InputLabel>
                        <Select name="valid" value={emp.valid}  onChange={(e)=>this.onChange(e,i)}  labelId="label" id="select"  labelWidth={40} className='field-radius'>
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl disabled={this.renderDisable()} variant="outlined" size="small" color='secondary' className='contact-field' >
                        <InputLabel  htmlFor="category">Salutation<span style={{color:'red'}}>*</span></InputLabel>
                        <Select  name="salutation"  value={emp.salutation} onChange={(e)=>this.onChange(e,i)} labelId="label" id="select"  labelWidth={75} className='field-radius'>
                            <MenuItem value="-">-</MenuItem>
                            <MenuItem value="Mr.">Mr.</MenuItem>
                            <MenuItem value="Ms.">Ms.</MenuItem>
                            <MenuItem value="Mrs.">Mrs.</MenuItem>
                            <MenuItem value="Dr.">Dr.</MenuItem>
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl  color='secondary' variant="outlined" size="small" className='contact-field' >
                        <InputLabel  htmlFor="name">Name<span style={{color:'red'}}>*</span></InputLabel>
                        <OutlinedInput
                             onChange={(e)=>this.onChange(e,i)}
                            value={emp.name}
                            id="name"
                            type='text'
                            name='name'
                            required
                            labelWidth={40}
                            className='field-radius'
                            disabled={this.renderDisable()}
                        />
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                        <InputLabel  htmlFor="email">Email</InputLabel>
                        <OutlinedInput
                             onChange={(e)=>this.onChange(e,i)}
                             value={emp.email}
                            id="email"
                            type='email'
                            name='email'
                            required
                            labelWidth={40}
                            className='field-radius'
                            disabled={this.renderDisable()}
                        />
                    </FormControl>
                    &nbsp;&nbsp;
                    <InputMask
                        maskChar={null}
                        mask="(+99)999-9999-9999"
                        onChange={(e)=>this.onChange(e,i)}
                        value={emp.phone}
                    >
                    {() =>
                         <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                         <InputLabel  htmlFor="phone_no">Phone No<span style={{color:'red'}}>*</span></InputLabel>
                         <OutlinedInput
                             id="phone_no"
                             type='text'
                             name='phone'
                             required
                             labelWidth={75}
                             className='field-radius'
                             disabled={this.renderDisable()}
                         />
                     </FormControl>
                    }
                    </InputMask>
                       
                    &nbsp;&nbsp;            
                    <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                        <InputLabel  htmlFor="department">department<span style={{color:'red'}}>*</span></InputLabel>
                        <OutlinedInput
                             onChange={(e)=>this.onChange(e,i)}
                             value={emp.department}
                            id="department"
                            type='text'
                            name='department'
                            required
                            labelWidth={80}
                            className='field-radius'
                            disabled={this.renderDisable()}
                        />
                    </FormControl>  
                    &nbsp;&nbsp;              
                    <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                        <InputLabel  htmlFor="position">position</InputLabel>
                        <OutlinedInput
                             onFocus={()=>modal_action==='add_contact'?this.onFocus(emp,i):null}
                             value={emp.position}
                             onChange={(e)=>this.onChange(e,i)}
                            id="position"
                            type='text'
                            name='position'
                            required
                            labelWidth={60}
                            className='field-radius'
                            disabled={this.renderDisable()}
                        />
                    </FormControl>  
                    <br/>
                    </div>              
                   
                
                ))}
                 <div className='modal-footer'>
                        {modal_action!=='see_contact'&&<Button onClick={this.onClickSave}  size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded'>Save</Button>}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return{
        client:state.client
    }
}
export default connect(mapStateToProps,{setEmp,modalToggleReset,modalToggleReset,updateContact})(add_contact)