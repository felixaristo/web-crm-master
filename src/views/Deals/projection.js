import React,{useState,useEffect} from 'react'
import {Button,TextField,CircularProgress } from '@material-ui/core'
import filter from 'assets/icon/filter.svg'
import { Icon, Step } from 'semantic-ui-react'
import {initialData} from './initialData'
import {DragDropContext, Droppable,Draggable} from 'react-beautiful-dnd';
import Add from 'assets/icon/Add.svg'
import { useDispatch, useSelector } from "react-redux";
import {modalToggle, setLoading} from 'redux/actions/general'
import {getContact,getEmployee} from 'redux/actions/master'
import {getPipeline,updateStageProjection,setCardsProjection,setDeals,setCards,setCardOrder,updateStage, setProposal,getDetailDeal,getProject} from 'redux/actions/pipeline'
import Chevron from 'assets/icon/chevron-right.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import NumberFormat from 'react-number-format';
import Checklist from 'assets/icon/checklist.png'
import {isEmpty} from 'lodash'
import * as actionType from 'redux/constants/pipeline'
import ChevronBlue from 'assets/icon/chevron-right-blue.svg'
import moment from 'moment'
import {handle_access} from 'service/handle_access'

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            // main:'#FF7165',
            main:'#ff7165',
            contrastText: '#FFFFFF',
            // contrastText: '#777777',
        }
    } 
})
const themeField = createMuiTheme({  
    palette: {  
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',

        },
        secondary:{
            main:'#3B99EB',
            contrastText: '#FFFFFF',

        }
    } 
})
const useStyles = makeStyles(theme => ({
    textField: {
      [`& fieldset`]: {
        borderRadius: 10,
      },
      width:'100%',
      marginBottom:15
  }
  
}));
const getProbability=(key)=>{
    switch (key) {
        case 10:
            return 0.1
            break;
        case 20:
            return 0.2
            break;
        case 30:
            return 0.3
            break;
        case 40:
            return 0.4
            break;
        case 50:
            return 0.5
            break;
        case 60:
            return 0.6
            break;
        case 70:
            return 0.7
            break;
        case 80:
            return 0.8
            break;
        case 90:
            return 0.9
            break;
            case 100:
                return 1
        default:
            break;
    }
}
const Deals=(props)=>{
    const [modal,openModal]=useState('')
    const general=useSelector(state=>state.general)
    const master=useSelector(state=>state.master)
    const dispatch=useDispatch()
    
    
    const detailDeal=async (clientId,dealId)=>{
        await dispatch(getDetailDeal(props.token,dealId))
        await dispatch(getContact(props.token,clientId))
        await dispatch(getEmployee(props.token))
        props.tabsToggle('detail','projection')
       
        
        
    }
    const editPaymentPeriod=(data)=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: `Edit Invoice Period ${data.title}`,
            modal_component: "payment_period_project",
            modal_data:data ,
            modal_size:350,
            modal_action:'edit_payment_period',
        }))
    }
    const renderTextStageColor=(prob)=>{
        if(prob>=10&& prob<=30){
            return '#ff6e79'
        }else if(prob>=40&&prob<=60){
            return '#ffb100'
        }else{
            return '#70bf4e'
        }
    }
    const renderTextAgeColor=(age)=>{
        if(age<=30){
            return '#4e8637'
        }else if(age>=30&&age<=90){
            return '#ffb100'
        }else{
            return '#ff6e79'
        }
    }
   
    const renderLoader=(loading)=>{
        return(
            <div style={{width:180,height:100,display:'flex',justifyContent:'center',alignItems:'center'}}>
                {loading?<CircularProgress color="secondary" size={30}/>
                :renderSucces()}
            </div>
        )
    }
    const renderSucces=()=>{
        // // console.log('object', object)
        // alert('oyyyy')
        return(
            <div className='success-drag' >
                <img src={Checklist} style={{width:60}}/>
            </div>
        )
    }
    // console.log('props.profile', props)
    return(
        <Draggable draggableId={props.project.id} index={props.index}>
            {(provided)=>(
                <div className='deals-card'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {props.loading[props.project.id]?
                    renderLoader(props.loading[props.project.id])
                    :
                    props.updated[props.project.id]?renderSucces():
                    
                    <div className='deals-card-content'>
                        <p className='deals-card-title' onClick={()=>detailDeal(props.project.clientId,props.project.dealId)}>
                            {props.project.title.length>60?`${props.project.title.substring(0,60)}...`:props.project.title}
                            {props.project.title.length>60&&<span className='tooltip-text'>{props.project.title}</span>}

                        </p>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <p className='deals-card-company' style={{maxWidth:140}}>{props.project.clientName}</p>
                            {handle_access(props.profile.id,props.profile.roleId,props.project.access,props.project.rms)&&<div className='circle-chevron' onClick={()=>editPaymentPeriod(props.project)}>
                                <img src={Chevron} style={{width:7}}/><br/>
                            </div>}
                            
                        </div>
                        <div className='deals-card-footer'>
                                <div className='proposal-value'>
                                    
                                    <p style={{color:'#4e8637',cursor:'pointer',fontWeight:'bold',fontSize:12}}>IDR <NumberFormat value={props.project.value.toString().length>=8?`${Math.round(props.project.value/1000000)}`:props.project.value} displayType={'text'} thousandSeparator={true}  /> {props.project.value.toString().length>=8&&'M'}</p>
                                    <span className='tooltip-text-proposal-value'>
                                        <div className='div-flex ' style={{justifyContent:'center'}}>
                                        IDR&nbsp;<NumberFormat value={props.project.value.toString().length>=8?`${Math.round(props.project.value/1000000)}`:props.project.value} displayType={'text'} thousandSeparator={true}  />
                                        </div>
                                    </span>
                                </div>
                                {/* <p style={{color:'#70bf4e'}}>IDR <NumberFormat value={props.project.value.toString().length>=8?`${Math.round(props.project.value/1000000)}`:props.project.value} displayType={'text'} thousandSeparator={true}  /> {props.project.value.toString().length>=8&&'M'}</p> */}
                                <p style={{color:renderTextAgeColor(props.project.age),fontSize:10}}>{props.project.age} day &nbsp;&nbsp;<span style={{color:renderTextStageColor(props.project.probability)}}>{getProbability(props.project.probability)}</span></p>
                        </div>
                    </div>
                    } 
                    
                </div>
            )}
        </Draggable>
        
    )
}
const Card=({cardOrder,card,project,tabsToggle,index,token,loading,updated,profile})=>{
    const dispatch=useDispatch()
    const addDeal=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Add new deal",
            modal_component: "add_deal",
            modal_data:card.card_probability ,
            modal_size:500,
            modal_action:'add_deal'
        }))
    }
    console.log('project', project)
    let price=0
    project.map((data)=>{
        price+=data.value
    })
    const renderFontSize=(digit)=>{
        if(digit>11){
            return 12
        }else if(digit>12){
            return 10
        }else if(digit<11){
            return 14
        }
    }
    console.log('price.length', price.toString().length)
    return(
        <div className='pipeline-container'>
            <div className={index===cardOrder.length-1?'pipeline-step-last':'pipeline-step'} style={{zIndex:5-index,justifyContent:card.id==='proposal-development'?'flex-end':'center'}}>
                <p>{card.title}</p>
            </div>
                <Droppable droppableId={card.id}>
            {(provided)=>(
                <div className='pipeline-deals'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {project.map((project,index)=><Deals profile={profile} updated={updated} loading={loading} token={token} tabsToggle={tabsToggle} card_probability={card.card_probability} card_id={card.id} key={project.id} project={project} index={index}/>)}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            <div className='projection-card-footer' style={{fontSize:renderFontSize(price.toString().length)}}>
                Total : IDR &nbsp;<NumberFormat value={price.toString().length>=8?`${Math.round(price/1000000)}`:price} displayType={'text'} thousandSeparator={true}  />&nbsp;{price.toString().length>=8&&'M'}
            </div>
            

        </div>
    )
}
export default function Projection(props) {
    const pipeline=useSelector(state=>state.pipeline)
    const master=useSelector(state=>state.master)
    const [prob,setProb]=useState()
    const [total_after,setTotalAfter]=useState(null)
    const state=pipeline
    const [modal,setModal]=useState(false)
    const [modal_action,openModal]=useState('')
    const [backdrop,openBackdrop]=useState(false)

    const [loading,setLoading]=useState({})
    const [updated,setUpdated]=useState({})
    console.log('cardProjectionOrder', state.cardProjectionOrder)
    const dispatch=useDispatch()
    const classes=useStyles()
    let {tribe,segment,rm,probability,periode,textPeriode}=pipeline.filter
    useEffect(() => {
        // if(isEmpty(pipeline.projection)){
           
        // }
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        dispatch( getProject(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`))
        setTotalAfter(null)
        
    }, [])
    const countToggle=()=>{
        openBackdrop(!backdrop)
        setModal(!modal)
    }
    
    const onDragEnd=async (result)=>{
        const {draggableId, source, destination, type} = result;
        if(!destination){
          return;
        }
        if(destination.droppableId===source.droppableId&&destination.index===source.index){
          return;
        }
        const start = state.card_projections[source.droppableId];
        const finish = state.card_projections[destination.droppableId];
        if(start===finish){
            // alert('ehee')
            const card=state.card_projections[source.droppableId]
            const newDealsId=Array.from(card.projectsId)
            newDealsId.splice(source.index,1)
            newDealsId.splice(destination.index,0,draggableId)
            const newCard={
              ...card,
              projectsId:newDealsId
            }
            const newState={
              
                ...state.card_projections,
                [newCard.id]:newCard
            }
            dispatch(setCardsProjection(newState))
            return
        }

        const startDealId = Array.from(start.projectsId);
        startDealId.splice(source.index, 1);
        const newStart = {
            ...start,
            projectsId: startDealId
        }
    
        const finishDealId = Array.from(finish.projectsId);
        finishDealId.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            projectsId: finishDealId
        }
        const newState = {
            ...state.card_projections,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
            
        }
        dispatch(setCardsProjection(newState))
        setLoading({[draggableId]:true})
        console.log('finish', finish)
        await dispatch(updateStageProjection(props.token,`/${state.projection[draggableId].dealId}/${draggableId}/${finish.month}/${finish.year}/${props.profile.id}`))
        await setLoading({[draggableId]:false})
        setUpdated({[draggableId]:true})
        setTimeout(()=>setUpdated({[draggableId]:false}),2000)
        return;
        
    }
    const countProb=()=>{
        countToggle()
        let total=prob*state.total_pv_project
        console.log('total', total)
        setTotalAfter(total)
    }
    const modalsToggle=(deals)=>{
        backdropToggle()
        openModal({
            ...modal_action,
            [deals]:!modal_action[deals]
        })
    }
    const backdropToggle=()=>{
        openBackdrop(!backdrop)
        openModal('')
        setModal(false)
    }
    const addFilter=()=>{
        
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Pipeline Filter",
            modal_component: "pipeline_filter",
            modal_data:null ,
            modal_size:300,
            modal_action:'add_projection_filter',
        }))
    }
    const tabsToggle=(key,back)=>{
        props.tabToggle(key,back)
    }
    const addDeal=()=>{
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Add new deal",
            modal_component: "add_deal",
            modal_data:null ,
            modal_size:500,
            modal_action:'add_deal'
        }))
    }
    let tribe_filter=master.tribes.filter((data)=>{return data.id===tribe})
    let segment_filter=master.segments.filter((data)=>{return data.id===segment})
    let rm_filter=master.rm.filter((data)=>{return data.value===rm})
    // console.log('moment.months()', moment().subtract(1,'month').format('MMM'))
    // console.log('moment.duration().months()', moment.monthsShort())
    return (
        <div>
            
            <div className='head-section'>
                <div style={{display:'flex',alignItems:'center'}}>
                <Button style={{fontWeight:600,color:'#3B99EB'}} onClick={()=>props.tabToggle('pipeline','projection')} size='small'  variant='text' className='btn-remove-capital ' >Pipeline</Button>
                &nbsp;
                <img src={ChevronBlue} style={{width:5}}/>
                &nbsp;&nbsp;
                <p className='bold'>Projection deal</p>
                {/* <Button onClick={addDeal} size='small'  variant='text' className='btn-remove-capital ' >Projection deal</Button> */}
                </div>
                <div style={{display:'flex',alignItems:'center',}}>
                    <div>
                        <p className='pipeline-filterby'><b>Filter by:</b></p>
                        <div style={{display:'flex',flexWrap:'wrap',width:500}}>
                            <p className='pipeline-filterby'>Tribe : {tribe===0?'All Tribe':tribe_filter[0].text}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <p className='pipeline-filterby'>Deal period : {textPeriode}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <p className='pipeline-filterby'>Segment : {segment===0?'All Segment':segment_filter[0].text} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <p className='pipeline-filterby'>RM : {rm!==null?rm.label:'All RM'} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <p className='pipeline-filterby'>{probability.length>0&&"Probability: "+probability.map((data)=>`${getProbability(data.id)}`)} &nbsp;&nbsp;&nbsp;&nbsp;</p>
                            
                        </div>
                    </div>
                    <button onClick={addFilter} className='card-table__head_btn'><img src={filter} style={{width:20}}/>&nbsp;&nbsp;Filter</button>
                </div>
            </div>
            <br/>
            <div className='pipeline-wrapper'>
            <DragDropContext onDragEnd={onDragEnd}>

                {state.cardProjectionOrder.map((cardId,index)=>{
                    const card=state.card_projections[cardId]
                    const project=card.projectsId.map(projectsId=>state.projection[projectsId])
                    return <Card cardOrder={state.cardOrder} updated={updated} loading={loading} token={props.token} profile={props.profile} tabsToggle={tabsToggle} key={cardId} card={card} project={project} index={index}/>
                })}
            </DragDropContext>

            </div>
            <div className='pipeline-footer'>
                <div onClick={backdropToggle} style={{zIndex:2,width:'100%',height:700,position:'absolute',left:0,display:backdrop?'block':'none'}}></div>
                <p>Total proposal value: IDR <NumberFormat value={state.total_pv_project.toString().length>=7?`${Math.round(state.total_pv_project/1000000)}`:state.total_pv_project} displayType={'text'} thousandSeparator={true}  /> {state.total_pv_project.toString().length>=7&&'M'}</p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <p>Total after Probability: IDR {total_after!==null&&<NumberFormat value={total_after.toString().length>=7?`${Math.round(total_after/1000000)} M`:total_after} displayType={'text'} thousandSeparator={true}  />}&nbsp;{total_after!==null&&total_after.toString().length>=7&&'M'}&nbsp;&nbsp;<Button onClick={countToggle} size='small' color='primary' variant='outlined' className='btn-remove-capital btn-rounded' style={{width:90,height:30,backgroundColor:'white'}}>Count it</Button></p>
                <div className='modal-count-probability' style={{display:modal?'flex':'none'}}>
                    <div style={{width:'60%'}}>
                    <TextField
                        label='Probability'
                        type='text'
                        value={prob}
                        onChange={(e)=>setProb(e.target.value)}
                        variant='outlined'
                        size='small'
                        className={classes.textField}
                        style={{margin:0}}
                    />
                    </div>
                    <Button onClick={countProb}  size='small' color='primary'  variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{width:120,height:30}}>Count it</Button>

                </div>
            </div>
        </div>
    )
}
