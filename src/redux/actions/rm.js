import * as actionType from 'redux/constants/rm'
import * as actionGeneral from './general'
import {apiCall} from 'service/apiCall'
import _ from "lodash";
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import moment from 'moment'
import { saveAs } from 'file-saver'

import Cookie from 'universal-cookie'
const cookie=new Cookie()
const token=cookie.get('login_cookie')
const profile=cookie.get('profile_cookie')
export const setRm=(obj)=>async dispatch=>{
    dispatch({
        type:actionType.SET_RM,
        payload:obj
    })
}
export const getRmList=(slug)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoadingTable(true))
    let dataReq={
        url:`/pipeline/list/rm${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},

        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(setRm({list_rm:res.data.items}))
        dispatch(setRm({pagination:res.data.info}))
        dispatch(actionGeneral.setLoadingTable(false))
        return res
    }else{
        dispatch(actionGeneral.setLoadingTable(false))

    }
}

export const postRm=(data)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/rm`,
        method:'POST',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
            data
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Relations Manager",
            modal_component: "add_rm",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Add RM successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        dispatch(actionGeneral.setLoading(false))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}

export const putRm=(data)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/rm/${data.id}`,
        method:'PUT',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
            data
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===204){
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Relations Manager",
            modal_component: "add_rm",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Update RM successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        dispatch(actionGeneral.setLoading(false))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}

export const deleteRm=(id)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/rm/${id}/${profile.id}`,
        method:'DELETE',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        dispatch(actionGeneral.modalToggle({ 
            modal_open: true,
            modal_title: "Relations Manager",
            modal_component: "add_rm",
            modal_size:400,
            modal_type:'alert',
            modal_data:{
                msg:`<p>Delete RM successfully</p> `,
                ...res.data
            },
            modal_action:'success',
            // success_msg:success_msg
        }))
        dispatch(actionGeneral.setLoading(false))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}


export const getDetailRm=(id)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/rm/${id}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},

        }
    }
    let res=await dispatch(apiCall(dataReq))
    if(_.get(res,'status')===200){
        let {data}=res
        dispatch(setRm({
            detail_rm:{
                id:data.id,
                name:data.name,
                nik:data.nik,
                email:data.email,
                phone:data.phone,
                address:data.address,
                jobTitle:data.jobTitle,
                platformId:data.platform,
                segmentId:data.segment,
                branchId:data.branch,
                fileBase64:'',
                filename:'',
                file_url:data.fileUrl
            }
        }))
        dispatch(actionGeneral.setLoading(false))
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}
export const getExcelRm=(slug,name,year)=>async(dispatch)=>{
    dispatch(actionGeneral.setLoading(true))
    let dataReq={
        url:`/pipeline/export/visit${slug}`,
        method:'GET',
        data:{
            headers:{ 'Authorization': `Bearer ${token}`},
        }
    }
    let resvisit=await dispatch(apiCall(dataReq))
    if(_.get(resvisit,'status')===200){
        const wb = new ExcelJS.Workbook()
        const sheet1 = wb.addWorksheet(`Sales visit`);
        let header=resvisit.data.headers
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
        resvisit.data.items.map((data)=>{
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
        let dataReq={
            url:`/pipeline/export/proposal${slug}`,
            method:'GET',
            data:{
                headers:{ 'Authorization': `Bearer ${token}`},
            }
        }
        let res=await dispatch(apiCall(dataReq))
        if(_.get(res,'status')==200){
            dispatch(actionGeneral.setLoading(false))

            const sheet2 = wb.addWorksheet(`Proposal`);
            let header=res.data.headers
            var borderStyles = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
            sheet2.getRow(1).values=header

            sheet2.columns=[
                {key:'no',width:5},
                {key:'name',width:30},
                {key:'client',width:30},
                {key:'type',width:20},
                {key:'sentBy',width:15},
                {key:'sendDate',width:15},
                {key:'proposalValue',width:15},
            ]
            res.data.items.map((data)=>{
                sheet2.addRow({
                    no:data.no,
                    name:data.name,
                    client:data.client,
                    type:data.type,
                    sentBy:data.sentBy,
                    sendDate:moment(data.sentDate).format('DD-MMM-YYYY'),
                    proposalValue:data.proposalValue
                })
            })
            sheet2.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                    cell.border = borderStyles;
                    cell.alignment={ vertical: 'middle', horizontal: 'center' }
                });
            });
            const buf = await wb.xlsx.writeBuffer()

            saveAs(new Blob([buf]), `${name} sales visit & proposal ${year}.xlsx`)
        }else{
            dispatch(actionGeneral.setLoading(false))

        }
        return res
    }else{
        dispatch(actionGeneral.setLoading(false))

    }
}