import React from 'react'
import { Button } from '@material-ui/core'
import TextField from 'components/TextField'
import AutoCompleteSelect from 'components/Select'
import avadefault from 'assets/icon/avadefault.svg'
import InputMask from 'react-input-mask'
import * as actionRm from 'redux/actions/rm'
import { handleFile,getBase64 } from 'components/handleFile'
export default function Index(props) {
    let {reducer,dispatch}=props
    let {rm,master}=reducer
    let {detail_rm}=rm
    const onChange=(e)=>{
        let {name,value}=e.target
        dispatch(actionRm.setRm({detail_rm:{...detail_rm,[name]:value}}))
    }
    const onChangeFile=(evt)=>{
        let handle=handleFile(evt)
        if(handle.file_error===null){
            getBase64(handle.file,(result)=>{
                dispatch(actionRm.setRm({detail_rm:{...detail_rm,fileBase64:result,filename:handle.file_name,file_url:URL.createObjectURL(handle.file)}}))
            })
        }
    }
    const onClickSave=async ()=>{
        let data={
            id:detail_rm.id,
            name:detail_rm.name,
            nik:detail_rm.nik,
            email:detail_rm.email,
            phone:detail_rm.phone,
            address:detail_rm.address,
            jobTitle:detail_rm.jobTitle,
            segmentId:detail_rm.segmentId.id,
            branchId:detail_rm.branchId.id,
            fileBase64:detail_rm.fileBase64,
            filename:detail_rm.filename,
            userId:props.profile.id,
            platformId:2
        }
        if(props.tab==='add'){
            let res=await dispatch(actionRm.postRm(data))
            if(res){
                props.settab('detail')
                dispatch(actionRm.setRm({detail_rm:{...detail_rm,id:res.data.id}}))
            }
        }else if(props.tab==='edit'){
            dispatch(actionRm.putRm(data))

        }else{
            props.settab('edit')
        }
    }
    const handleDisable=()=>{
        if(props.profile.roleId!==1){
            return true
        }else{
            return false
        }
    }
    const handleDisable2=()=>{
        if(props.tab==='detail'){
            return true
        }else{
            return false
        }
    }
    return (
        <div>
            <div className='head-section'>
                <h4><b>Detail Profile</b></h4>
                <div className='div-flex'>
                <Button onClick={()=>props.settab('list')} className='head-add-section__btn remove-boxshadow' variant='outlined' color="secondary">Back</Button>&nbsp;
                <Button onClick={onClickSave} className='head-add-section__btn remove-boxshadow' variant='contained' color="secondary">{props.tab==='detail'?'Edit':'Save'}</Button>
                </div>
                
            </div>
            <div className='card-content'>
                <div className='div-flex div-space-between' style={{padding:20,gap:30,alignItems:'flex-start'}}>
                    <div style={{width:'50%'}}>
                        <p className='semi-bold'>User Information</p>
                        <TextField
                            label="Name"
                            onChange={onChange}
                            value={detail_rm.name}
                            color='primary'
                            variant='outlined'
                            size='small'
                            name='name'
                            style={{marginBottom:20}}
                            disabled={handleDisable()}
                        />
                        <TextField
                            label="NIK"
                            onChange={onChange}
                            value={detail_rm.nik}
                            color='primary'
                            variant='outlined'
                            size='small'
                            name='nik'
                            style={{marginBottom:20}}
                            disabled={handleDisable()}
                        />
                        <TextField
                            label="Job Title"
                            onChange={onChange}
                            value={detail_rm.jobTitle}
                            color='primary'
                            variant='outlined'
                            size='small'
                            name='jobTitle'
                            style={{marginBottom:20}}
                            disabled={handleDisable()}
                        />
                        <AutoCompleteSelect
                            onChange={(event,value)=>dispatch(actionRm.setRm({detail_rm:{...detail_rm,segmentId:value}}))}
                            options={master.segments}
                            value={detail_rm.segmentId}
                            name="segmentId"
                            getOptionLabel={(option) => option.text}
                            label="Segment"
                            disableClearable
                            disabled={handleDisable()}
                        />  
                        <AutoCompleteSelect
                            onChange={(event,value)=>dispatch(actionRm.setRm({detail_rm:{...detail_rm,branchId:value}}))}
                            options={master.branches}
                            value={detail_rm.branchId}
                            getOptionLabel={(option) => option.text}
                            label="Branch"
                            disableClearable
                            disabled={handleDisable()}
                        />  
                        {/* <AutoCompleteSelect
                            onChange={(event,value)=>dispatch(actionRm.setRm({detail_rm:{...detail_rm,platformId:value}}))}
                            options={master.platform}
                            value={detail_rm.platformId}
                            getOptionLabel={(option) => option.text}
                            label="Platform"
                            disableClearable
                        />   */}
                    </div>
                    <div style={{width:'50%'}}>
                        
                        
                        <p className='semi-bold'>Contact</p>
                        <TextField
                            label="Email"
                            onChange={onChange}
                            value={detail_rm.email}
                            color='primary'
                            variant='outlined'
                            size='small'
                            name='email'
                            style={{marginBottom:20}}
                            disabled={handleDisable2()}
                        />
                        <InputMask
                                mask="9999-9999-9999-9999"
                                maskChar={null}
                                onChange={onChange}
                                value={detail_rm.phone}
                                disabled={handleDisable2()}
                            >
                            {() =>
                            <TextField
                                label="Phone No."
                                // onChange={onChange}
                                // value={target.status}
                                color='primary'
                                variant='outlined'
                                size='small'
                                name='phone'
                                style={{marginBottom:20}}
                            />}
                        </InputMask>
                        <TextField
                            label="Address"
                            onChange={onChange}
                            value={detail_rm.address}
                            color='primary'
                            variant='outlined'
                            size='small'
                            name='address'
                            multiline
                            style={{marginBottom:20}}
                            disabled={handleDisable2()}
                        />
                        <br/>
                        <p className='semi-bold'>Photo Profile</p>
                        <div className='div-flex div-align-center'>
                            <img src={detail_rm.file_url!==''?detail_rm.file_url:avadefault} style={{width:100,height:100,objectFit:'cover',borderRadius:'100%'}}/>
                            {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                            <Button disabled={handleDisable2()} component="label" style={{marginLeft:100}} onClick={null} className='btn-remove-capital btn-rounded' variant='contained' color="secondary">
                                Add Photo
                                <input
                                    type="file"
                                    style={{display:'none'}}
                                    onChange={onChangeFile}
                                />
                            </Button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
