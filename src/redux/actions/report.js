import * as actionType from '../constants/report'
import {setLoading,setLoadingTable,modalToggle,setLoadingTable2} from './general'
// import {alertToggle} from './alert'
import {apiCall} from '../../service/apiCall'
import {getDetailDeal} from './pipeline'
import { get,isEmpty ,camelCase,groupBy} from "lodash";
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import moment from 'moment'
import { saveAs } from 'file-saver'
export const reportFilter=(data)=>(dispatch)=>{
    dispatch({
        type:actionType.SET_REPORT_FILTER,
        payload:data
    })
}
export const setFilterIndividualAll=(data)=>dispatch=>{
    dispatch({
        type:actionType.SET_FILTER_INDIVIDUAL_ALL,
        payload:data
    })
}
export const addTarget=(token,data)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/pipeline/target`,
        method:'POST',
        data:{
            data,
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==204){
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: "Success",
            modal_component: "add_target",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>sales target  successfully added</p> `
            },
            modal_action:'success'
        }))
        dispatch(setLoading(false))

    }else{
        dispatch(setLoading(false))

    }
}

export const getSummaryReport=(token)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/report/summary`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoading(false))
        dispatch({
            type:actionType.GET_SUMMARY_REPORT,
            payload:res.data
        })
    }else{
        dispatch(setLoading(false))

    }
}
export const getReportProjected=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable(true))
    let dataReq={
        url:`/Pipeline/report/projected${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable(false))
        let total={
            total1:0,
            total2:0,
            total3:0
        }
        res.data.items.map((data)=>{
            total.total1+=data.amount1
            total.total2+=data.amount2
            total.total3+=data.amount3
        })
        let new_res={
            ...res.data,
            total:total
        }
        dispatch({
            type:actionType.GET_REPORT_TABLE,
            payload:new_res
        })
        return res
    }else{
        dispatch(setLoadingTable(false))

    }
}
export const getReportInvoice=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable(true))
    let dataReq={
        url:`/Pipeline/report/invoice${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable(false))
        
        let total={
            total1:0,
            total2:0,
            total3:0,
            total_percent1:0,
            total_percent2:0,
        }
        let new_item=[]
        res.data.items.map((data)=>{
            total.total1+=data.amount1
            total.total2+=data.amount2
            total.total3+=data.amount3
            let percen1=((data.amount2-data.amount1)/data.amount1)*100;
            let percen2=((data.amount3-data.amount2)/data.amount2)*100;
            let perc1=''
            let perc2=''
            if(data.amount1!==0&&data.amount2!==0){
                perc1=parseInt(percen1)
            }else if(data.amount1===0&&data.amount2===0){
                perc1='='
            }else if(data.amount1!==0&&data.amount2===0){
                perc1=parseInt(percen1)
            }else if(data.amount1===0&&data.amount2!==0){
                perc1=''
            }else{
                perc1=''
            }

            if(data.amount2!==0&&data.amount3!==0){
                perc2=parseInt(percen2)
            }else if(data.amount2===0&&data.amount3===0){
                perc2='='
            }else if(data.amount2!==0&&data.amount3===0){
                perc2=parseInt(percen2)
            }
            else if(data.amount2===0&&data.amount3!==0){
                perc2=''
            }else{
                perc2=''
            }
            new_item.push({...data,percent1:perc1,percent2:perc2})
            // if(data.amount1!==0&&data.amount2!==0){
            //     new_item.push({...data,percent1:parseInt(percen1),percent2:parseInt(percen2)})

            // }else if(data.amount1===0&&data.amount2===0&&data.amount3===0){
            //     new_item.push({...data,percent1:'=',percent2:'='})

            // }else if(data.amount1===0&&data.amount2===0){
            //     new_item.push({...data,percent1:'=',percent2:''})

            // }else{
            //     new_item.push({...data,percent1:'',percent2:''})

            // }
        })
        console.log('new_item', new_item)
        let count_percent1=((total.total2-total.total1)/total.total1)*100
        let count_percent2=((total.total3-total.total2)/total.total2)*100
        console.log('count_percent2', count_percent2,count_percent1)
        if(total.total1!==0&&total.total2!==0){
            total.total_percent1=count_percent1.toFixed(0)
            total.total_percent2=count_percent2.toFixed(0)
        }else if(total.total1===0&&total.total2===0&&total.total3===0){
            total.total_percent1='='
            total.total_percent2='='
        }else if(total.total1===0&&total.total2===0){
            total.total_percent1='='
            total.total_percent2=''
        }else{
            total.total_percent1=''
            total.total_percent2=''
        }
        let new_res={
            ...res.data,
            items:new_item,
            total:total
        }
        dispatch({
            type:actionType.GET_REPORT_TABLE,
            payload:new_res
        })
        return res
    }else{
        dispatch(setLoadingTable(false))

    }
}

export const getChart=(token,slug)=>async(dispatch)=>{
    dispatch(setLoading(true))
    let dataReq={
        url:`/Pipeline/report/chart${slug}`,
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
            type:actionType.GET_CHART,
            payload:new_chart
        })
        console.log('new_chart', new_chart)
    }else{
        dispatch(setLoading(false))

    }
}
export const getReportExcel=(token,slug,from,to,year,tribe)=>async(dispatch)=>{
    dispatch(setLoading(true))
    console.log('tribe', tribe)
    let dataReq={
        url:`/Pipeline/export/chart${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){     
        dispatch(setLoading(false))
        
        const wb = new ExcelJS.Workbook()

        const sheet1 = wb.addWorksheet(`# Proposal ${tribe}`);
        /*TITLE*/
        sheet1.mergeCells('A2', 'C2');
        sheet1.getCell('A2').value = 'Number and Values of Proposal'
        sheet1.mergeCells('A3', 'C3');
        sheet1.getCell('A3').value = `${moment().months(from-1).format('MMM')} - ${moment().months(to-1).format('MMM')} ${year}`

        let header=res.data.sheet1.headers
        sheet1.getRow(5).values =header;
        var borderStyles = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        sheet1.columns = [
            {key:'no',width:5},
            {key:'company',width:30},
            {key:'tribe',width:20},
            {key:'segment',width:10},
            {key:'rm',width:30},
            {key:'dealName',width:30},
            {key:'amount',width:15},
        ]
        res.data.sheet1.items.map((data)=>{
            sheet1.addRow({
                no:data.no,
                company:data.company,
                tribe:data.tribe,
                segment:data.segment,
                rm:data.rm,
                dealName:data.dealName,
                amount:data.amount
            })
        })

        sheet1.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                if(cell._address!=="A3"){
                    cell.border = borderStyles;
                }
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
              });
        });
        sheet1.getCell('A2').border = {
            top: {style:'hair'},
            left: {style:'hair'},
            bottom: {style:'hair'},
            right: {style:'hair'}
        };
        sheet1.getCell('A3').border = {
            top: {style:'hair'},
            left: {style:'hair'},
            bottom: {style:'hair'},
            right: {style:'hair'}
        };
        sheet1.getCell('A2').font = {
            name: 'Calibri',
            family: 4,
            size: 20,
            bold: true
        };
        sheet1.getCell('A3').font = {
            name: 'Calibri',
            family: 4,
            size: 20,
            bold: true
        };
        const lastrow = sheet1.lastRow;

        sheet1.getCell('A2').border = { vertical: 'top', horizontal: 'left' };
        sheet1.getCell('A3').border = { vertical: 'top', horizontal: 'left' };
        for (let index = 6; index <= lastrow._number; index++) {
            sheet1.getCell(`B${index}`).alignment={ vertical: 'top', horizontal: 'left' }
        }
        for (let index = 6; index <= lastrow._number; index++) {
            sheet1.getCell(`F${index}`).alignment={ vertical: 'top', horizontal: 'left' }
        }
        for (let index = 6; index <= lastrow._number; index++) {
            sheet1.getCell(`G${index}`).alignment={ vertical: 'top', horizontal: 'right' }
        }

        const sheet2 = wb.addWorksheet(`Sales Call ${tribe}`);
        /*TITLE*/
        sheet2.mergeCells('A2', 'C2');
        sheet2.getCell('A2').value = 'Sales Call'
        sheet2.mergeCells('A3', 'C3');

        
        sheet2.getCell('A3').value = `${moment().months(from-1).format('MMM')} - ${moment().months(to-1).format('MMM')} ${year}`
        
        let header2=[
            'No',
            'Month',
            'Segment',
            'Amount',
        ]
        
        sheet2.getRow(4).values =header2;
        let sheet2_col=[]
        var borderStyles = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        sheet2.columns = [
            {key:'no',width:5},
            {key:'month',width:20},
            {key:'segment',width:15},
            {key:'amount',width:10},
        ]
        let new_s2=groupBy(res.data.sheet2.items,(data)=>{return data.month})
        let gruping=Object.entries(new_s2)
        // console.log('new_s2', gruping)
        let asdf=[]
        res.data.sheet2.items.map((data)=>{
            let grandt=0
            let fil=gruping.filter((fil)=>{
                return fil[0]===data.month.toString()
            })
            fil[0][1].map((filmap)=>{

                grandt+=filmap.amount
            })
            asdf.push({...data,grand_total:grandt})
            // console.log('fil', fil)
            // new_s2.[data.month]
        })
        let total=0
        asdf.map((data)=>{
            total+=data.amount
            sheet2.addRow({
                no:data.no,
                month:moment().months(data.month-1).format('MMMM'),
                segment:data.segment,
                amount:data.amount,
            })
        })
        sheet2.addRow({
            no:"Total",
            amount:total
        })

        sheet2.mergeCells(`A${lastrow._number}`, `C${lastrow._number}`);
        sheet2.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                if(cell._address!=="A2"){
                    cell.border = borderStyles;
                    // console.log('cell', cell)
                }
                cell.alignment={ vertical: 'middle', horizontal: 'center' }
            });
        });
        sheet2.getCell('A2').border = {
            top: {style:'hair'},
            left: {style:'hair'},
            bottom: {style:'hair'},
            right: {style:'hair'}
        };
        sheet2.getCell('A2').font = {
            name: 'Calibri',
            family: 4,
            size: 20,
            bold: true
        };
        sheet2.getCell('A3').border = {
            top: {style:'hair'},
            left: {style:'hair'},
            bottom: {style:'hair'},
            right: {style:'hair'}
        };
        sheet2.getCell('A3').font = {
            name: 'Calibri',
            family: 4,
            size: 20,
            bold: true
        };
        const buf = await wb.xlsx.writeBuffer()

        saveAs(new Blob([buf]), `Sales Data_${tribe}_${moment().months(from-1).format('MMM')} - ${moment().months(to-1).format('MMM')}.xlsx`)
    }else{
        dispatch(setLoading(false))

    }
}
export const getAllReportExcel=(token,slug,from,to,year,tribe)=>async(dispatch)=>{
    dispatch(setLoading(true))
    console.log('tribe', tribe)
    let dataReq={
        url:`/Pipeline/export/${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){     
        dispatch(setLoading(false))
        const wb = new ExcelJS.Workbook();
        
        let borderStyles = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        const alignSetting=(sheet,cell,position)=>{
            sheet.getCell(cell).alignment={ vertical: 'middle', horizontal: position}

        }
        const fontSetting=(sheet,cell)=>{
            sheet.getCell(cell).font={
                name: 'Calibri',
                family: 4,
                size: 12,
                bold:true
            }
        }
        const sheet1 = wb.addWorksheet('Tribe');
        sheet1.mergeCells('A1','B1')
        sheet1.getCell('A1').value=res.data.sheet1.title
        sheet1.getCell('A1').font={
            name: 'Calibri',
                family: 4,
                size: 14,
                bold:true
        }
        sheet1.mergeCells('A2','B2')
        sheet1.getCell('A2').value=res.data.sheet1.period
        sheet1.getCell('A2').font={
            name: 'Calibri',
                family: 4,
                size: 14,
                bold:true
        }
        sheet1.getCell('A3').value="Generated on " + moment(res.data.generatedDate).format('DD-MM-YYYY HH:mm:ss')
        let sheet1_single_addres=['A','B','C','D','E','F']
        let sheet1_head=[
            'No.','Name','Tribe','Actual Prop No.','Actual Prop Value','Actual Sales Visit'
        ]
        sheet1_single_addres.map((d,i)=>{
            sheet1.getCell(`${d}4`).value=sheet1_head[i]
            fontSetting(sheet1,`${d}4`)
            alignSetting(sheet1,`${d}4`,'center')
        })
        let sheet1_colum=[
            {key:'no',width:10},
            {key:'name.',width:30},
            {key:'tribe.',width:30},
            {key:'actualNProposal',width:20},
            {key:'actualProposalValue',width:20},
            {key:'actualSalesVisit',width:20},

        ]
        sheet1.columns=sheet1_colum
        res.data.sheet1.items.map((data,i)=>{
            let row=[
                i+1,
                data.name,
                data.tribe,
                data.actualNProposal,
                data.actualProposalValue,
                data.actualSalesVisit
            ]
            sheet1.addRow(row)
        })
        sheet1.eachRow(function(row, rowNumber) {
            if(rowNumber>2){
                row.eachCell({ includeEmpty: true }, function(cell, cellNumber) {
                    cell.border = borderStyles;
                });
            }
           
        })


        const sheet2 = wb.addWorksheet('All');
        sheet2.mergeCells('A1','B1')
        sheet2.getCell('A1').value=res.data.sheet2.title
        sheet2.getCell('A1').font={
            name: 'Calibri',
                family: 4,
                size: 14,
                bold:true
        }
        sheet2.mergeCells('A2','B2')
        sheet2.getCell('A2').value=res.data.sheet2.period
        sheet2.getCell('A2').font={
            name: 'Calibri',
                family: 4,
                size: 14,
                bold:true
        }
        sheet2.getCell('A3').value="Generated on " + moment(res.data.generatedDate).format('DD-MM-YYYY HH:mm:ss')
        let sheet2_single_addres=['A','B']
        let sheet2_head=[
            'No.','Name'
        ]
        sheet2_single_addres.map((d,i)=>{
            sheet2.mergeCells(`${d}4`,`${d}5`)
            sheet2.getCell(`${d}4`).value=sheet2_head[i]
            fontSetting(sheet2,`${d}4`)
            alignSetting(sheet2,`${d}4`,'center')
        })
        
        //actual
        let actual_address=['C4','C5','D5','E5','F5']
        sheet2.mergeCells('C4','F4')
        sheet2.getCell('C4').value="Actual"
        sheet2.getCell('C5').value="Prop No."
        sheet2.getCell('D5').value="Prop Value"
        sheet2.getCell('E5').value="Sales Visit"
        sheet2.getCell('F5').value="Sales"
        actual_address.map((d)=>{
            fontSetting(sheet2,d)
            alignSetting(sheet2,d,'center')
        })

        

        //target
        let target_address=['G4','G5','H5','I5','J5']
        sheet2.mergeCells('G4','J4')
        sheet2.getCell('G4').value="Target"
        sheet2.getCell('G5').value="Prop No."
        sheet2.getCell('H5').value="Prop Value"
        sheet2.getCell('I5').value="Sales Visit"
        sheet2.getCell('J5').value="Sales"
        target_address.map((d)=>{
            fontSetting(sheet2,d)
            alignSetting(sheet2,d,'center')
        })

        //Achievement
        let achievement_address=['K4','K5','L5','M5','N5','O5']
        sheet2.mergeCells('K4','O4')
        sheet2.getCell('K4').value="Achievement"
        sheet2.getCell('K5').value="Prop No."
        sheet2.getCell('L5').value="Prop Value"
        sheet2.getCell('M5').value="Sales Visit"
        sheet2.getCell('N5').value="Sales"
        sheet2.getCell('O5').value="Average"
        achievement_address.map((d)=>{
            fontSetting(sheet2,d)
            alignSetting(sheet2,d,'center')
        })

        let sheet2_colum=[
            {key:'no',width:10},
            {key:'name.',width:30},
            {key:'actualNProposal.',width:20},
            {key:'actualProposalValue.',width:20},
            {key:'actualSalesVisit.',width:20},
            {key:'actualSales.',width:20},
            {key:'targetNProposal.',width:20},
            {key:'targetProposalValue.',width:20},
            {key:'targetSalesVisit.',width:20},
            {key:'targetSales.',width:20},
            {key:'achNProposal.',width:20},
            {key:'achProposalValue.',width:20},
            {key:'achSalesVisit.',width:20},
            {key:'achSales.',width:20},
            {key:'aveAch.',width:20},

        ]
        sheet2.columns=sheet2_colum
        res.data.sheet2.items.map((data,i)=>{
            let row=[
                i+1,
                data.name,
                data.actualNProposal,
                data.actualProposalValue,
                data.actualSalesVisit,
                data.actualSales,
                data.targetNProposal,
                data.targetProposalValue,
                data.targetSalesVisit,
                data.targetSales,
                data.achNProposal,
                data.achProposalValue,
                data.achSalesVisit,
                data.achSales,
                data.aveAch,
            ]
            sheet2.addRow(row)
        })
        sheet2.eachRow(function(row, rowNumber) {
            if(rowNumber>2){
                row.eachCell({ includeEmpty: true }, function(cell, cellNumber) {
                    cell.border = borderStyles;
                });
            }
           
        })

        


        const buf = await wb.xlsx.writeBuffer()
        
        

        saveAs(new Blob([buf]), `Sales Data All Tribe.xlsx`)
        

        // saveAs(new Blob([buf]), `Sales Data_${tribe}_${moment().months(from-1).format('MMM')} - ${moment().months(to-1).format('MMM')}.xlsx`)
    }else{
        dispatch(setLoading(false))

    }
}


export const getIndividualAll=(token,slug)=>async(dispatch)=>{
    dispatch(setLoadingTable2(true))
    let dataReq={
        url:`/pipeline/team/admin${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(get(res,'status')==200){
        dispatch(setLoadingTable2(false))
        let totalNProposal=0;
        let totalSalesVisit=0;
        let totalProposalValue=0;
        let totalSales=0;
        res.data.items.map((d)=>{
            totalNProposal+=d.nProposals;
            totalSalesVisit+=d.visits;
            totalProposalValue+=d.proposalValue;
            totalSales+=d.sales
        })
        dispatch({
            type:actionType.GET_INDIVIDUAL_ALL,
            payload:{...res.data,totalNProposal,totalSalesVisit,totalProposalValue,totalSales}
        })
    }else{
        dispatch(setLoadingTable2(false))

    }
}