import React, { Component } from 'react'
import {Button,Collapse,FormControl,InputLabel,Select,MenuItem,Divider,
    OutlinedInput,InputAdornment,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {updateClient,getContact} from 'redux/actions/master'
import {modalToggleReset} from 'redux/actions/general'
import InputMask from 'react-input-mask'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#AFE597',
            contrastText: '#FFFFFF',
        },
    } 
})
class add_contact_detail extends Component {
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
            // this.setState({employee:modal_data})
        }
    }

    onChange=(e,id)=>{
        const {modal_data,modal_action,client}=this.props
        let {employee}=this.state
        let {value,name}=e.target
        employee[id][name]=value
        this.setState({employee:employee})
    }
    onClickSave=async()=>{
        let removeid=[]
        let {employee}=this.state
        let {detail_client}=this.props.master
        const last=employee.length
        let afterclearempty=employee.filter(newd=>{
            if(employee.length===1){
                return newd
            }else{
                return newd.index!==employee[last-1].index

            }
        })
        let merge=[
            ...detail_client.contacts,
            ...afterclearempty
        ]
        let new_relmanager=[]
        detail_client.relManagers.map((data)=>{
            new_relmanager.push(data.relManagerId)
        })
        
        let data={
            id:detail_client.client.id,
            company:detail_client.client.company,
            address1:detail_client.client.address1,
            address2:detail_client.client.address2,
            address3:detail_client.client.address3,
            phone:detail_client.phone,
            fax:detail_client.fax,
            website:detail_client.client.website,
            remarks:detail_client.client.remarks,
            industryId:detail_client.client.crmIndustryId,
            userId:this.props.profile.id,
            relManagerIds:new_relmanager,
            contacts:merge
        }
        let isFillAll=true
        afterclearempty.map((d)=>{
            if(d.valid!==undefined&&d.salutation!==undefined&&d.name!==''&&d.phone!==''&&d.department!==''){
                isFillAll=true
            }else{
                isFillAll=false
            }
        })
        // console.log(`isFillAll,afterclearempty`, isFillAll,afterclearempty)
        if(isFillAll){
            await this.props.updateClient(this.props.token,data)
            await this.props.getContact(this.props.token,detail_client.client.id)
            // this.props.modalToggleReset()
            this.props.modalToggle()
        }
       

        
    }
    onFocus=(emp,index)=>{
        let {employee}=this.state
        console.log('emp', emp)
        const last=employee.length

        if(!emp.is_active){
            let dummy={index:employee[last-1].index+1,name:'',email:'',phone:'',department:'',position:''}
            let new_data=[...employee,dummy]
            new_data[index].is_active=true
            this.setState({employee:new_data})
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
                    <FormControl variant="outlined" size="small" color='secondary' className='contact-field' >
                        <InputLabel  htmlFor="category">Valid<span style={{color:'red'}}>*</span></InputLabel>
                        <Select name="valid" value={emp.valid}  onChange={(e)=>this.onChange(e,i)}  labelId="label" id="select"  labelWidth={40} className='field-radius'>
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl variant="outlined" size="small" color='secondary' className='contact-field' >
                        <InputLabel  htmlFor="category">Salutation <span style={{color:'red'}}>*</span></InputLabel>
                        <Select  name="salutation"  value={emp.salutation} onChange={(e)=>this.onChange(e,i)} labelId="label" id="select"  labelWidth={75} className='field-radius'>
                            <MenuItem value="-">-</MenuItem>
                            <MenuItem value="Mr.">Mr.</MenuItem>
                            <MenuItem value="Ms.">Ms.</MenuItem>
                            <MenuItem value="Mrs.">Mrs.</MenuItem>
                            <MenuItem value="Dr.">Dr.</MenuItem>
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
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
                        />
                    </FormControl>
                    &nbsp;&nbsp;
                    <InputMask
                        mask="(+99)999-9999-9999"
                        maskChar={null}
                        onChange={(e)=>this.onChange(e,i)}
                        value={emp.phone}
                    >
                    {() =>
                         <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                         <InputLabel  htmlFor="phone_no">Phone No<span style={{color:'red'}}>*</span></InputLabel>
                         <OutlinedInput
                             
                             id="phone_no"
                            //  type='number'
                             name='phone'
                             required
                             labelWidth={75}
                             className='field-radius'
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
                        />
                    </FormControl>  
                    &nbsp;&nbsp;              
                    <FormControl color='secondary' variant="outlined" size="small" className='contact-field' >
                        <InputLabel  htmlFor="position">position</InputLabel>
                        <OutlinedInput
                             onFocus={()=>this.onFocus(emp,i)}
                             value={emp.position}
                             onChange={(e)=>this.onChange(e,i)}
                            id="position"
                            type='text'
                            name='position'
                            required
                            labelWidth={60}
                            className='field-radius'
                        />
                    </FormControl>  
                    <br/>
                    </div>              
                   
                
                ))}
                 <div className='modal-footer'>
                        <Button onClick={this.onClickSave}  size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded'>Save</Button>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return{
        client:state.client,
        master:state.master
    }
}
export default connect(mapStateToProps,{updateClient,getContact,modalToggleReset,modalToggleReset})(add_contact_detail)