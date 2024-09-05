import * as actionType from '../constants/account'
import {setLoading,setLoadingTable,setLoadingTable2,modalToggle} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import {getDetailDeal} from './pipeline'
import { get,isEmpty ,camelCase,groupBy} from "lodash";
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import moment from 'moment'
import { saveAs } from 'file-saver'
import Cookie from 'universal-cookie'
const cookie=new Cookie()
const token=cookie.get('login_cookie')
const profile=cookie.get('profile_cookie')
export const setTarget=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_TARGET,
        payload:data
    })
}
export const setFilterSalesVisit=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_FILTER_SALES_VISIT,
        payload:data
    })
}
export const setFilterSalesVisitMentor=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_FILTER_SALES_VISIT_MENTOR,
        payload:data
    })
}
export const setVisitSearch=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_ACCOUNT_VISIT_SEARCH,
        payload:data
    })
}
export const getSummaryReport=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/ind/summary${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        dispatch({
            type:actionType.GET_ACCOUNT_SUMMARY_REPORT,
            payload:res.data
        })
    }else{
        dispatch(setLoading(false))

    }
}

export const getChart=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/report/chart/rm${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){     
        dispatch(setLoading(false))
        let new_chart=[]
        let pickerMonth=["January","February","March","April","May","June","July","August","September","October","November","December"]
        res.data.map((data)=>{
            let series=[]
            let target={
                name:'target',
                data:[],
                achievement:[],
                month:[]
            }
            let actual={
                name:'actual',
                data:[],
                achievement:[],
                month:[]
            }
            data.xaxis.map((data)=>{
                target.data.push(0)
                target.achievement.push(0)
                actual.data.push(0)
                actual.achievement.push(0)
            })
            data.series.map((series)=>{
                if(target.data[series.month-1]===undefined){
                    target.data.splice(series.month-1,0,series.target)
                }else{
                    target.data[series.month-1]=series.target

                }
                if(target.achievement[series.month-1]===undefined){
                    target.achievement.splice(series.month-1,0,series.achievement)
                }else{

                    target.achievement[series.month-1]=series.achievement

                }

                if(actual.data[series.month-1]===undefined){
                    actual.data.splice(series.month-1,0,series.actual)
                }else{
                    actual.data[series.month-1]=series.actual

                }
                if(actual.achievement[series.month-1]===undefined){
                    actual.achievement.splice(series.month-1,0,series.achievement)
                }else{
                    actual.achievement[series.month-1]=series.achievement

                }
                // target.achievement[series.month-1]=series.achievement
                target.month=data.xaxis
                // target.data.push(series.target)
                // target.achievement.push(series.achievement)
                // target.month.push(pickerMonth[series.month-1])
                // actual.data[series.month-1]=series.actual
                // actual.achievement[series.month-1]=series.achievement
                actual.month=data.xaxis
                // actual.data.push(series.actual)
                // actual.achievement.push(series.achievement)
                // actual.month.push(pickerMonth[series.month-1])
                
            })
            console.log('target,actual', target,actual)

            series=[actual,target]
            let xx=[]
            
            new_chart.push({
                series:[actual,target],
                title:data.title,
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
                      categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                    },
                    yaxis:{
                        labels:{
                            formatter:(value)=>{
                                if(value.toString().length>=7){
                                    return `${(value/1000000).toLocaleString()} M`
                                }else{
                                    return value.toLocaleString()
                                }
                            }
                        }
                    },
                    legend:{show:false},
                    tooltip: {
                      custom: function({series, seriesIndex, dataPointIndex, w}) {
                        let percent=w.config.series
                        // console.log('percent',percent)
                        return '<div class="graph-tooltip">'+
                                    '<div class="graph-tooltip-head">'+percent[seriesIndex].month[dataPointIndex] +'</div>'+
                                    '<div class="graph-tooltip-body">'+
                                        // '<p>'+'<span>'+'<div class="bulat1">'+'</div>'+series[seriesIndex][dataPointIndex]+'</span>'+'</p>'+
                                        // '<p style="display:flex;">'+'<div class="bulat1"></div>'+series[seriesIndex][dataPointIndex]+'</p>'+
                                        `<div style="display:flex;align-items:center"><div class="bulat1"></div>&nbsp;Target: &nbsp;&nbsp;${percent[1].data[dataPointIndex]!==undefined?percent[1].data[dataPointIndex].toString().length>=7?`${Math.round(percent[1].data[dataPointIndex]/1000000).toLocaleString()} M`:percent[1].data[dataPointIndex].toLocaleString():0}</div>`+
                                        `<div style="display:flex;align-items:center"><div class="bulat2"></div>&nbsp;Actual: &nbsp;&nbsp;${percent[0].data[dataPointIndex]!==undefined?percent[0].data[dataPointIndex].toString().length>=7?`${Math.round(percent[0].data[dataPointIndex]/1000000).toLocaleString()} M`:percent[0].data[dataPointIndex].toLocaleString():0}</div>`+
                                        // `<div style="display:flex;align-items:center">Achievement: &nbsp;&nbsp;<span class=${parseInt(percent[0].achievement[dataPointIndex])<50?'color-red':parseInt(percent[0].achievement[dataPointIndex])<70?'color-yellow':'color-green'}>${percent[0].achievement[dataPointIndex]}%</span></div>`+
                                        `<div style="display:flex;align-items:center">Achievement: &nbsp;&nbsp;<span class=${parseInt(target.achievement[dataPointIndex])<50?'color-red':parseInt(target.achievement[dataPointIndex])<70?'color-yellow':'color-green'}>${target.achievement[dataPointIndex].toLocaleString()}%</span></div>`+
                                    '</div>'+
                               '</div>'
                      }
                    },
                  },
            })
        })
        dispatch({
            type:actionType.GET_ACCOUNT_CHART,
            payload:new_chart
        })
        console.log('new_chart', new_chart)
    }else{
        dispatch(setLoading(false))

    }
}


export const getSalesVisit=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable(true))
    let dataReq={
        url:`/Pipeline/ind/visit${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable(false))
        dispatch({
            type:actionType.GET_ACCOUNT_VISIT,
            payload:{
                pagination:res.data.info,
                visit:res.data.items
            }
        })
    }else{
        dispatch(setLoadingTable(false))

    }
}
export const getProposal=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable2(true))
    let dataReq={
        url:`/Pipeline/ind/proposal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable2(false))
        dispatch({
            type:actionType.GET_ACCOUNT_PROPOSAL,
            payload:{
                pagination:res.data.info,
                visit:res.data.items
            }
        })
    }else{
        dispatch(setLoadingTable2(false))

    }
}
export const getProposalTeam=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable(true))
    let dataReq={
        url:`/pipeline/pic/proposal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable(false))
        dispatch({
            type:actionType.GET_PROPOSAL_TEAM,
            payload:{
                proposal_team_pagination:res.data.info,
                proposal_team:res.data.items
            }
        })
    }else{
        dispatch(setLoadingTable(false))

    }
}
export const getVisitExcel=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/export/visit${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        const wb = new ExcelJS.Workbook()

        const sheet1 = wb.addWorksheet(`Sales visit`);
        let header=res.data.headers
        var borderStyles = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        sheet1.getRow(1).values=header

        sheet1.columns=[
            {key:'no',width:5},
            {key:'company',width:30},
            {key:'visitDate',width:20},
            {key:'location',width:15},
            {key:'objective',width:15},
            {key:'remarks',width:15},
        ]
        res.data.items.map((data)=>{
            sheet1.addRow({
                no:data.no,
                company:data.company,
                visitDate:moment(data.visitDate).format('DD-MMM-YYYY'),
                location:data.location,
                objective:data.objective,
                remarks:data.remarks
            })
        })
        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `sales_visit.xlsx`)
    }else{
        dispatch(setLoading(false))

    }
}
export const getProposalExcel=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/export/proposal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        const wb = new ExcelJS.Workbook()

        const sheet1 = wb.addWorksheet(`Proposal`);
        let header=res.data.headers
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
            {key:'client',width:20},
            {key:'type',width:20},
            {key:'sentBy',width:15},
            {key:'sendDate',width:15},
            {key:'proposalValue',width:15},
        ]
        res.data.items.map((data)=>{
            sheet1.addRow({
                no:data.no,
                name:data.name,
                client:data.client,
                type:data.type,
                sentBy:data.sentBy,
                sendDate:moment(data.sentDate).format('DD-MMM-YYYY'),
                proposalValue:data.proposalValue
            })
        })
        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `proposal.xlsx`)
    }else{
        dispatch(setLoading(false))

    }
}
export const getProposalTeamExcel=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/export/pic/proposal${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        const wb = new ExcelJS.Workbook()

        const sheet1 = wb.addWorksheet(`Proposal`);
        let header=res.data.headers
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
            {key:'type',width:20},
            {key:'sentBy',width:15},
            {key:'sendDate',width:15},
            {key:'proposalValue',width:15},
            {key:'rms',width:15},
            {key:'segments',width:15},
        ]
        res.data.items.map((data)=>{
            sheet1.addRow({
                no:data.no,
                name:data.name,
                type:data.type,
                sentBy:data.sentBy,
                sendDate:moment(data.sentDate).format('DD-MMM-YYYY'),
                proposalValue:data.proposalValue,
                rms:data.rms,
                segments:data.segments,
            })
        })
        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.border = borderStyles;
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `proposal_team.xlsx`)
    }else{
        dispatch(setLoading(false))

    }
}


export const postTargetIndividual=(data,text)=>{
    
    return async dispatch=>{
        dispatch(setLoading(true))
        let dataReq={
            url:`/pipeline/target`,
            method:'POST',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
                data:data
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(get(res,'status')==204){
            dispatch(setLoading(false))
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: text,
                modal_component: "add_target",
                modal_size:400,
                modal_type:'alert',
                modal_data:{
                    msg:`<p>${text}  successfully</p> `,
                    ...res.data
                },
                modal_action:'success',
                // success_msg:success_msg
            }))
            return res
        }else{
            dispatch(setLoading(false))

        }
    }
}
export const getTeamReportMentor=(slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/team/mentor${slug}`,
        method:'GET',
        let404:true,
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        let totalNProposal=0
        let totalSalesVisit=0
        let totalProposalValue=0
        let totalSales=0
        res.data.items.map((d)=>{
            totalNProposal+=d.nProposals
            totalSalesVisit+=d.visits
            totalProposalValue+=d.proposalValue
            totalSales+=d.sales
        })
        if(res.data.items.length>0){
            dispatch({
                type:actionType.SET_REPORT_MENTOR,
                payload:{...res.data,totalNProposal,totalSalesVisit,totalProposalValue,totalSales}
            })
        }
        
    }else{
        dispatch(setLoading(false))

    }
}
export const getTeamReportLeader=(slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/team/leader${slug}`,
        method:'GET',
        let404:true,
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        let totalNProposal=0
        let totalSalesVisit=0
        let totalProposalValue=0
        let totalSales=0
        res.data.items.map((d)=>{
            totalNProposal+=d.nProposals
            totalSalesVisit+=d.visits
            totalProposalValue+=d.proposalValue
            totalSales+=d.sales
        })
        if(res.data.items.length>0){
            dispatch({
                type:actionType.SET_REPORT_LEADER,
                payload:{...res.data,totalNProposal,totalSalesVisit,totalProposalValue,totalSales}
            })
        }
        
    }else{
        dispatch(setLoading(false))

    }
}
export const getTargetStatus=(slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/target/status${slug}`,
        method:'GET',
        let404:true,
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        dispatch({
            type:actionType.SET_TARGET_STATUS,
            payload:res.data.text
        })
        
    }else{
        dispatch(setLoading(false))

    }
}
export const getDetailTarget=(slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/target${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        return res
        
    }else{
        dispatch(setLoading(false))

    }
}