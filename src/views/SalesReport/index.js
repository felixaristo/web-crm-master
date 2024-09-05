import React,{useState, useEffect,useRef} from 'react'
import Layout from 'components/Layouts'
import {Button,FormControl,InputLabel,Select,MenuItem,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import { useDispatch, useSelector } from "react-redux";
import './style.css'
import {modalToggle} from 'redux/actions/general'
import LevelUp from 'assets/icon/LevelUp.svg'
import LevelDown from 'assets/icon/LevelDown.svg'
import Equal from 'assets/icon/Equal.svg'
import filter from 'assets/icon/filter.svg'
import close from 'assets/icon/close.svg'
import {getMasterData,tabToggle,getEmployee} from 'redux/actions/master'
import {getSummaryReport,getReportExcel,getReportProjected,getReportInvoice,reportFilter,getChart, getAllReportExcel,getIndividualAll} from 'redux/actions/report'
import AutoCompleteSelect from 'components/Select'
import 'react-month-picker/css/month-picker.css';
import Picker from 'react-month-picker'
import moment from 'moment'
import NumberFormat from 'react-number-format';
import Skeleton  from 'react-loading-skeleton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Chart from 'react-apexcharts'
import * as actionType from 'redux/constants/report'
import {capitalize, get} from 'lodash'
import Excel from 'assets/icon/Excel.svg'
import ReactExport from "react-data-export";
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import { saveAs } from 'file-saver'

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
            // main:'#FF7165',
            main:'#3b99eb',
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
        <div style={{display:'flex',alignItems:'center',marginBottom:15}}>
            <p className='bold'>Year : {props.value.from.year}</p>&nbsp;&nbsp;&nbsp;
            <p className='bold'>Period : {props.textPeriode}</p>&nbsp;&nbsp;&nbsp;
            <button onClick={_handleClick} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
        </div>
    )
}

export default function Index(props) {
    const [modal,setModal]=useState(false)
    const [show_table,setShowTable]=useState(false)
    const [active_table,setActiveTable]=useState('projected')
    const [title_table,setTitleTable]=useState('')
    const master=useSelector(state=>state.master)

    const [filter_chart,setFilterChart]=useState({
        id:{id:1,text:'Strategy & Execution Solutions'},
        periode:{fromMonth:parseInt(moment().month(0).format('M')),toMonth:parseInt(moment().format('M')),year:parseInt(moment().format('YYYY'))},

        textPeriode:'All period',
        unit:'Tribe',
        rangeValue:{from: {year: parseInt(moment().format('YYYY')), month:parseInt(moment().month(0).format('M')) }, to: {year: parseInt(moment().format('YYYY')), month: parseInt(moment().format('M'))}}
    })
    const general=useSelector(state=>state.general)
    const report=useSelector(state=>state.report)
    let {filter_individual_all} = report
    const dispatch=useDispatch()
    const pickRange=useRef(null)
    const [charts,setChart]=useState({
        series: [{
            name: 'series1',
            data: [31, 40, 28, 51],
            percent:[100,100,100,100],
            month: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli"]
          }, 
          {
            name: 'series2',
            data: [11, 32, 45, 32],
            percent:[100,100,100,100],
            month: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli"]

    
          },
        ],
          options: {
            chart: {
              height: 350,
              type: 'area'
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              
              categories: ["January","February","March","April","May","June","July","August","September","October","November","December"]
            },
            tooltip: {
              custom: function({series, seriesIndex, dataPointIndex, w}) {
                console.log('seriesIndex,dataPointIndex',series[seriesIndex][dataPointIndex],w)
                let percent=w.config.series
                return '<div class="graph-tooltip">'+
                            '<div class="graph-tooltip-head">'+percent[seriesIndex].month[dataPointIndex] +'</div>'+
                            '<div class="graph-tooltip-body">'+
                                // '<p>'+'<span>'+'<div class="bulat1">'+'</div>'+series[seriesIndex][dataPointIndex]+'</span>'+'</p>'+
                                // '<p style="display:flex;">'+'<div class="bulat1"></div>'+series[seriesIndex][dataPointIndex]+'</p>'+
                                `<div style="display:flex;align-items:center"><div class="bulat1"></div>${series[seriesIndex][dataPointIndex]}</div>`+
                            '</div>'+
                       '</div>'
              }
            },
          },
    
    })

    const [search_individual_all, setsearch_individual_all] = useState('')
    
    useEffect(()=>{
        if(master.rm.length>0){
            return
        }else{
            dispatch(getMasterData(props.token))
            // dispatch(getEmployee(props.token))
        }
        dispatch(getSummaryReport(props.token))
        getChartReport()
        getIndividualAllAct(`/${props.profile.id}/${filter_individual_all.periode.fromMonth}/${filter_individual_all.periode.toMonth}/${filter_individual_all.rangeValue.from.year}/0`)
    },[])
    const getIndividualAllAct=(slug)=>{
        dispatch(getIndividualAll(props.token,slug))
    }
    const getChartReport=(slug=`/${filter_chart.unit.toLowerCase()}/${filter_chart.id.id}/${filter_chart.periode.fromMonth}/${filter_chart.periode.toMonth}/${filter_chart.periode.year}`)=>{
        dispatch(getChart(props.token,slug))
        // dispatch(getReportExcel(props.token,slug,filter_chart.periode.fromMonth,filter_chart.periode.toMonth,filter_chart.periode.year))
    }
    const onChangeFilterChart=(e)=>{

        setFilterChart({

            ...filter_chart,
            unit:e.target.value,
            id:0
        })
    }
    const onChangeIdFilterChart=async (id)=>{
        await setFilterChart({
            ...filter_chart,
            id:id
        })
        getChartReport(`/${filter_chart.unit==='Relationship manager'?'rm':filter_chart.unit.toLowerCase()}/${id.id}/${filter_chart.periode.fromMonth}/${filter_chart.periode.toMonth}/${filter_chart.periode.year}`)

    }

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
    const renderLoading2=()=>{
        return(
            <div className='div-flex'>
                <div className='invoice-table-width'>
                <Skeleton height={30}/>
                </div>
                <div className='invoice-table-width '>
                <Skeleton height={30}/>
                </div>
                <div className='invoice-table-width '>
                <Skeleton height={30}/>
                </div>
                <div className='invoice-table-width '>
                <Skeleton height={30}/>
                </div>
            </div>
        )
    }
    const modalsToggle=()=>{
        setModal(!modal)
    }
    const addTarget=(title)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `${title} target`,
            modal_component: "add_target_report",
            modal_size:930,
            modal_type:'add_target_report',
            modal_data:{
                target:title,
                slug:`/${filter_chart.unit.toLowerCase()}/${filter_chart.id.id}/${filter_chart.periode.fromMonth}/${filter_chart.periode.toMonth}/${filter_chart.periode.year}`
            },
            modal_action:'add_target_report'
        }))
    }
    const addFilter=()=>{
        
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Filter",
            modal_component: active_table==='invoice'?`report_filter`:'report_filter2',
            modal_data:null ,
            modal_size:300,
            modal_action:active_table==='invoice_1month'?`invoice_1month`:'add_report_filter',
        }))
    }
    
    const makeText = m => {
        if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
        return '?'
    }
    const pickerLang = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        from: 'From', to: 'To',
    }
    const _handleClickRangeBox=(e)=>{
        pickRange.current.show()
    }
    const handleRangeChange=(value, text, listIndex)=> {
       
    }
    const handleRangeDissmis=async (value)=> {
        await setFilterChart({
            ...filter_chart,
            periode:{fromMonth:value.from.month,toMonth:value.to.month,year:value.from.year},
            rangeValue:value,
            textPeriode:pickerLang.months[value.from.month-1]+' - '+pickerLang.months[value.to.month-1]
        })
        getChartReport(`/${filter_chart.unit==='Relationship manager'?'rm':filter_chart.unit.toLowerCase()}/${filter_chart.id.id}/${value.from.month}/${value.to.month}/${value.from.year}`)
        
    }
    const getprojected=(title)=>{
        setShowTable(true)
        setActiveTable('projected')
        dispatch(reportFilter({unit:'tribe'}))
        dispatch(reportFilter({year:moment().format('YYYY')}))
        dispatch(reportFilter({month:moment().format('M')}))
        dispatch({
            type:actionType.SET_TABLE_TITLE,
            payload:title
        })
        dispatch( getReportProjected(props.token,`/tribe/${moment().format('M')}/${moment().format('YYYY')}`))
    }
    const getInvoiceReports=(title,from,to,tab)=>{
        dispatch(reportFilter({unit:'tribe'}))
        dispatch(reportFilter({year:moment().format('YYYY')}))
        // dispatch(reportFilter({periode:{fromMonth:from,toMonth:to}}))
        setActiveTable(tab)
        setShowTable(true)
        dispatch({
            type:actionType.SET_TABLE_TITLE,
            payload:title
        })

        let year1=moment().subtract('2','years').format('YYYY')
        let year2=moment().subtract('1','years').format('YYYY')
        let year3=moment().format('YYYY')
        
        dispatch(getReportInvoice(props.token,`/${report.filter.unit}/${year1}/${year2}/${year3}/${from}/${to}`))

    }
    const renderProgress=(icon)=>{
        // console.log('icon', icon)
        switch (icon) {
            case '':
                return <span style={{height:5}} className='div-flex div-align-center color-green'><ArrowDropUpIcon /></span>
                break;
            case '=':
                return<span style={{height:5}} className='div-flex div-align-center color-green'>&nbsp;&nbsp;<img src={Equal} style={{width:10,marginRight:5}}/></span>
            case 0:
                return <span style={{height:5}} className='div-flex div-align-center color-green'><img src={Equal} style={{width:10,marginRight:5}}/>&nbsp;{icon}%</span>
            
            default:
                break;
        }
        if(parseInt(icon)<0){
            return <span style={{height:5}} className='div-flex div-align-center color-red'><ArrowDropDownIcon/>{Math.abs(icon)}%</span>
        }
        if(parseInt(icon)>0){
            return <span style={{height:5}} className='div-flex div-align-center color-green'><ArrowDropUpIcon/>{icon}%</span>
        }
        
    }
    const renderWidthFlex1=()=>{
        let items=report.report_table.items
        let a=[]
        items.map((data)=>{
            a.push(data.amount2.toString().length)
        })
        let terbesar=Math.max(...a)
        // console.log('terbesar', terbesar)
        if(terbesar>0&&terbesar<=14){
            return 130
        }else if(terbesar>14){
            return 150
        }else{
            return 10
        }
    }
    const renderWidthFlex2=()=>{
        let items=report.report_table.items
        let a=[]
        items.map((data)=>{
            a.push(data.amount3.toString().length)
        })
        let terbesar=Math.max(...a)
        // console.log('terbesar', terbesar)
        if(terbesar>0&&terbesar<=14){
            return 130
        }else if(terbesar>14){
            return 150
        }else{
            return 10
        }
    }
    const renderOption=()=>{
        switch (filter_chart.unit) {
            case 'Tribe':
                return [...master.tribes,{id:0,text:'All Tribes'}]
            case 'Relationship manager':
                return master.rm_text
            case 'Branch':
                return master.branches
            case 'Segment':
                return master.segments
        
            default:
                break;
        }
    }
    const getExcel=(slug=`/${filter_chart.unit.toLowerCase()}/${filter_chart.id.id}/${filter_chart.periode.fromMonth}/${filter_chart.periode.toMonth}/${filter_chart.periode.year}`)=>{
        if(filter_chart.id.id!==0){
            dispatch(getReportExcel(props.token,slug,filter_chart.periode.fromMonth,filter_chart.periode.toMonth,filter_chart.periode.year,filter_chart.id.text))

        }else{
            let slug_all=`/all/${filter_chart.periode.fromMonth}/${filter_chart.periode.toMonth}/${filter_chart.periode.year}`
            dispatch(getAllReportExcel(props.token,slug_all,filter_chart.periode.fromMonth,filter_chart.periode.toMonth,filter_chart.periode.year,filter_chart.id.text))

        }
    }
    const renderTribeFilter=()=>{
        let new_tribes=[]
        filter_individual_all.tribes.map((data)=>{
            new_tribes.push(data.text)
        })
        if(new_tribes.length>0){
            return `${new_tribes.join(' , ')}`
        }else{
            return 'All Tribes'
        }
    }
    const filterIndividualAll=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Filter Individual Sales Visit`,
            modal_component: "filter_individual_all",
            modal_data:{
                action:(slug)=>getIndividualAllAct(slug)
            } ,
            modal_size:330,
            modal_action:'filter_individual_all'
        }))
    }

    const exportIndividual=async ()=>{
        const wb = new ExcelJS.Workbook()
        const sheet1 = wb.addWorksheet("Individual Sales Report All");
        let header=['No','Name','Segment','No.Proposal','Sales Visit','Proposal Value','Sales']
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
            {key:'segment',width:20},
            {key:'nProposals',width:15},
            {key:'visits',width:15},
            {key:'proposalValue',width:15},
            {key:'sales',width:15},
        ]
        report.individual_all.items.map((data,i)=>{
            sheet1.addRow({
                no:i+1,
                name:data.user.text,
                segment:data.segment?.text,
                nProposals:data.nProposals,
                visits:data.visits,
                proposalValue:data.proposalValue,
                sales:data.sales,
            })
        })
        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `Individual Report All.xlsx`)
    }
    const max=moment().add(10,'year').format('YYYY')
    const min=moment().subtract(10,'year').format('YYYY')
    let {report_summary,report_excel}=report
    // console.log('filter_chart', report.chart)
    return (
        <div>
            <Layout>
                <MuiThemeProvider theme={themeButton}>
                <div className='detail-header-report'>
                <div onClick={modalsToggle} style={{zIndex:2,width:'100%',height:700,position:'absolute',top:0,left:0,display:modal?'block':'none'}}></div>
                    <div className='report-header' >
                        <div style={{display:'flex',alignItems:'center'}}>
                            <h4>Sales Report</h4>
                            
                            
                        </div>
                        
                    </div>
                </div>
                <div className='detail-content-report'>
                    {report_summary.length>0?
                        <div className='card-wrapper-report'>
                            <div className='card-report'>
                                <p className='semi-bold'>{report_summary[0].title}</p>
                                <h4 className={report_summary[0].percent===0?'color-yellow':report_summary[0].percent>0?'color-green':'color-red'}>
                                    IDR &nbsp;<NumberFormat value={report_summary[0].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[0].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[0].percent===0?Equal:report_summary[0].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[0].note}</p>
                                    <Button onClick={()=>getprojected(report_summary[0].title)} size='small' variant='text' color='secondary' className='remove-capital' >Detail</Button>
                                </div>
                            </div>
                            <div className='card-report'>
                                <p className='semi-bold'>{report_summary[1].title}</p>
                                <h4 className={report_summary[1].percent===0?'color-yellow':report_summary[1].percent>0?'color-green':'color-red'}>
                                    IDR &nbsp;<NumberFormat value={report_summary[1].amount} displayType={'text'} thousandSeparator={true}  />&nbsp;&nbsp;
                                    <span><div style={{height:25,width:1,backgroundColor:'#ccc '}}></div></span>&nbsp;&nbsp;
                                    {report_summary[1].percent}%&nbsp;&nbsp;
                                    <span><img src={report_summary[1].percent===0?Equal:report_summary[1].percent>0?LevelUp:LevelDown} style={{width:20}}/></span>

                                </h4>
                                <div className='div-flex div-space-between div-align-center'>
                                    <p className='grey-bold'>{report_summary[1].note}</p>
                                    <Button onClick={()=>getInvoiceReports(`Invoice in ${moment().format('MMM')}`,moment().format('M'),moment().format('M'),'invoice_1month')} size='small' variant='text' color='secondary' className='remove-capital' >Detail</Button>
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
                                    <Button onClick={()=>getInvoiceReports(`Invoice in ${moment().month(0).format('MMM')} - ${moment().format('MMM')}`,'1',moment().format('M'),'invoice')} size='small' variant='text' color='secondary' className='remove-capital' >Detail</Button>
                                </div>
                            </div>

                        </div>
                    :renderLoading()}
                    
                    <div className='report-header' style={{display:show_table?'flex':'none'}}>
                        <h4>{report.table_title}</h4>
                        <div style={{display:'flex',alignItems:'center',}}>
                            <p className='grey-bold'>Unit : {report.filter.unit==='rm'?'Relationship manager':capitalize(report.filter.unit)}</p>&nbsp;&nbsp;&nbsp;
                            <p className='grey-bold'>Year : {report.filter.year}</p>&nbsp;&nbsp;&nbsp;
                            <button onClick={addFilter} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
                            <img onClick={()=>setShowTable(!show_table)} src={close} style={{width:15,cursor:'pointer'}}/>&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                    <div className='invoice-table' style={{display:show_table?'block':'none'}}>
                    {general.isLoadingTable?renderLoading2():report.report_table!==null?
                    <>
                        <div className='div-flex'>
                            <div className='invoice-table-width'></div>
                            <div className='invoice-table-width with-border'>
                                <p className='semi-bold'>{report.report_table.header.headers[0]}</p>
                            </div>
                            <div className='invoice-table-width with-border'>
                                <p className='semi-bold'>{report.report_table.header.headers[1]}</p>
                            </div>
                            <div className='invoice-table-width with-border'>
                                <p className='semi-bold'>{report.report_table.header.headers[2]}</p>
                            </div>
                        </div>
                        
                        {report.report_table.items.map((data,i)=>(
                        <div className='div-flex' key={i}>
                            <div className={`invoice-table-width ${report.report_table.items.length-1===i&&'with-border'}`}>
                                <p className='semi-bold div-flex '>{data.text}</p>
                            </div>
                            <div className='invoice-table-width with-border'>
                                <p className='semi-bold div-flex'>IDR&nbsp;<NumberFormat value={data.amount1} displayType={'text'} thousandSeparator={true}  /></p>
                            </div>
                            <div className='invoice-table-width with-border'>
                                <div className='div-flex ' >
                                <p  className='semi-bold ' style={{width:renderWidthFlex1()}} >
                                    IDR&nbsp;<NumberFormat value={data.amount2} displayType={'text'} thousandSeparator={true}  />
                                </p>
                                <p style={{fontWeight:600,fontSize:12}}>
                                {renderProgress(data.percent1)}
                                </p>
                                </div>
                            </div>
                            <div className='invoice-table-width with-border'>
                            <div className='div-flex '  >
                                <p  className='semi-bold ' style={{width:renderWidthFlex2()}}>
                                    IDR&nbsp;<NumberFormat value={data.amount3} displayType={'text'} thousandSeparator={true}  />
                                </p>
                                <p style={{fontWeight:600,fontSize:12}}>
                                {renderProgress(data.percent2)}
                                </p>
                                </div>
                            </div>
                        </div>
                        ))}
                        <div className='div-flex' >
                            <div className='invoice-table-width'>
                                <p className='total-text div-flex '><b>Total</b></p>
                            </div>
                            <div className='invoice-table-width '>
                                <p className='total-text div-flex'>IDR&nbsp;<NumberFormat value={report.report_table.total.total1} displayType={'text'} thousandSeparator={true}  /></p>
                            </div>
                            <div className='invoice-table-width '>
                                <p  className='total-text div-flex div-align-center'>
                                    IDR&nbsp;<NumberFormat value={report.report_table.total.total2} displayType={'text'} thousandSeparator={true}  />
                                    &nbsp;&nbsp;
                                    {renderProgress(report.report_table.total.total_percent1)}
                                    {/* <span style={{height:5}} className='div-flex div-align-center color-green'><ArrowDropUpIcon />&nbsp;50%</span> */}
                                </p>
                            </div>
                            <div className='invoice-table-width '>
                            <p className='total-text div-flex div-align-center'>
                                    IDR&nbsp;<NumberFormat value={report.report_table.total.total3} displayType={'text'} thousandSeparator={true}  />
                                    &nbsp;&nbsp;
                                    {renderProgress(report.report_table.total.total_percent2)}
                                    {/* <span style={{height:5}} className='div-flex div-align-center color-green'><ArrowDropUpIcon/>&nbsp;50%</span> */}
                                </p>
                            </div>
                        </div>
                        </>
                        :null}
                        
                    </div>
                    <br/>
                    <div className='report-header' >
                        <div style={{display:'flex',alignItems:'center'}}>
                            <h4>Sales Report</h4>
                            &nbsp;&nbsp;&nbsp;
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
                            
                        </div>
                        <div style={{position:'relative'}}>
                        <Button onClick={()=>modalsToggle()} size='small' color='primary' variant='contained' className='remove-capital btn-rounded'>Add target</Button>
                        <div className='report-modal' style={{display:modal?'block':'none'}}>
                            <p onClick={()=>addTarget('Tribe')}>Tribe</p>
                            <div style={{height:1,backgroundColor:'#CCCCCC'}}></div>
                            <p onClick={()=>addTarget('Relationship manager')}>Relationship Manager</p>
                            <div style={{height:1,backgroundColor:'#CCCCCC'}}></div>
                            <p onClick={()=>addTarget('Segment')}>Segment</p>
                            <div style={{height:1,backgroundColor:'#CCCCCC'}}></div>
                            <p onClick={()=>addTarget('Branch')}>Branch</p>
                            <div style={{height:1,backgroundColor:'#CCCCCC'}}></div>
                        </div>
                        </div>
                    </div>
                    <br/>
                    <div className='report-header div-flex div-align-center' >
                        <div style={{display:'flex',alignItems:'center'}}>
                            <div style={{width:150}}>
                            <FormControl   variant="outlined" size="small" className='add-proposal__field' >
                                <InputLabel  htmlFor="category">Choose unit</InputLabel>
                                <Select name='unit' color='primary' name='tribeId' value={filter_chart.unit}  onChange={(e)=>onChangeFilterChart(e)} labelId="label" id="select"  labelWidth={90} className='field-radius'>
                                    <MenuItem value='Tribe'>Tribe</MenuItem>
                                    <MenuItem value='Relationship manager'>Relationship manager</MenuItem>
                                    <MenuItem value='Branch'>Branch</MenuItem>
                                    <MenuItem value='Segment'>Segment</MenuItem>
                                </Select>
                            </FormControl>
                            </div>

                            &nbsp;&nbsp;&nbsp;
                            <div style={{width:300}}>
                            <AutoCompleteSelect
                                color='primary'
                                value={filter_chart.id}
                                disableClearable={true}
                                onChange={(event,value)=>onChangeIdFilterChart(value)}
                                options={renderOption()}
                                getOptionLabel={(option) => option.text}
                                label={filter_chart.unit}
                            />

                            <Picker
                                ref={pickRange}
                                years={{min: {year:parseInt(min),month:12},max:{year:parseInt(max),month:12}}}
                                value={filter_chart.rangeValue}
                                lang={pickerLang}
                                theme="light"
                                onChange={handleRangeChange}
                                onDismiss={handleRangeDissmis}
                            >
                            </Picker>
                            </div>
                            &nbsp;&nbsp;&nbsp;
                            {(filter_chart.unit==='Tribe'&&filter_chart.id!==0)&&
                            <button onClick={()=>getExcel()} style={{marginBottom:20}}  className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>
                            }
                        </div>
                        <MonthBox textPeriode={filter_chart.textPeriode} value={filter_chart.rangeValue} onClick={_handleClickRangeBox} />
                    </div>
                    <br/>
                    {report.chart.length>0&&
                    <div className='graph-grid'>
                        {/* {report.chart.map((data,i)=>(
                            <div className='graph-card'>
                                <p className='semi-bold'>{data.title}</p>
                                <Chart options={data.options} series={data.series} type="area" width={400} height={200} />
                            </div>
                        ))} */}
                        <div className='graph-card'>
                            <p className='semi-bold'>No. Proposals</p>
                            <Chart options={report.chart[0].options} series={report.chart[0].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Sales visit</p>
                            <Chart options={report.chart[2].options} series={report.chart[2].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Proposal value</p>
                            <Chart options={report.chart[1].options} series={report.chart[1].series} type="area" width='100%' height={200} />
                        </div>
                        <div className='graph-card'>
                            <p className='semi-bold'>Sales</p>
                            <Chart options={report.chart[3].options} series={report.chart[3].series} type="area" width='100%' height={200} />

                        </div>
                    </div>}

                    <h3 style={{color:'#777777'}}>Individual Sales Report</h3>
                    <div className='card-content'>
                    <div className='card-table'>
                       <div className='card-table__head'>
                            <h4 style={{margin:0}}></h4>
                            <div className='div-flex div-align-center'>
                                <p className='semi-bold-nomargin'>Periode : {filter_individual_all.textPeriode}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <p style={{maxWidth:250}} className='semi-bold-nomargin'>Tribe : {renderTribeFilter()}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>filterIndividualAll()} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>&nbsp;&nbsp;&nbsp;
                                <button onClick={()=>exportIndividual()}   className='card-table__head_btn'><img src={Excel} style={{width:15}}/>&nbsp;&nbsp;Export to excel</button>

                            </div>
                       </div>
                       <div className='card-table__content'>
                       <Table  size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{width:10}}>No</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Segment</TableCell>
                                <TableCell align="center" style={{width:10}}>No. Proposals</TableCell>
                                <TableCell align="center" style={{width:10}}>Sales visit</TableCell>
                                <TableCell align="center">Proposal value</TableCell>
                                <TableCell align="center">Sales</TableCell>
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
                                <>
                                {report.individual_all?.items.map((data,i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell >{data.user.text}</TableCell>
                                        <TableCell >{data.segment?.text}</TableCell>
                                        <TableCell align="center">{data.nProposals}</TableCell>
                                        <TableCell align="center">{data.visits}</TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.proposalValue} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        <TableCell align="center">IDR&nbsp;<NumberFormat value={data.sales} displayType={'text'} thousandSeparator={true}  /></TableCell>
                                        
                                    </TableRow>
                                ))}
                                {report.individual_all&&<TableRow style={{height:40}}>
                                    <TableCell colSpan={3}><b>Total</b></TableCell>
                                    <TableCell align="center"><b>{report.individual_all.totalNProposal}</b></TableCell>
                                    <TableCell align="center"><b>{report.individual_all.totalSalesVisit}</b></TableCell>
                                    <TableCell align="center"><b>IDR&nbsp;<NumberFormat value={report.individual_all.totalProposalValue} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ><b>IDR&nbsp;<NumberFormat value={report.individual_all.totalSales} displayType={'text'} thousandSeparator={true}  /></b></TableCell>
                                    <TableCell align="center" ></TableCell>
                                </TableRow>}
                                </>
                                }
                            </TableBody>
                        </Table>
                       
                       </div>
                   </div>
                </div>
                </div>

                </MuiThemeProvider>
            </Layout>
        </div>
    )
}
