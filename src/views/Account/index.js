import React,{useState,useEffect,useRef} from 'react'
import Layout from 'components/Layouts'
import { useDispatch, useSelector } from "react-redux";
import {Button,FormControl,InputLabel,Select,MenuItem,OutlinedInput,InputAdornment
    ,Table,TableHead,TableCell,TableRow,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import './style.css'
import LevelUp from 'assets/icon/LevelUp.svg'
import LevelDown from 'assets/icon/LevelDown.svg'
import Equal from 'assets/icon/Equal.svg'
import filter from 'assets/icon/filter.svg'
import close from 'assets/icon/close.svg'
import {getMasterData,tabToggle,getEmployee,getContact} from 'redux/actions/master'
import {setSalesVisit,setProposal} from 'redux/actions/pipeline'
import {getDetailTarget,getTeamReportMentor,getTargetStatus,getTeamReportLeader,getSummaryReport,getChart,getSalesVisit,getProposal,setVisitSearch,getVisitExcel,getProposalExcel,getProposalTeam,getProposalTeamExcel} from 'redux/actions/account'
import NumberFormat from 'react-number-format';
import Skeleton  from 'react-loading-skeleton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Chart from 'react-apexcharts'
import moment from 'moment'
import { TablePagination } from '@trendmicro/react-paginations';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import SearchImg from 'assets/icon/Search.png'
import Picker from 'react-month-picker'
import { DatePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import Excel from 'assets/icon/Excel.svg'
import Eye from 'assets/icon/eye.png'
import Edit from 'assets/icon/edit.png'
import CevronRight from 'assets/icon/chevron-right.svg'
import CevronLeft from 'assets/icon/chevron-left.svg'
import {debounce} from 'lodash'
import { modalToggle } from 'redux/actions/general';
import Cookie from 'universal-cookie'
import { getExcelRm } from 'redux/actions/rm';
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import 'react-month-picker/css/month-picker.css';

const cookie = new Cookie()
let profile=cookie.get('profile_cookie')
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ffb100',
            // contrastText: '#FFFFFF',
            contrastText: '#777777',
        }
    } 
})
const MonthBox=(props)=>{
    const _handleClick=(e)=> {
        props.onClick && props.onClick(e);
    }
    return(
        <div className='div-flex' onClick={_handleClick}>
            <p className='semi-bold-nomargin'>Periode : {props.textPeriode}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={()=>_handleClick()} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
        </div>
    )
}
export default function Index(props) {
    const dispatch=useDispatch()

    const master=useSelector(state=>state.master)
    const account=useSelector(state=>state.account)
    const general=useSelector(state=>state.general)
    const [open_picker,setOpen]=useState(false)
    // const [visit_search,setVisitSearch]=useState('')
    const [proposal_search,setProposalSearch]=useState('')
    const [visit_pagination,setVisitPagination]=useState({
        page:1,
        pageSize:5
    })
    const [proposal_pagination,setProposalPagination]=useState({
        page:1,
        pageSize:5
    })

    const [filter_chart,setFilterChart]=useState(moment())

    //fitur pic here
    const [search_salesvisit, setsearch_salesvisit] = useState('')
    const [filter_salesvisit, setfilter_salesvisit] = useState({
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
    })

    const [search_proposal, setsearch_proposal] = useState('')
    const [filter_proposal, setfilter_proposal] = useState({
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
    })

    const [search_proposal_team, setsearch_proposal_team] = useState('')
    const [filter_proposal_team, setfilter_proposal_team] = useState({
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:1}, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}},
        textPeriode:`Jan. ${moment().format('YYYY')} - ${moment().format('MMM')}. ${moment().format('YYYY')}`,
        periode:{fromMonth:1,toMonth:parseInt(moment().format('M'))},
    })
    //end fitur pic

    let {filter_sales_visit,filter_sales_visit_mentor,report_leader,report_mentor,target_status,proposal_team,proposal_team_pagination}=account
    useEffect(()=>{
        dispatch(getSummaryReport(props.token,`/${props.profile.id}/${moment().format('MM')}/${moment().format('YYYY')}`))
        getChartReport()
        getSalesVisitAccount()
        getProposalAccount()
        getPicProposalTeam()
        getTeamLeader(`/${props.profile.id}/${filter_sales_visit_mentor.periode.fromMonth}/${filter_sales_visit_mentor.periode.toMonth}/${filter_sales_visit_mentor.rangeValue.from.year}/0`)
        getTeamMentor(`/${props.profile.id}/${filter_sales_visit_mentor.periode.fromMonth}/${filter_sales_visit_mentor.periode.toMonth}/${filter_sales_visit_mentor.rangeValue.from.year}/0`)
        dispatch(getTargetStatus(`/${moment(filter_chart).year()}/${props.profile.id}`))
    },[])
    
    const renderLoading=()=>{
        return(
            <div className='card-wrapper-report'>
                <div className='card-report'>
                    <p className='semi-bold'><Skeleton/></p>
                    <p>
                        <Skeleton/>
                    </p>
                    <p>
                        <Skeleton/>
                    </p>
                    
                </div>
                <div className='card-report'>
                    <p className='semi-bold'><Skeleton/></p>
                    <p>
                        <Skeleton/>
                    </p>
                    <p>
                        <Skeleton/>
                    </p>
                    
                </div>
                <div className='card-report'>
                    <p className='semi-bold'><Skeleton/></p>
                    <p>
                        <Skeleton/>
                    </p>
                    <p>
                        <Skeleton/>
                    </p>
                    
                </div>
            </div>
        )
    }
    const getChartReport=(slug=`/${props.profile.id}/01/12/${filter_chart.format('YYYY')}`)=>{
        dispatch(getChart(props.token,slug))
    }
    const getSalesVisitAccount=(slug=`/${props.profile.id}/${filter_salesvisit.rangeValue.from.month}/${filter_salesvisit.rangeValue.to.month}/${filter_salesvisit.rangeValue.from.year}/1/5/*`)=>{
        dispatch(getSalesVisit(props.token,slug))
    }
    const getProposalAccount=(slug=`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/1/5/*`)=>{
        dispatch(getProposal(props.token,slug))
    }
    const getPicProposalTeam=(slug=`/${props.profile.id}/${filter_proposal_team.rangeValue.from.month}/${filter_proposal_team.rangeValue.to.month}/${filter_proposal_team.rangeValue.from.year}/1/5/*`)=>{
        dispatch(getProposalTeam(props.token,slug))
    }
    const onChangeFilter=(date)=>{
        setFilterChart(date)
        getChartReport(`/${props.profile.id}/01/12/${date.format('YYYY')}`)
        // getSalesVisitAccount(`/${props.profile.id}/${date.format('YYYY')}/1/5/*`)
        // getProposalAccount(`/${props.profile.id}/${date.format('YYYY')}/1/5/*`)
        dispatch(getTargetStatus(`/${date.format('YYYY')}/${props.profile.id}`))
    }
    const exportVisit=()=>{
        dispatch(getVisitExcel(props.token,`/${props.profile.id}/${filter_salesvisit.rangeValue.from.month}/${filter_salesvisit.rangeValue.to.month}/${filter_salesvisit.rangeValue.from.year}/${search_salesvisit===''?'*':search_salesvisit}`))
    }
    const exportProposal=()=>{
        dispatch(getProposalExcel(props.token,`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/${search_proposal===''?'*':search_proposal}`))
    }
    const exportTeamProposal=()=>{
        dispatch(getProposalTeamExcel(props.token,`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/${search_proposal_team===''?'*':search_proposal_team}`))
    }
    const editVisit=async(data)=>{
        let res=await dispatch(getContact(props.token,data.companyId))
        if(res){
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))

            }
            let new_rm=[]
            let new_consultan=[]
            data.rms.map((data)=>{
                new_rm.push({label:data.text,value:data.id})
            })
            data.cons.map((data)=>{
                new_consultan.push({label:data.text,value:data.id})
            })
            dispatch(setSalesVisit({visitDate:data.visitDate}))
            dispatch(setSalesVisit({startTime:data.visitDate}))
            dispatch(setSalesVisit({endTime:data.visitDate}))
            dispatch(setSalesVisit({contacts:data.contacts}))
            dispatch(setSalesVisit({rms:new_rm}))
            dispatch(setSalesVisit({consultants:new_consultan}))
            dispatch(setSalesVisit({location:data.location}))
            dispatch(setSalesVisit({objective:data.objective}))
            dispatch(setSalesVisit({nextStep:data.nextStep}))
            dispatch(setSalesVisit({remark:data.remarks}))
            dispatch(setSalesVisit({id:data.visitId}))
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `Sales Visit to ${data.company}`,
                modal_component: "sales_visit",
                modal_data:{
                    dealId:data.dealId,
                    ...data
                } ,
                modal_size:500,
                modal_action:'edit_sales_visit'
            }))
        }
        
    }
    const seeVisit=(data)=>{
        let new_rm=[]
            let new_consultan=[]
            data.rms.map((data)=>{
                new_rm.push({label:data.text,value:data.id})
            })
            data.cons.map((data)=>{
                new_consultan.push({label:data.text,value:data.id})
            })
            dispatch(setSalesVisit({visitDate:data.visitDate}))
            dispatch(setSalesVisit({startTime:data.visitDate}))
            dispatch(setSalesVisit({endTime:data.visitDate}))
            dispatch(setSalesVisit({contacts:data.contacts}))
            dispatch(setSalesVisit({rms:new_rm}))
            dispatch(setSalesVisit({consultants:new_consultan}))
            dispatch(setSalesVisit({location:data.location}))
            dispatch(setSalesVisit({objective:data.objective}))
            dispatch(setSalesVisit({nextStep:data.nextStep}))
            dispatch(setSalesVisit({remark:data.remarks}))
            dispatch(setSalesVisit({id:data.visitId}))
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `Detail visit ${data.company}`,
                modal_component: "sales_visit",
                modal_data:{
                    dealId:data.dealId,
                    ...data
                } ,
                modal_size:500,
                modal_action:'see_sales_visit'
            }))
    }
    const seeProposal=(data)=>{
        let sentById=master.rm.filter((rm)=>{
            return rm.value===data.sentById
        })
        dispatch(setProposal({userId:props.profile.id}))
        dispatch(setProposal({typeId:data.type==='Workshop'?1:2}))
        dispatch(setProposal({sentById:sentById[0]}))
        dispatch(setProposal({sendDate:data.sentDate}))
        dispatch(setProposal({contactIds:data.receiverClients}))
        dispatch(setProposal({filename:data.filename}))
        dispatch(setProposal({proposalValue:data.proposalValue}))
        dispatch(setProposal({invoices:data.invoices}))
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Detail Proposal for ${data.name}`,
            modal_component: "proposal",
            modal_data:null ,
            modal_size:550,
            modal_action:'see_proposal',
            modal_type:'multi'
        }))

    }
    const togglePagination=(page,pageLength,key)=>{
        if(key==='visit'){
            setVisitPagination({
                page:page,
                pageSize:pageLength
            })
            getSalesVisitAccount(`/${props.profile.id}/${filter_salesvisit.rangeValue.from.month}/${filter_salesvisit.rangeValue.to.month}/${filter_salesvisit.rangeValue.from.year}/${page}/${pageLength}/*`)
        }else if(key=='proposal_team'){
            getPicProposalTeam(`/${props.profile.id}/${filter_proposal_team.rangeValue.from.month}/${filter_proposal_team.rangeValue.to.month}/${filter_proposal_team.rangeValue.from.year}/${page}/${pageLength}/*`)

        }else{
            setProposalPagination({
                page:page,
                pageSize:pageLength
            })
            getProposalAccount(`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/${page}/${pageLength}/*`)
        }

    }
    const searchSalesVisit=debounce(async (value)=>{
        setsearch_salesvisit(value)
        getSalesVisitAccount(`/${props.profile.id}/${filter_salesvisit.rangeValue.from.month}/${filter_salesvisit.rangeValue.to.month}/${filter_salesvisit.rangeValue.from.year}/1/5/${value===''?'*':value}`)
    },1000)
    const searchProposal=debounce(async (value)=>{
        setsearch_proposal(value)
        getProposalAccount(`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/1/5/${value===''?'*':value}`)
    },1000)
    const searchTeamProposal=debounce(async (value)=>{
        setsearch_proposal_team(value)
        getPicProposalTeam(`/${props.profile.id}/${filter_proposal.rangeValue.from.month}/${filter_proposal.rangeValue.to.month}/${filter_proposal.rangeValue.from.year}/1/5/${value===''?'*':value}`)
    },1000)

    
    const renderTargetColor=(target_status)=>{
        if(target_status==='Need approval'||target_status==='Targets not set.'){
            return '#ffb100'
        }
        if(target_status==='Targets approved'){
            return '#70bf4e'

        }
        if(target_status==='Targets rejected'){
            return 'rgb(255, 110, 121)'
        }
        
    }
    const addTarget=async ()=>{
        if(target_status==='Need approval'||target_status==='Targets approved'){
            let res= await dispatch(getDetailTarget(`/${moment(filter_chart).year()}/${props.profile.id}`))
            if(res){
                dispatch(modalToggle({
                    modal_open: true,
                    modal_title: `${profile.name} Target`,
                    modal_component: "target_individual",
                    modal_data:{...res.data,self_target:true,name:profile.name,cancelAction:()=>addTarget()} ,
                    modal_size:780,
                    modal_action:'detail_target_individual'
                }))
            }
            
        }else{
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `${profile.name} Target`,
                modal_component: "target_individual",
                modal_data:null ,
                modal_size:780,
                modal_action:'add_target_individual'
            }))
        }
        
    }
    const getTeamLeader=(slug)=>{
        dispatch(getTeamReportLeader(slug))
        
    }
    const getTeamMentor=(slug)=>{
        dispatch(getTeamReportMentor(slug))
    }
    const filterSalesVisitLeader=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Filter Sales Visit`,
            modal_component: "filter_sales_visit",
            modal_data:{
                action:(slug)=>getTeamLeader(slug)
            } ,
            modal_size:300,
            modal_action:'filter_sales_visit'
        }))
    }
    const filterSalesVisitMentor=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Filter Sales Visit`,
            modal_component: "filter_sales_visit_mentor",
            modal_data:{
                action:(slug)=>getTeamMentor(slug)
            } ,
            modal_size:300,
            modal_action:'filter_sales_visit_mentor'
        }))
    }
    const renderTribeFilter=()=>{
        let new_tribes=[]
        filter_sales_visit.tribes.map((data)=>{
            new_tribes.push(data.text)
        })
        if(new_tribes.length>0){
            return `${new_tribes.join(' , ')}`
        }else{
            return 'All Tribes'
        }
    }
    const renderTribeFilterMentor=()=>{
        let new_tribes=[]
        filter_sales_visit_mentor.tribes.map((data)=>{
            new_tribes.push(data.text)
        })
        if(new_tribes.length>0){
            return `${new_tribes.join(' , ')}`
        }else{
            return 'All Tribes'
        }
    }
    const renderStatusColor=(status)=>{
        if(status==='Need approval'||status==='Targets not set.'){
            return '#ffb100'
        }
        if(status==='Targets approved'){
            return '#70bf4e'

        }
        if(status==='Targets rejected'){
            return 'rgb(255, 110, 121)'
        }
    }
    const approveTarget=async (data)=>{
        let res= await dispatch(getDetailTarget(`/${data.year}/${data.user.id}`))
        if(res){
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `${data.user.text} Target`,
                modal_component: "target_individual",
                modal_data:{...res.data,name:data.user.text,cancelAction:()=>approveTarget(),year:data.year} ,
                modal_size:780,
                modal_action:'detail_target_individual'
            }))
        }
    }
    const renderTitleTargetBtn=()=>{
        
        if(target_status==='Need approval'||target_status==='Targets approved'){
            return 'Detail Target'
        }else{
            return 'Add Target'
        }
    }
    const getExcel=(data)=>{
        dispatch(getExcelRm(`/${data.user.id}/${moment().year()}/*`,data.user.text))
    }
    const exportTeam=async (data)=>{
        const wb = new ExcelJS.Workbook()

        const sheet1 = wb.addWorksheet(data.teamName);
        let header=['No','Name','Authority','No.Proposal','Sales Visit','Proposal Value','Sales','Status']

        var borderStyles = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        sheet1.getRow(1).values=header

        sheet1.columns=[
            {key:'no',width:5},
            {key:'name',width:30},
            {key:'authority',width:20},
            {key:'nProposals',width:15},
            {key:'visits',width:15},
            {key:'proposalValue',width:15},
            {key:'sales',width:15},
            {key:'status',width:20},
        ]
        data.items.map((data,i)=>{
            sheet1.addRow({
                no:i+1,
                name:data.user.text,
                authority:data.authority,
                nProposals:data.nProposals,
                visits:data.visits,
                proposalValue:data.proposalValue,
                sales:data.sales,
                status:data.status,
            })
        })
        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `${data.teamName}.xlsx`)
    }

    const pickRange=useRef(null)
    const pickRange2=useRef(null)
    const pickRange3=useRef(null)
    const pickerLang = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        from: 'From', to: 'To',
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    const makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
        return '?'
    }
    const _handleClickRangeBox=(e)=>{
        pickRange.current.show()
    }
    const _handleClickRangeBox2=(e)=>{
        pickRange2.current.show()
    }
    const _handleClickRangeBox3=(e)=>{
        pickRange3.current.show()
    }
    const handleRangeDissmis=(value)=> {
        let fromMonth=value.from.month
        let toMonth=value.to.month
        setfilter_salesvisit({
            ...filter_salesvisit,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        getSalesVisitAccount(`/${props.profile.id}/${value.from.month}/${value.to.month}/${value.from.year}/${1}/${5}/*`)
    }
    const handleRangeDissmis2=(value)=> {
        let fromMonth=value.from.month
        let toMonth=value.to.month
        setfilter_proposal({
            ...filter_proposal,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        getProposalAccount(`/${props.profile.id}/${value.from.month}/${value.to.month}/${value.from.year}/${1}/${5}/*`)
    }
    const handleRangeDissmis3=(value)=> {
        let fromMonth=value.from.month
        let toMonth=value.to.month
        setfilter_proposal_team({
            ...filter_proposal_team,
            periode:{fromMonth:fromMonth,toMonth:toMonth},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1] + '. ' + value.from.year + ' - '+pickerLang.months[value.to.month-1] + '. ' + value.to.year
        })
        getPicProposalTeam(`/${props.profile.id}/${value.from.month}/${value.to.month}/${value.from.year}/${1}/${5}/*`)
    }


    
    let {report_summary,report_excel}=account
    return (
        <div>
            <Layout>
                <MuiThemeProvider theme={themeButton}>
                <div className='div-flex div-space-between'>
                    <h4 className='head-title'>Individual Sales Report</h4>
                </div>
                <div  >
                {report_summary.length>0?
                        <div className='card-account-wrapper-report'>
                            <div className='card-account-report'>
                                <p className='semi-bold'>{report_summary[0].title}</p>
                                <h4 style={{height:30}} className={report_summary[0].percent===0?'color-yellow':report_summary[0].percent>0?'color-green':'color-red'}>
                                    <NumberFormat value={report_summary[0].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[0].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[0].percent===0?Equal:report_summary[0].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[0].note}</p>
                                    
                                </div>
                            </div>
                            <div className='card-report'>
                                <p className='semi-bold'>{report_summary[1].title}</p>
                                <h4 style={{height:30}} className={report_summary[1].percent===0?'color-yellow':report_summary[1].percent>0?'color-green':'color-red'}>
                                    <NumberFormat value={report_summary[1].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[1].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[1].percent===0?Equal:report_summary[1].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[1].note}</p>
                                </div>
                            </div>

                            <div className='card-report'>
                                <p className='semi-bold'>{report_summary[2].title}</p>
                                <h4 className={report_summary[2].percent===0?'color-yellow':report_summary[2].percent>0?'color-green':'color-red'}>
                                    IDR&nbsp; <NumberFormat value={report_summary[2].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[2].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[2].percent===0?Equal:report_summary[2].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[2].note}</p>
                                </div>
                            </div>
                            <div className='card-report'>
                                <p className='semi-bold'>{report_summary[3].title}</p>
                                <h4 className={report_summary[3].percent===0?'color-yellow':report_summary[3].percent>0?'color-green':'color-red'}>
                                    IDR&nbsp; <NumberFormat value={report_summary[3].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[3].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[3].percent===0?Equal:report_summary[3].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[3].note}</p>
                                </div>
                            </div>

                        </div>
                    :renderLoading()}
                    <br/>
                    <div className='report-header' >
                        <div style={{display:'flex',alignItems:'center'}}>
                            <p style={{display:'flex',alignItems:'center',fontSize:12,color:'#777777',fontWeight:'bold'}}>
                                <span><div style={{width:10,height:10,borderRadius:'50%',backgroundColor:'#70bf4e'}}></div></span>
                                &nbsp;&nbsp;
                                Target
                            </p>
                            &nbsp;&nbsp;&nbsp;
                            <p style={{display:'flex',alignItems:'center',fontSize:12,color:'#777777',fontWeight:'bold'}}>
                                <span><div style={{width:10,height:10,borderRadius:'50%',backgroundColor:'#3B99EB'}}></div></span>
                                &nbsp;&nbsp;
                                Actual
                            </p>
                            &nbsp;&nbsp;&nbsp;

                            <p style={{fontWeight:"bold",fontSize:14,color:renderTargetColor(target_status)}}>{target_status}</p>
                        </div>
                        <div style={{display:'flex',alignItems:'center',marginBottom:15}}>
                            <p className='bold'>Year : {filter_chart.format('YYYY')}</p>&nbsp;&nbsp;&nbsp;
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                // disableFuture
                                openTo="year"
                                format="dd/MM/yyyy"
                                label="Date of birth"
                                views={["year"]}
                                value={filter_chart}
                                onChange={(date)=>onChangeFilter(date)}
                                open={open_picker}
                                onAccept={()=>setOpen(!open_picker)}
                                onClose={()=>setOpen(!open_picker)}
                                TextFieldComponent={()=>(
                                    <>
                                    <button onClick={()=>setOpen(!open_picker)} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
                                    </>
                                )}
                            />
                            </MuiPickersUtilsProvider>
                            <button onClick={()=>addTarget()} className='card-table__head_btn'>{renderTitleTargetBtn()}</button>
                            </div>
                    </div>
                    {account.chart.length>0&&
                    <div className='graph-grid'>
                        {/* {account.chart.map((data,i)=>(
                            <div className='graph-card'>
                                <p className='semi-bold'>{data.title}</p>
                                <Chart options={data.options} series={data.series} type="area" width={400} height={200} />
                            </div>
                        ))} */}
                        <div className='graph-card'>
                            <p className='semi-bold'>No. Proposals</p>
                            <Chart options={account.chart[0].options} series={account.chart[0].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Sales visit</p>
                            <Chart options={account.chart[2].options} series={account.chart[2].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Proposal value</p>
                            <Chart options={account.chart[1].options} series={account.chart[1].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Sales</p>
                            <Chart options={account.chart[3].options} series={account.chart[3].series} type="area" width='100%' height={200} />

                        </div>
                    </div>}
                    <br/>
                    <div className='card-content'>
                    <div style={{padding:'10px 10px 0px 20px'}}>
                        <p className='bold'>Sales visit</p>

                    </div>
                    <div className='card-table'>
                       <div className='card-table__head' style={{position:'relative'}}>
                       
                            
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    id="input-with-icon-textfield"
                                    onChange={(e)=>searchSalesVisit(e.target.value)}
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{position:'absolute',top:0,left:100}}>
                                <Picker
                                    style={{marginLeft:-100}}
                                    ref={pickRange}
                                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                                    value={filter_salesvisit.rangeValue}
                                    lang={pickerLang}
                                    theme="light"
                                    onChange={()=>null}
                                    onDismiss={handleRangeDissmis}
                                    >
                                </Picker>
                            </div>
                            <div className='div-flex div-align-center'>
                                <MonthBox textPeriode={filter_salesvisit.textPeriode} value={makeText(filter_salesvisit.rangeValue.from) + ' - ' + makeText(filter_salesvisit.rangeValue.to)} onClick={_handleClickRangeBox} />
                                <button onClick={()=>exportVisit()}   className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>

                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">Company</TableCell>
                                <TableCell align="left">Visit Date</TableCell>
                                <TableCell align="left">Location</TableCell>
                                <TableCell align="left">Visit Objective</TableCell>
                                <TableCell align="left">Nexstep</TableCell>
                                <TableCell align="left">Remark</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable?
                                    <>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    </>
                                :
                                account.visit.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell >{i+1}</TableCell>
                                        <TableCell style={{maxWidth:250,minHeight:100,}}>{data.company}</TableCell>
                                        <TableCell style={{width:100,}}>{moment(data.visitDate).format('DD-MMM-YYYY')}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.location}</TableCell>
                                        <TableCell >{data.objective}</TableCell>
                                        <TableCell >{data.nextStep}</TableCell>
                                        <TableCell >{data.remarks}</TableCell>
                                        <TableCell style={{width:100,minHeight:100,}} align="right">
                                            <img src={Eye} onClick={()=>seeVisit(data)} className='icon-action'/>
                                            <img src={Edit} onClick={()=>editVisit(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))
                               
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                        {account.visit_pagination!==null&&
                        <TablePagination
                                className="card-pagination"
                                type="reduced"
                                page={account.visit_pagination.page}
                                pageLength={account.visit_pagination.perPage}
                                totalRecords={account.visit_pagination.total}
                                // totalRecords={account.visit_pagination.total}
                                onPageChange={({ page, pageLength }) => {
                                    togglePagination(page,pageLength,'visit')
                                }}
                                prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                nextPageRenderer={() => <img src={CevronRight}/>}
                            />
                        }
                    </div>
                       </div>
                   </div>
                </div>
                    <br/>
                    <div className='card-content'>
                    <div style={{padding:'10px 10px 0px 20px'}}>
                        <p className='bold'>Proposal </p>

                    </div>
                    <div className='card-table'>
                       <div className='card-table__head' style={{position:'relative'}}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    id="input-with-icon-textfield"
                                    name='password'
                                    onChange={(e)=>searchProposal(e.target.value)}
                                    required
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{position:'absolute',top:0,left:100}}>
                                <Picker
                                    style={{marginLeft:-100}}
                                    ref={pickRange2}
                                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                                    value={filter_proposal.rangeValue}
                                    lang={pickerLang}
                                    theme="light"
                                    onChange={()=>null}
                                    onDismiss={handleRangeDissmis2}
                                    >
                                </Picker>
                            </div>
                            <div className='div-flex div-align-center'>
                                <MonthBox textPeriode={filter_proposal.textPeriode} value={makeText(filter_proposal.rangeValue.from) + ' - ' + makeText(filter_proposal.rangeValue.to)} onClick={_handleClickRangeBox2} />
                                <button onClick={()=>exportProposal()} style={{marginBottom:20}}  className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>
                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">Proposal name</TableCell>
                                <TableCell align="left">Deal type</TableCell>
                                <TableCell align="left">Sent by</TableCell>
                                <TableCell align="left">Delivery date</TableCell>
                                <TableCell align="left">Proposal value</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable2?
                                    <>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    </>
                                :
                                account.proposal.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{i+1}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{data.name}</TableCell>
                                        <TableCell >{data.type}</TableCell>
                                        <TableCell >{data.sentBy}</TableCell>
                                        <TableCell style={{maxWidth:200,minHeight:100,}}>{moment(data.sentDate).format('DD-MMM-YYYY')}</TableCell>
                                        <TableCell >IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell  align="right">
                                            <img src={Eye} onClick={()=>seeProposal(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))
                               
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                        {account.proposal_pagination!==null&&
                        <TablePagination
                                className="card-pagination"
                                type="reduced"
                                page={account.proposal_pagination.page}
                                pageLength={account.proposal_pagination.perPage}
                                totalRecords={account.proposal_pagination.total}
                                // totalRecords={account.proposal_pagination.total}
                                onPageChange={({ page, pageLength }) => {
                                    togglePagination(page,pageLength,'proposal')
                                }}
                                prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                nextPageRenderer={() => <img src={CevronRight}/>}
                            />
                        }
                    </div>
                       </div>
                   </div>
                </div>
                <br/>
                {(report_leader!==null||report_mentor!==null)&&<h3 style={{color:'#777777'}}>Team Proposal</h3>}
                {report_leader!==null&&<div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head' style={{position:'relative'}}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="input-with-icon-textfield">Search</InputLabel>
                                <OutlinedInput
                                    size='small'
                                    style={{height:30,width:200,}}
                                    id="input-with-icon-textfield"
                                    name='password'
                                    onChange={(e)=>searchTeamProposal(e.target.value)}
                                    required
                                    startAdornment={
                                    <InputAdornment position="start">
                                       <img alt="search" src={SearchImg} style={{width:15}}/>
                                    </InputAdornment>
                                    }
                                    labelWidth={50}
                                />
                            </FormControl>
                            <div style={{position:'absolute',top:0,left:100}}>
                                <Picker
                                    style={{marginLeft:-100}}
                                    ref={pickRange3}
                                    years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                                    value={filter_proposal_team.rangeValue}
                                    lang={pickerLang}
                                    theme="light"
                                    onChange={()=>null}
                                    onDismiss={handleRangeDissmis3}
                                    >
                                </Picker>
                            </div>
                            <div className='div-flex div-align-center'>
                                <MonthBox textPeriode={filter_proposal_team.textPeriode} value={makeText(filter_proposal_team.rangeValue.from) + ' - ' + makeText(filter_proposal_team.rangeValue.to)} onClick={_handleClickRangeBox3} />
                                <button onClick={()=>exportTeamProposal()}   className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>

                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{width:10}}>No</TableCell>
                                <TableCell align="left">Proposal name</TableCell>
                                <TableCell align="left">RM</TableCell>
                                <TableCell align="center" >Segment</TableCell>
                                <TableCell align="center" >Delivery Date</TableCell>
                                <TableCell align="center">Proposal value</TableCell>
                                <TableCell align="center" >Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoadingTable?
                                    <>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    </>
                                :
                                <>
                                {proposal_team.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell >{data.name}</TableCell>
                                        <TableCell >{data.rms.map((d)=>d.text).join(', ')}</TableCell>
                                        <TableCell >{data.segments.map((d)=>d.text).join(', ')}</TableCell>
                                        <TableCell align="center">{moment(data.sentDate).format("D MMMM YYYY")}</TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell  align="center">
                                            <img src={Eye} onClick={()=>seeProposal(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </>
                                }
                            </TableBody>
                        </Table>
                        <div className='card-table__pagination'>
                        {account.proposal_team_pagination!==null&&
                        <TablePagination
                                className="card-pagination"
                                type="reduced"
                                page={account.proposal_team_pagination.page}
                                pageLength={account.proposal_team_pagination.perPage}
                                totalRecords={account.proposal_team_pagination.total}
                                // totalRecords={account.proposal_team_pagination.total}
                                onPageChange={({ page, pageLength }) => {
                                    togglePagination(page,pageLength,'proposal_team')
                                }}
                                prevPageRenderer={() => <img src={CevronLeft} style={{width:10}}/>}
                                nextPageRenderer={() => <img src={CevronRight}/>}
                            />
                        }
                    </div>
                       </div>
                   </div>
                </div>}
                <br/>


                {(report_leader!==null||report_mentor!==null)&&<h3 style={{color:'#777777'}}>Team Sales Report</h3>}
               
                {report_leader!==null&&<div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <h4 style={{margin:0}}>{general.isLoadingTable2?<Skeleton width={100}/>:report_leader.teamName}</h4>
                            <div className='div-flex div-align-center'>
                                <p className='semi-bold-nomargin'>Periode : {filter_sales_visit.textPeriode}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <p style={{maxWidth:250}} className='semi-bold-nomargin'>Tribe : {renderTribeFilter()}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>filterSalesVisitLeader()} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>exportTeam(report_leader)}   className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>

                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{width:10}}>No</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Authority</TableCell>
                                <TableCell align="center" style={{width:10}}>No. Proposals</TableCell>
                                <TableCell align="center" style={{width:10}}>Sales visit</TableCell>
                                <TableCell align="center">Proposal value</TableCell>
                                <TableCell align="center">Sales</TableCell>
                                <TableCell align="center" style={{width:100}}>Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoading?
                                    <>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    </>
                                :
                                <>
                                {report_leader.items.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell >{data.user.text}</TableCell>
                                        <TableCell >{data.authority}</TableCell>
                                        <TableCell align="center">{data.nProposals}</TableCell>
                                        <TableCell align="center">{data.visits}</TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.sales} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell  align="center">
                                            <p onClick={()=>data.status==="Need approval"&&approveTarget(data)} style={{margin:0,cursor:'pointer',color:renderStatusColor(data.status)}}><b>{data.status}</b></p>
                                            {data.status==='Targets approved'&&<img src={Eye} onClick={()=>approveTarget(data)} className='icon-action'/>}
                                            <img src={Excel} onClick={()=>getExcel(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow style={{height:40}}>
                                    <TableCell colSpan={3}><b>Total</b></TableCell>
                                    <TableCell align="center"><b>{report_leader.totalNProposal}</b></TableCell>
                                    <TableCell align="center"><b>{report_leader.totalSalesVisit}</b></TableCell>
                                    <TableCell align="center"><b>IDR&nbsp;<NumberFormat value={report_leader.totalProposalValue} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ><b>IDR&nbsp;<NumberFormat value={report_leader.totalSales} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ></TableCell>
                                </TableRow>
                                </>
                                }
                            </TableBody>
                        </Table>
                       
                       </div>
                   </div>
                </div>}
                <br/>
                {report_mentor!==null&&<div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <h4 style={{margin:0}}>{general.isLoadingTable2?<Skeleton width={100}/>:report_mentor.teamName}</h4>
                            <div className='div-flex div-align-center'>
                                <p className='semi-bold-nomargin'>Periode : {filter_sales_visit_mentor.textPeriode}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <p style={{maxWidth:250}} className='semi-bold-nomargin'>Tribe : {renderTribeFilterMentor()}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>filterSalesVisitMentor()} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>exportTeam(report_mentor)}   className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>

                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{width:10}}>No</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Authority</TableCell>
                                <TableCell align="center" style={{width:10}}>No. Proposals</TableCell>
                                <TableCell align="center" style={{width:10}}>Sales visit</TableCell>
                                <TableCell align="center">Proposal value</TableCell>
                                <TableCell align="center">Sales</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {general.isLoading?
                                    <>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    <TableCell><Skeleton count={5}/></TableCell>
                                    </>
                                :
                                <>
                                {report_mentor.items.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell>{data.user.text}</TableCell>
                                        <TableCell >{data.authority}</TableCell>
                                        <TableCell align="center">{data.nProposals}</TableCell>
                                        <TableCell align="center">{data.visits}</TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.sales} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell  align="right">
                                            <p  onClick={()=>data.status!=="approved"&&approveTarget(data)} style={{cursor:'pointer',margin:0,color:renderStatusColor(data.status)}}><b>{data.status}</b></p>
                                            <img src={Excel} onClick={()=>getExcel(data)} className='icon-action'/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow style={{height:40}}>
                                    <TableCell colSpan={3}><b>Total</b></TableCell>
                                    <TableCell align="center"><b>{report_mentor.totalNProposal}</b></TableCell>
                                    <TableCell align="center"><b>{report_mentor.totalSalesVisit}</b></TableCell>
                                    <TableCell align="center"><b>IDR&nbsp;<NumberFormat value={report_mentor.totalProposalValue} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ><b>IDR&nbsp;<NumberFormat value={report_mentor.totalSales} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ></TableCell>
                                </TableRow>
                                </>
                                }
                            </TableBody>
                        </Table>
                       
                       </div>
                   </div>
                </div>}
                </div>
                </MuiThemeProvider>
            </Layout>
        </div>
    )
}
