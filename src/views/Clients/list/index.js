import React, { Component } from 'react'
import '../style.css'
import {Button,FormControl,InputLabel,OutlinedInput,InputAdornment
,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import SearchImg from 'assets/icon/Search.png'
import filter from 'assets/icon/filter.svg'
import Eye from 'assets/icon/eye.png'
import Edit from 'assets/icon/edit.png'
import Close from 'assets/icon/close.svg'
import CevronRight from 'assets/icon/chevron-right.svg'
import CevronLeft from 'assets/icon/chevron-left.svg'
import {connect} from 'react-redux'
import Skeleton from 'components/Skeleton'
import { TablePagination } from '@trendmicro/react-paginations';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import {getClient,setSearch,setSearch2,detailClient,setClientAction,clearState,uploadCsv,getContact,exportContact} from 'redux/actions/client'
import {modalToggle} from 'redux/actions/general'
import {getMasterData} from 'redux/actions/master'
import {debounce} from 'lodash'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import Close2 from 'assets/icon/close2.svg'
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ff6e79',
            contrastText: '#FFFFFF',
        }
    } 
})
class index extends Component {
    state={
        page:1,
        pageLength:5,
        search:'',
        search2:'',

        file:null,
        file_error:null,
        file_name:'',
        file_size:'',
        change_file:false,

        downloaded:false,
        data_download:[]
    }
    componentDidMount(){
        const {client,}=this.props

        const {client_pagination,contact_filter}=client
        this.getClient()
        this.props.getMasterData(this.props.token)
        let fromMonth=contact_filter.periode.month>9?contact_filter.periode.month:`0${contact_filter.periode.month}`
        this.props.getContact(this.props.token,`/${contact_filter.periode.year}${contact_filter.periode.month}/${contact_filter.industry.value}/1/5/*`)
        this.props.exportContact(this.props.token,`/${contact_filter.periode.year}${contact_filter.periode.month}/${contact_filter.industry.value}`)
    }
    getClient=()=>{
        const {page,pageLength,search}=this.state
        const {client,}=this.props
        const {client_pagination,contact_filter,client_filter}=client
        if(client.list_client.length>0){
            // console.log('client_pagination', client_pagination)
            this.props.getClient(this.props.token,`/${client_filter.industry.value}/${client_filter.segment.value}/${client_filter.rm.value}/${client_pagination.page}/${client_pagination.perPage}/${client.search===''?'*':client.search}`)

        }else{
        this.props.getClient(this.props.token,`/${client_filter.industry.value}/${client_filter.segment.value}/${client_filter.rm.value}/${page}/${pageLength}/${client.search===''?'*':client.search}`)

        }
        
    }
    searchByType=debounce(async(value)=>{

        const {client,}=this.props
        const {client_pagination,client_filter}=client
        this.props.getClient(this.props.token,`/${client_filter.industry.value}/${client_filter.segment.value}/${client_filter.rm.value}/1/5/${client.search===''?'*':client.search}`)
    },1000)
    searchToggle=async(e)=>{
        let {value}=e.target
        const {client}=this.props
        
        await this.props.setSearch(value)
        if(client.search.length>0){
            this.searchByType(value)
        }
        
    }
    handleKeyPress = e => {
        if (e.key === "Enter") {
            //     this.setState(state => ({
            //         district: option
            //     }));
            // this.getClient();
            const {client,}=this.props
            const {client_pagination,contact_filter,client_filter}=client

            this.props.getClient(this.props.token,`/${client_filter.industry.value}/${client_filter.segment.value}/${client_filter.rm.value}/1/5/${client.search===''?'*':client.search}`)
        }
    };
    searchByType2=debounce(async(value)=>{
        const {client,}=this.props
        const {client_pagination,contact_filter}=client
        let fromMonth=contact_filter.periode.month>9?contact_filter.periode.month:`0${contact_filter.periode.month}`

        this.props.getContact(this.props.token,`/${contact_filter.periode.year}${contact_filter.periode.month}/${contact_filter.industry.value}/1/5/${value===''?'*':value}`)
    },1000)
    searchToggle2=async(e)=>{
        let {value}=e.target
        const {client}=this.props
        
        await this.props.setSearch2(value)
        if(client.search2.length>0){
            this.searchByType2(value)
        }
        
    }
    handleKeyPress2 = e => {
        if (e.key === "Enter") {
            const {client,}=this.props
            const {client_pagination,contact_filter}=client
            let fromMonth=contact_filter.periode.month>9?contact_filter.periode.month:`0${contact_filter.periode.month}`
    
            this.props.getContact(this.props.token,`/${contact_filter.periode.year}${contact_filter.periode.month}/${contact_filter.industry.value}/1/5/${e.target.value===''?'*':e.target.value}`)
        }
    };
    togglePagination=(page,pageLength)=>{
        console.log('pagination',pageLength)
        const {client,}=this.props
        this.setState({page,pageLength},()=>{
            this.props.getClient(this.props.token,`/${client.client_filter.industry.value}/${client.client_filter.segment.value}/${client.client_filter.rm.value}/${page}/${pageLength}/${client.search===''?'*':client.search}`)
        })

    }
    togglePagination2=(page,pageLength)=>{
        console.log('pagination',pageLength)
        const {client,}=this.props
        let fromMonth=client.contact_filter.periode.month>9?client.contact_filter.periode.month:`0${client.contact_filter.periode.month}`
        this.setState({page,pageLength},()=>{
            this.props.getContact(this.props.token,`/${client.contact_filter.periode.year}${client.contact_filter.periode.month}/${client.contact_filter.industry.value}/${page}/${pageLength}//${client.search2===''?'*':client.search2}`)
        })

    }
    addFilter=()=>{
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Filter Client`,
            modal_component: "filter_client",
            modal_size:300,
            modal_type:'add_filter',
            modal_data:null,
            modal_action:'add_filter'
        })
    }
    addFilterContact=()=>{
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Contact client filter`,
            modal_component: "contact_filter",
            modal_size:300,
            modal_type:'contact_filter',
            modal_data:null,
            modal_action:'contact_filter'
        })
    }
    addClient=()=>{
        this.props.tabToggle('add_client')
        this.props.clearState()
        this.props.setClientAction('add_client')

    }
    detailClient=async(id,action)=>{
        console.log('id', id)
        let res=await this.props.detailClient(this.props.token,id)
        if(res){
            this.props.setClientAction(action)
            this.props.tabToggle('add_client')
        }
    }
    deleteClient=(id,name)=>{
        console.log('id,name', id,name)
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `list`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'Client',
                id:id,
                userId:this.props.profile.id,
                msg:`<p>Delete <b>${name}</b> will impact to project or workshop connected to <b>${name}</b>. make sure you have downloaded file project or workshop.</p>`
            },
            modal_action:'delete_client'
        })
    }
    handleFile=(evt)=>{
        const file = evt.target.files[0];
        const fileTypes = ['csv'];

        if (evt.target.files && file) {
            const extension = evt.target.files[0].name.split('.').pop().toLowerCase();
            const isSuccess = fileTypes.indexOf(extension) > -1;
            console.log('is',isSuccess)
            if (isSuccess) {
                let size=this.formatBytes(file.size)
                this.setState({
                    file: file,
                    file_error: null,
                    file_size:size,
                    file_name:file.name
                });
            }
            else {
                let size=this.formatBytes(file.size)
                this.setState({
                    file_size:size,
                    file_name:file.name,
                    file: file,
                    file_error:'File type not allowed. File type to be must *.csv'
                })
            }
        }
    }
    formatBytes=(bytes, decimals = 2)=> {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    onClickSave=()=>{
        let {file}=this.state
        let fd= new FormData()
        fd.append('files',file)
        this.props.uploadCsv(this.props.token,fd)
    }
    editContact=(contact)=>{
        console.log('contact', contact)
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Edit client contact ${contact.company}`,
            modal_component: "contact",
            modal_size:1100,
            modal_type:'add_contact',
            modal_data:[contact],
            modal_action:'edit_contact_from_list'
        })
    }
    seeContact=(contact)=>{
        console.log('contact', contact)
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `See client contact ${contact.company}`,
            modal_component: "contact",
            modal_size:1100,
            modal_type:'add_contact',
            modal_data:[contact],
            modal_action:'see_contact'
        })
    }
    exportExcel=async ()=>{
        const {client}=this.props
        const {client_pagination,contact_filter}=client
        let fromMonth=client.contact_filter.periode.month>9?client.contact_filter.periode.month:`0${client.contact_filter.periode.month}`
        let res=await this.props.exportContact(this.props.token,`/${contact_filter.periode.year}${fromMonth}/${contact_filter.industry.value}`)
        if(res){
        //     this.setState({downloaded:!this.state.downloaded,data_download:res})
        //    setTimeout(()=>{
        //     this.setState({downloaded:false})
        //    },2000)
        //    this.renderDownload(res)
        return res.items
        //    console.log('res', res)
            // alert('asd')
        }
    }
    renderDownload=(res=[])=>{
        console.log('res', res)
        if(res.length>0){
            return(
                <ExcelFile hideElement={true}>
                    <ExcelSheet data={res.items} name="Employees">
                        <ExcelColumn label="INFO" value="info"/>
                        <ExcelColumn label="COMPANY" value="company"/>
                        <ExcelColumn label="EXECUTIVE" value="executive"/>
                        <ExcelColumn label="TITLE" value="title"/>
                        <ExcelColumn label="Department" value="department"/>
                        <ExcelColumn label="ADDRESSS 1" value="address1"/>
                        <ExcelColumn label="ADDRESSS 2" value="address2"/>
                        <ExcelColumn label="ADDRESSS 3" value="address3"/>
                        <ExcelColumn label="HP" value="hp"/>
                        <ExcelColumn label="HP 1" value="hP1"/>
                        <ExcelColumn label="HP 2" value="hP2"/>
                        <ExcelColumn label="PHONE" value="phone"/>
                        <ExcelColumn label="FAX" value="fax"/>
                        <ExcelColumn label="E-MAIL 1" value="email1"/>
                        <ExcelColumn label="E-MAIL 2" value="email2"/>
                        <ExcelColumn label="E-MAIL 3" value="email3"/>
                        <ExcelColumn label="E-MAIL 4" value="email4"/>
                        <ExcelColumn label="WEBSITE" value="website"/>
                        <ExcelColumn label="INDUSTRY" value="industry"/>
                        <ExcelColumn label="BIDANG USAHA" value="remarks"/>
                        
                    </ExcelSheet>
                </ExcelFile>
            )
        }
        
    }
    deleteContact=(contact)=>{
        const {employee}=this.props.client
        this.props.modalToggle({ 
            modal_open: true,
            modal_title: `Detail`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:'Contact',
                contact:contact,
                msg:`<p>Delete <b>${contact.name}</b> from database</p>`
            },
            modal_action:'delete_client_contact_from_list'
        })
    }
    render() {
        let {tabToggle,client,general}=this.props
        let {file,file_size,file_name,file_error}=this.state
        let fromMonth=client.contact_filter.periode.month>9?client.contact_filter.periode.month:`0${client.contact_filter.periode.month}`
        const multiDataSet = [
            {
                columns: [
                    {title: "Headings", width: {wpx: 80}},//pixels width 
                    {title: "Text Style", width: {wch: 40}},//char width 
                    {title: "Colors", width: {wpx: 90}},
                ],
                data: [
                    [
                        {value: "H1", style: {font: {sz: "24", bold: true}}},
                        {value: "Bold", style: {font: {bold: true}}},
                        {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
                    ],
                    [
                        {value: "H2", style: {font: {sz: "18", bold: true}}},
                        {value: "underline", style: {font: {underline: true}}},
                        {value: "Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FF0000FF"}}}},
                    ],
                    [
                        {value: "H3", style: {font: {sz: "14", bold: true}}},
                        {value: "italic", style: {font: {italic: true}}},
                        {value: "Green", style: {fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}}}},
                    ],
                    [
                        {value: "H4", style: {font: {sz: "12", bold: true}}},
                        {value: "strike", style: {font: {strike: true}}},
                        {value: "Orange", style: {fill: {patternType: "solid", fgColor: {rgb: "FFF86B00"}}}},
                    ],
                    [
                        {value: "H5", style: {font: {sz: "10.5", bold: true}}},
                        {value: "outline", style: {font: {outline: true}}},
                        {value: "Yellow", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}}}},
                    ],
                    [
                        {value: "H6", style: {font: {sz: "7.5", bold: true}}},
                        {value: "shadow", style: {font: {shadow: true}}},
                        {value: "Light Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}}
                    ]
                ]
            }
        ];
        console.log('this.state.download,this.state.data_download', client.contact_export)
        return (
            <div>
                {/* {this.state.downloaded&&
                } */}
                {/* {this.renderDownload()} */}
                 <div className='head-section'>
                    <div>
                        <h4><b>Client list</b></h4>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <MuiThemeProvider theme={themeButton}>
                        <Button onClick={()=>this.addClient()} size='small' color='primary' variant='contained' className='head-add-section__btn'>Add new client</Button>
                        
                        {file!==null?
                        <>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {file_error===null?
                        <div className='file-title'>
                            <h6><b>{file_name}</b>&nbsp; {file_size}</h6>
                        </div>
                        :
                        <div className='file-title'>
                            <img src={Close2}  style={{cursor:'pointer'}} onClick={()=>this.setState({file:null})}/>
                            &nbsp;&nbsp;
                        <h6><b>{file_name}</b>&nbsp; {file_size}<br/><span style={{color:'red'}}>{file_error}</span></h6>
                        </div>
                        }
                        <Button onClick={()=>this.onClickSave()} size='small' color='primary' variant='contained' className='head-add-section__btn'>Save</Button>
                        <Button component="label" size='small' color='secondary' variant='contained' className='head-add-section__btn'>
                            Change file
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={this.handleFile}
                            />
                        </Button>
                        </>
                        :
                        <Button  component="label" size='small' color='primary' variant='contained' className='head-add-section__btn'>
                            Upload client data
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={this.handleFile}
                            />
                        </Button>
                        }
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    value={client.search}
                                    id="input-with-icon-textfield"
                                    name='password'
                                    onChange={this.searchToggle}
                                    onKeyPress={e =>
                                        this.handleKeyPress(e)
                                    }
                                    required
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{display:'flex',alignItems:'center',}}>
                                {client.client_filter.industry.value!==0&&<p className='pipeline-filterby'><b>Industry: {client.client_filter.industry.label}</b>&nbsp;&nbsp;</p>}
                                {client.client_filter.segment.value!==0&&<p className='pipeline-filterby'><b>Segment: {client.client_filter.segment.label}</b>&nbsp;&nbsp;</p>}
                                {client.client_filter.rm.value!==0&&<p className='pipeline-filterby'><b>Relationship manager: {client.client_filter.rm.label}</b>&nbsp;&nbsp;</p>}
                                <button onClick={this.addFilter} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Company name</TableCell>
                                <TableCell align="left">Industry</TableCell>
                                <TableCell align="left">Address</TableCell>
                                <TableCell align="left">Phone No.</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable?
                                    <Skeleton count={5}/>
                                :
                                client.list_client.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.company}</TableCell>
                                        <TableCell >{data.industry}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.address}</TableCell>
                                        <TableCell >{data.phone}</TableCell>
                                        <TableCell style={{width:100,minHeight:100,}} align="right">
                                            <img src={Eye} onClick={()=>this.detailClient(data.id,'see_client')} className='icon-action'/>
                                            <img src={Edit} onClick={()=>this.detailClient(data.id,'edit_client')} className='icon-action'/>
                                            <img src={Close} onClick={()=>this.deleteClient(data.id,data.company)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))
                               
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                        {client.client_pagination!==null&&
                        <TablePagination
                                className="card-pagination"
                                type="reduced"
                                page={client.client_pagination.page}
                                pageLength={client.client_pagination.perPage}
                                totalRecords={client.client_pagination.total}
                                totalRecords={client.client_pagination.total}
                                onPageChange={({ page, pageLength }) => {
                                    this.togglePagination(page,pageLength)
                                }}
                                prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                nextPageRenderer={() => <img src={CevronRight}/>}
                            />
                        }
                    </div>
                       </div>
                   </div>
                </div>
                <div className='head-section'>
                    <div>
                        <h4><b>Contact client list</b></h4>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <MuiThemeProvider theme={themeButton}>
                        <ExcelFile filename={`contact-list-${client.contact_filter.periode.year}-${fromMonth}`} element={<Button size='small' color='primary' variant='contained' className='head-add-section__btn'>Export to excel</Button>}>
                    {/* <ExcelSheet data={client.contact_export} name="Employees">
                        <ExcelColumn label="INFO" value="info"/>
                        <ExcelColumn label="COMPANY" value="company"/>
                        <ExcelColumn label="EXECUTIVE" value="executive"/>
                        <ExcelColumn label="TITLE" value="title"/>
                        <ExcelColumn label="Department" value="department"/>
                        <ExcelColumn label="ADDRESSS 1" value="address1"/>
                        <ExcelColumn label="ADDRESSS 2" value="address2"/>
                        <ExcelColumn label="ADDRESSS 3" value="address3"/>
                        <ExcelColumn label="HP" value="hp"/>
                        <ExcelColumn label="HP 1" value="hP1"/>
                        <ExcelColumn label="HP 2" value="hP2"/>
                        <ExcelColumn label="PHONE" value="phone"/>
                        <ExcelColumn label="FAX" value="fax"/>
                        <ExcelColumn label="E-MAIL 1" value="email1"/>
                        <ExcelColumn label="E-MAIL 2" value="email2"/>
                        <ExcelColumn label="E-MAIL 3" value="email3"/>
                        <ExcelColumn label="E-MAIL 4" value="email4"/>
                        <ExcelColumn label="WEBSITE" value="website"/>
                        <ExcelColumn label="INDUSTRY" value="industry"/>
                        <ExcelColumn label="BIDANG USAHA" value="remarks"/>
                        
                    </ExcelSheet> */}
                    <ExcelSheet dataSet={client.contact_export} name={`contact-list-${client.contact_filter.periode.year}-${fromMonth}`}/>
                </ExcelFile>
                            
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    value={client.search2}
                                    id="input-with-icon-textfield"
                                    name='password'
                                    onChange={this.searchToggle2}
                                    onKeyPress={e =>
                                        this.handleKeyPress2(e)
                                    }
                                    required
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{display:'flex',alignItems:'center',}}>
                                <p className='pipeline-filterby'><b>Input period: {client.contact_filter.textPeriode}</b></p>&nbsp;&nbsp;
                                <p className='pipeline-filterby'><b>Industry: {client.contact_filter.industry.label}</b></p>&nbsp;&nbsp;
                                <button onClick={this.addFilterContact} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Company name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Phone No.</TableCell>
                                <TableCell align="left">Department</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                            
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable2?
                                    <Skeleton count={6}/>
                                :
                                client.contact.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.name}</TableCell>
                                        <TableCell title={data.company}>{data.company.length>10?`${data.company.substring(0,10)}...`:data.company}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.email}</TableCell>
                                        <TableCell title={data.phone} >{data.phone}</TableCell>
                                        <TableCell >{data.department}</TableCell>
                                        <TableCell style={{width:100,minHeight:100,}} align="right">
                                            <img src={Eye} onClick={()=>this.seeContact(data,'see_contact')} className='icon-action'/>
                                            <img src={Edit} onClick={()=>this.editContact(data,'edit_client')} className='icon-action'/>
                                            <img src={Close} onClick={()=>this.deleteContact(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))
                               
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                        {client.contact_pagination!==null&&
                        <TablePagination
                                className="card-pagination"
                                type="reduced"
                                page={client.contact_pagination.page}
                                pageLength={client.contact_pagination.perPage}
                                totalRecords={client.contact_pagination.total}
                                totalRecords={client.contact_pagination.total}
                                onPageChange={({ page, pageLength }) => {
                                    this.togglePagination2(page,pageLength)
                                }}
                                prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                nextPageRenderer={() => <img src={CevronRight}/>}
                            />
                        }
                    </div>
                       </div>
                   </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general,
    client:state.client
})
const mapDispatchToProps={
    // addClient
    setSearch,
    setSearch2,
    getClient,
    modalToggle,
    detailClient,
    setClientAction,
    clearState,
    uploadCsv,
    getMasterData,
    getContact,
    exportContact
}
export default connect(mapStateToProps,mapDispatchToProps)(index)