import React,{useEffect} from 'react'
import { Button } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import Close from 'assets/icon/close.svg'
import { getTeam } from 'redux/actions/team'
import Loader from './LoadingCard'
import _ from 'lodash'
import { modalToggle } from 'redux/actions/general'
import * as actionTeam from 'redux/actions/team'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#3b99eb',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#fa3e2e',
            contrastText: '#FFFFFF',
        }
    } 
})

export default function List(props) {
    let {dispatch,reducer}=props
    let {team,general}=reducer
    useEffect(() => {
        dispatch(getTeam())
    }, [])
    const addTeam=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Create Team",
            modal_component: "team",
            modal_data:null ,
            modal_size:350,
            modal_action:'add_team'
        }))
    }
    const editTeam=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Edit Team",
            modal_component: "team",
            modal_data:data,
            modal_size:350,
            modal_action:'edit_team'
        }))
    }
    const deleteAction=(data)=>{
        dispatch(actionTeam.deleteTeam(data.id))
    }
    const deleteTeam=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `list`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:`Team ${data.text} ?`,
                modalAction:()=>deleteAction(data),
                msg:`<p></p>`
            },
            modal_action:'delete_team'
        }))
    }
    let dataDelete={
        id:0,
        name:'',
        leaderId:0,
        mentorId:0,
        members:[]
    }
    const deleteActionMember=(data,rm)=>{
        let new_member=[]
        data.members.map((d)=>{
            if(rm.id!==d.id){
                new_member.push(d.id)
            }
        })
        dataDelete.id=data.id
        dataDelete.name=data.text
        dataDelete.leaderId=data.leader?data.leader.id:0
        dataDelete.mentorId=data.mentor?data.mentor.id:0
        dataDelete.members=new_member
        dispatch(actionTeam.putTeam(dataDelete))
    }
    const deleteActionLeader=(data,rm)=>{
        let new_member=[]
        data.members.map((d)=>{
            new_member.push(d.id)
        })
        dataDelete.id=data.id
        dataDelete.name=data.text
        dataDelete.leaderId=0
        dataDelete.mentorId=data.mentor?data.mentor.id:0
        dataDelete.members=new_member
        dispatch(actionTeam.putTeam(dataDelete))
        // dispatch(actionTeam.deleteTeam(data.id))
    }
    const deleteActionMentor=(data,rm)=>{
        let new_member=[]
        data.members.map((d)=>{
            new_member.push(d.id)
        })
        dataDelete.id=data.id
        dataDelete.name=data.text
        dataDelete.leaderId=data.leader?data.leader.id:0
        dataDelete.mentorId=0
        dataDelete.members=new_member
        dispatch(actionTeam.putTeam(dataDelete))
    }
    const renderAction=(data,rm,name)=>{
        if(name==='leader'){
            deleteActionLeader(data,rm)
        }
        if(name==='mentor'){
            deleteActionMentor(data,rm)
        }
        if(name==='members'){
            deleteActionMember(data,rm)
        }
    }
    const deleteTeamRm=(data,rm,name)=>{
       
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `list`,
            modal_component: "confirm_delete",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                title:`RM from team ?`,
                modalAction:()=>renderAction(data,rm,name),
                msg:`<p>Are you sure delete from <b>${rm.text}</b> dari team <b>${data.text}</b></p>`
            },
            modal_action:'delete_team'
        }))
    }
    return (
        <div>
             <div className='head-section'>
                <h4><b>Team Configuration</b></h4>
                <Button onClick={addTeam} className='btn-remove-capital btn-rounded' variant='contained' color="primary">Create Team</Button>
            </div>
            <br/>
            {general.isLoadingTable?
            <Loader/>
            :
            <div className='team-grid'>
                {team.list_team.map((data,i)=>(
                    <div className='team-card' key={i}>
                        <div className='team-head'>
                            <p><b>{data.text}</b></p>
                            <div className='div-flex'>
                                <MuiThemeProvider theme={themeButton}>
                                    <Button onClick={()=>editTeam(data)} className='btn-remove-capital' variant="text" color="primary">Edit</Button>
                                    <Button onClick={()=>deleteTeam(data)} className='btn-remove-capital' variant="text" color="secondary">Delete</Button>
                                </MuiThemeProvider>
                            </div>
                        </div>
                        <div className='team-body'>
                            {data.mentor!==null&&
                            <div className='team-wrapper'>
                                <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}>Mentor</p>
                                <div className='team-item'>
                                    <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                                        <p style={{fontWeight:'bold',margin:0,color:'#3b99eb',cursor:'pointer',fontSize:14}}>{data.mentor.text}</p>
                                        <img onClick={()=>deleteTeamRm(data,data.mentor,'mentor')} src={Close} style={{cursor:'pointer',width:15}}/>
                                    </div>
                                    <div style={{width:'100%',height:1,backgroundColor:'#cccccc'}}></div>
                                    
                                </div>
                            </div>}
                            {data.leader!==null&&
                            <div className='team-wrapper' key={i}>
                                <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}>Leader</p>
                                <div className='team-item'>
                                    <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                                        <p style={{fontWeight:'bold',margin:0,color:'#3b99eb',cursor:'pointer',fontSize:14}}>{data.leader.text}</p>
                                        <img onClick={()=>deleteTeamRm(data,data.leader,'leader')} src={Close} style={{cursor:'pointer',width:15}}/>
                                    </div>
                                </div>
                            </div>}
                            
                            {!_.isEmpty(data.members)&&
                            <div className='team-wrapper'>
                                
                                <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}>Members</p>
                                {data.members.map((member,i)=>(
                                    <div className='team-item' key={i}>
                                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                                            <p style={{fontWeight:'bold',margin:0,color:'#3b99eb',cursor:'pointer',fontSize:14}}>{member.text}</p>
                                            <img onClick={()=>deleteTeamRm(data,member,'members')} src={Close} style={{cursor:'pointer',width:15}}/>
                                        </div>
                                        <div style={{width:'100%',height:1,backgroundColor:'#cccccc'}}></div>
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}
