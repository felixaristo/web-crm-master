import React,{Component} from 'react';
import {
    FormControl,InputLabel,OutlinedInput} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,
 } from '@material-ui/core/styles'
import InputMask from 'react-input-mask'
import {setRm,setEmp,setName,setIndustry,setPhoneNo,setAddres1,
    setFax,setWebsite,setRemarks,setAddres2,setAddres3,addClient,getRm,setListRm} from 'redux/actions/client'
import {connect} from 'react-redux'
import Select from 'react-select'

 const themeField = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#AFE597',
        },
    } 
})


class client_information extends Component {
    render() {
    const {list_industries,name,industry,phone_no,fax,address1,address2,address3,website,remarks}=this.props.client
    const {handleDisable}=this.props
        return (
            <div>
                <MuiThemeProvider theme={themeField}>
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="company_name">Client company name<span style={{color:'red'}}>*</span></InputLabel>
                        <OutlinedInput
                            disabled={handleDisable()}
                            value={name}
                            id="company_name"
                            type='text'
                            name='company_name'
                            onChange={(e)=>this.props.setName(e.target.value)}
                            required
                            labelWidth={170}
                            className='field-radius'
                        />
                    </FormControl>
                    <div style={{width:440,marginBottom:15}}>
                    {/* <AutoCompleteSelect
                        disabled={handleDisable()}
                        onChange={(event,value)=>this.props.setIndustry(value)}
                        options={list_industries}
                        getOptionLabel={(option) => option.label}
                        label={<>Industri</>}
                        value={list_industries.length>0&&new_industry[0]}
                    /> */}
                    <Select 
                        isDisabled={handleDisable()}
                        placeholder='Industri'
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                        style={{zIndex:10}}
                        options={list_industries} 
                        value={
                            list_industries.length>0&&list_industries.filter(option=>{return option.value===industry})
                        }
                        onChange={(data)=>this.props.setIndustry(data.value)}
                        theme={theme => ({
                            ...theme,
                            borderRadius: 10,
                            colors: {
                            ...theme.colors,
                            primary: '#AFE597',
                            zIndex:1000
                            },
                        })}
                    />
                    </div>
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="remarks">Remarks</InputLabel>
                        <OutlinedInput
                            disabled={handleDisable()}
                            value={remarks}
                            id="remarks"
                            type='text'
                            name='remarks'
                            onChange={(e)=>this.props.setRemarks(e.target.value)}
                            required
                            labelWidth={75}
                            className='field-radius'
                        />
                    </FormControl>
                    <InputMask
                        mask="(999)999-9999-999"
                        onChange={(e)=>this.props.setPhoneNo(e.target.value)}
                        value={phone_no}
                        // onChange={(e)=>setPhoneNo(e.target.value)}
                    >
                    {() =>
                        <FormControl variant="outlined" size="small"  className='form-request'>
                            <InputLabel  htmlFor="phone_no">Phone No.</InputLabel>
                            <OutlinedInput
                                disabled={handleDisable()}
                                
                                id="phone_no"
                                name='phone_no'
                                
                                required
                                labelWidth={80}
                                className='field-radius'
                            />
                        </FormControl>
                    }
                    </InputMask>
                    <InputMask
                        mask="(999)999-9999-999"
                        value={fax}

                        onChange={(e)=>this.props.setFax(e.target.value)}
                    >
                    {() =>
                        <FormControl variant="outlined" size="small"  className='form-request'>
                            <InputLabel  htmlFor="fax">Fax</InputLabel>
                            <OutlinedInput
                                disabled={handleDisable()}
                                id="fax"
                                name='fax'
                                // onChange={this.onChange}
                                required
                                labelWidth={40}
                                className='field-radius'
                            />
                        </FormControl>
                    }
                    </InputMask>
                    
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="website">Website</InputLabel>
                        <OutlinedInput
                            value={website}
                            disabled={handleDisable()}
                            id="website"
                            type='text'
                            name='website'
                            onChange={(e)=>this.props.setWebsite(e.target.value)}

                            required
                            labelWidth={70}
                            className='field-radius'
                        />
                    </FormControl>
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="address1">Address 1</InputLabel>
                        <OutlinedInput
                            value={address1}
                            disabled={handleDisable()}
                            id="address1"
                            type='text'
                            name='address1'
                            onChange={(e)=>this.props.setAddres1(e.target.value)}
                            disabled={handleDisable()}
                            required
                            labelWidth={80}
                            className='field-radius'
                            multiline
                        />
                    </FormControl>
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="address2">Address 2</InputLabel>
                        <OutlinedInput
                            value={address2}
                            disabled={handleDisable()}
                            id="address2"
                            type='text'
                            name='address2'
                            onChange={(e)=>this.props.setAddres2(e.target.value)}
                            disabled={handleDisable()}
                            required
                            labelWidth={80}
                            className='field-radius'
                            multiline
                        />
                    </FormControl>
                    <FormControl variant="outlined" size="small"  className='form-request'>
                        <InputLabel  htmlFor="address3">Address 3</InputLabel>
                        <OutlinedInput
                            value={address3}
                            disabled={handleDisable()}
                            id="address3"
                            type='text'
                            name='address3'
                            onChange={(e)=>this.props.setAddres3(e.target.value)}

                            required
                            labelWidth={80}
                            className='field-radius'
                            multiline
                        />
                    </FormControl>
                </MuiThemeProvider>
            </div>
        )
    }
}
const mapStateToProps=state=>{
    return{
        client:state.client,
        general:state.general
    }
}
const mapDispatchToProps={
    setRm,setEmp,
    setName,setIndustry,setPhoneNo,
    getRm,addClient,setAddres1,
    setFax,setWebsite,setRemarks,setAddres2,setAddres3,setListRm
}
export default connect(mapStateToProps,mapDispatchToProps)(client_information)