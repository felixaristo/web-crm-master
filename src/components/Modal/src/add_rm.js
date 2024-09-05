import React, { Component } from 'react'
import {Button,Collapse,FormControl,InputLabel,MenuItem,Divider,
OutlinedInput,InputAdornment,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import {FilterList} from '@material-ui/icons'
import SearchImg from 'assets/icon/Search.png'

import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import {connect}  from 'react-redux'
import {setRm,setListRm} from 'redux/actions/client'
import {modalToggleReset} from 'redux/actions/general'
import Select from 'react-select'

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
class add_rm extends Component {
    state={
        rm:this.props.client.list_rm,
        filter:false,
        filter_branch:[],
        search:'',
        filter_segment:[],
    }
    componentDidMount(){
        const {modal_data}=this.props
        // console.log('modal_data', modal_data)
        if(modal_data!==null){
            this.setState({rm:modal_data})
        }
    }
    handleDisable=()=>{
        const {modal_action}=this.props
        if(modal_action==='add_rm'){
            return false
        }else{
            return true
        }
    }
    search=(e)=>{
        let {search,rm}=this.state
        const { value } = e.target
        // console.log('e.target.value', e.target.value)
        this.setState({search:value})
        if(search.length>0){
            let searchresult=this.props.client.list_rm.filter(data=>{
                return data.name.match(value)
            })
            this.setState({rm:searchresult})
            console.log('searchresult', searchresult)
        }else{
            this.setState({rm:this.props.client.list_rm})

        }
    }
    filterToggle=()=>{
        this.setState({filter:!this.state.filter})
    }
    setRm=(rm)=>{
        const {selected_rm,list_rm}=this.props.client
        let new_data=[...selected_rm,rm]
        let remove_after_choose=list_rm.filter((list)=>{
            return list.id!==rm.id
        })
        this.props.setListRm(remove_after_choose)
        this.props.setRm(new_data)
        this.props.modalToggleReset()
    }
    onChangeFilter=(option,name)=>{
        if(name.name==='branch'){
            this.setState({filter_branch:option})
        }else{
            this.setState({filter_segment:option})
        }
    }
    render() {
        const {filter,rm}=this.state
        const {client}=this.props
        console.log('client', client)
        return (
            <div>
                <MuiThemeProvider theme={themeButton}>
                <div className='rm-filter'>
                    
                    <div className='rm-filter-by'>
                        <p><b>Filter By</b></p>
                        &nbsp;&nbsp;
                        <p>All Branch</p>
                        &nbsp;&nbsp;
                        <p>All Segment</p>
                    </div>
                    <div className='rm-filter-btn'>
                            <Button
                                className='btn-remove-capital btn-rounded btn-flat-height'
                                variant="contained"
                                startIcon={<FilterList />}
                                color='primary'
                                onClick={this.filterToggle}
                                disabled={this.handleDisable()}
                            >
                                Filter
                            </Button>
                    </div>
                </div>
                <Collapse in={filter}>
                    <br/>
                    <div style={{display:'flex'}}>
                    <div style={{width:200}}>
                    <Select 
                        placeholder='Branch'
                        options={client.list_branch} 
                        isClearable={true}
                        isMulti
                        // value={client.list_segments!==null&&client.list_segments.filter(option=>{return option.value===event.event_id})}
                        // onChange={(data)=>this.props.setEventId(data.value)}
                        theme={theme => ({
                            ...theme,
                            borderRadius: 10,
                            colors: {
                            ...theme.colors,
                            primary: '#ffb100',
                            },
                        })}
                    />
                    </div>
                    &nbsp;
                    <div style={{width:200}}>
                    <Select 
                        placeholder='Segment'

                        options={client.list_segments} 
                        isClearable={true}
                        isMulti
                        // value={client.list_segments!==null&&client.list_segments.filter(option=>{return option.value===event.event_id})}
                        // onChange={(data)=>this.props.setEventId(data.value)}
                        theme={theme => ({
                            ...theme,
                            borderRadius: 10,
                            colors: {
                            ...theme.colors,
                            primary: '#ffb100',
                            },
                        })}
                    />
                    </div>
                    </div>
                </Collapse>
                <br/>
                <Divider/>
                <br/>
                <FormControl variant="outlined" color='secondary'>
                    <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                    <OutlinedInput
                        size='small'
                        disabled={this.handleDisable()}
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
                        labelWidth={50}
                    />
                </FormControl>
                <br/>
                <div className='rm-table'>
                <Table  size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow style={{backgroundColor:'white'}}>
                        <TableCell>Name</TableCell>
                        <TableCell >Email</TableCell>
                        <TableCell >Branch</TableCell>
                        <TableCell >Segment</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rm.map((rm,i)=>(
                        <TableRow key={i}>
                            <TableCell>{rm.name}</TableCell>
                            <TableCell>{rm.email}</TableCell>
                            <TableCell>{rm.branch}</TableCell>
                            <TableCell>{rm.segment}</TableCell>
                            <TableCell>
                            <Button
                                className='btn-remove-capital btn-rounded btn-flat-height'
                                variant="contained"
                                color='primary'
                                onClick={()=>this.setRm(rm)}
                                disabled={this.handleDisable()}
                            >
                                Choose
                            </Button>
                            </TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <br/>
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
const mapDispatchToProps={
    setRm,modalToggleReset,setListRm
}
export default connect(mapStateToProps,mapDispatchToProps)(add_rm)