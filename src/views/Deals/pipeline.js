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
import {getClient as getForClient} from 'redux/actions/client'
import {getPipeline,setDeals,setCards,setCardOrder,updateStage, setProposal,getDetailDeal} from 'redux/actions/pipeline'
import Chevron from 'assets/icon/chevron-right.svg'
import { MuiThemeProvider, createMuiTheme,withStyles,makeStyles
} from '@material-ui/core/styles'
import NumberFormat from 'react-number-format';
import Checklist from 'assets/icon/checklist.png'
import close from 'assets/icon/close.svg'
import {isEmpty} from 'lodash'
import * as actionType from 'redux/constants/pipeline'
import {handle_access} from 'service/handle_access'
import pipeline from 'redux/reducers/pipeline'
import moment from 'moment'

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
            break;
        default:
            break;
    }
}
const Deals=(props)=>{
    const general=useSelector(state=>state.general)
    const master=useSelector(state=>state.master)
    const dispatch=useDispatch()
    
    const addSalesVisit=async (clientId,dealId)=>{
        let res=await dispatch(getContact(props.token,clientId))
        if(res){
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))
            }
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `Sales Visit to ${res.data.client.company}`,
                modal_component: "sales_visit",
                modal_data:{clientId:clientId,dealId:dealId} ,
                modal_size:500,
                modal_action:'add_sales_visit'
            }))
        }
    }
    const detailDeal=async (clientId,dealId)=>{
        let res=await dispatch(getDetailDeal(props.token,dealId))
        
        if(res){
            
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))
            }
            props.tabsToggle('detail','pipeline')
        }
        
       
        
        
    }
    const addProposal=async (clientId,dealId)=>{
        
        dispatch(setProposal({
            dealId:dealId
        }))
        let res=await dispatch(getContact(props.token,clientId))
        if(res){
            if(master.employee.length<1){
                await dispatch(getEmployee(props.token))
            }
            dispatch({
                type:actionType.RESET_PROPOSAL
            })
            dispatch({
                type:actionType.SET_CLIENT_ID,
                payload:clientId
            })
            dispatch(modalToggle({
                modal_open: true,
                modal_title: `Upload Proposal for ${res.data.client.company}`,
                modal_component: "proposal",
                modal_data:{clientId:clientId,dealId:dealId} ,
                modal_size:550,
                modal_action:'add_proposal',
                modal_type:'multi'
            }))
        }
            
        
    }
    const wonDeal=(dealId,invoicePeriod)=>{
        if(invoicePeriod===0){
            
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Must include Invoice Period",
                modal_component: "on_authorize",
                modal_size:300,
                modal_type:'alert',
                modal_data:{
                    msg:"<p>Deal cant be won if invoice period still empty</p>"
                },
                modal_action:'on_authorize'
            }))
        }else{
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: `Yeaah!! did we win it?`,
                modal_component: "confirm2",
                modal_size:400,
                modal_type:'confirm',
                modal_data:{
                    dealId:dealId,
                    title:`Yeaah!! did we Won it?`,
                    msg:`<p>Congratulations on your achievement this time, thank you for giving your best.</p>`,
                    title_cancel:'No, Cancel',
                    title_yes:'Yes, Won it'
                },
                modal_action:'won_deal'
            }))
        }
        
    }
    const deleteDeal=(dealId)=>{
        props.backdropToggle()
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure delete this deal?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>This action will make deal delete permanent from our system</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, Delete deal'
            },
            modal_action:'delete_deal'
        }))
    }
    const lostDeal=(dealId)=>{
        dispatch(modalToggle({ 
            modal_open: true,
            modal_title: `Are you sure this deal is losing?`,
            modal_component: "confirm2",
            modal_size:400,
            modal_type:'confirm',
            modal_data:{
                dealId:dealId,
                msg:`<p>never mind, keep your spirits up. This offer will be on the <b>Lost Deal</b> list if at any time there are changes</p>`,
                title_cancel:'No, Cancel',
                title_yes:'Yes, lost it'
            },
            modal_action:'lost_deal'
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
            return '#FFB100'
        }else{
            return '#ff6e79'
        }
    }
   
    const renderLoader=(loading,isSuccess)=>{
        return(
            <div style={{width:180,height:100,display:'flex',justifyContent:'center',alignItems:'center'}}>
                {loading?<CircularProgress color="secondary" size={30}/>
                :renderSucces(isSuccess)}
            </div>
        )
    }
    const renderSucces=(isSuccess)=>{
        
        return(
            <div className='success-drag' >
                {isSuccess?
                <img src={Checklist} style={{width:60}}/>
                :
                <img src={close} style={{width:60}}/>

                }
            </div>
        )
    }
    
    return(
        <Draggable draggableId={props.deal.id} index={props.index}>
            {(provided)=>(
                <div className='deals-card'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {props.loading[props.deal.id]?
                    renderLoader(props.loading[props.deal.id],props.dragSuccess)
                    :
                    props.updated[props.deal.id]?renderSucces(props.dragSuccess):
                    
                    <div className='deals-card-content'>
                        <p className='deals-card-title' onClick={()=>detailDeal(props.deal.clientId,props.deal.id)}>
                            {props.deal.title.length>60?`${props.deal.title.substring(0,60)}...`:props.deal.title}
                            {props.deal.title.length>60&&<span className='tooltip-text'>{props.deal.title}</span>}

                        </p>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <p className='deals-card-company' style={{maxWidth:140}}>{props.deal.clientName}</p>
                            {handle_access(props.profile.id,props.profile.roleId,props.deal.access,props.deal.rms,props.deal.title)&&<div className='circle-chevron' onClick={()=>props.modalsToggle(props.deal.id)}>
                                <img src={Chevron} style={{width:7}}/><br/>
                            </div>}
                            
                        </div>
                        <div className='deals-card-footer'>
                                <div className='proposal-value'>
                                    
                                    <p style={{color:'#4e8637',cursor:'pointer',fontWeight:'bold',fontSize:12}}>IDR <NumberFormat value={props.deal.proposalValue.toString().length>=8?`${Math.round(props.deal.proposalValue/1000000)}`:props.deal.proposalValue} displayType={'text'} thousandSeparator={true}  /> {props.deal.proposalValue.toString().length>=8&&'M'}</p>
                                    <span className='tooltip-text-proposal-value'>
                                        <div className='div-flex ' style={{justifyContent:'center'}}>
                                        IDR&nbsp;<NumberFormat value={props.deal.proposalValue} displayType={'text'} thousandSeparator={true}  />
                                        </div>
                                    </span>
                                </div>
                                <p style={{color:renderTextAgeColor(props.deal.age),fontSize:10}}>{props.deal.age<0?0:props.deal.age} day &nbsp;&nbsp;<span style={{color:renderTextStageColor(props.deal.probability)}}>{getProbability(props.deal.probability)}</span></p>
                        </div>
                        <div className='deals-card-footer' style={{marginTop: 10}}>
                                <div className='proposal-value'>
                                    <p style={{color:'#4e8637',cursor:'pointer',fontWeight:'bold',fontSize:12}}>Status Update: {props.deal.statusDate === null?'-': moment(props.deal.statusDate).format('DD-MM-YYYY')} </p>
                                    <span className='tooltip-text-proposal-value'>
                                        <div className='div-flex ' style={{justifyContent:'center'}}>
                                            Status
                                        </div>
                                    </span>
                                </div>
                                {/* <p style={{color:renderTextAgeColor(props.deal.age),fontSize:10}}>{props.deal.age<0?0:props.deal.age} day &nbsp;&nbsp;<span style={{color:renderTextStageColor(props.deal.probability)}}>{getProbability(props.deal.probability)}</span></p> */}
                        </div>
                    </div>
                    } 
                    {/* <div > */}
                    <div className={`modal-deals${props.card_id==='negotiations'?'-left':''}`} style={{display:props.modal_action[props.deal.id]?'block':'none'}}>
                        <div className='modal-deals-item' onClick={()=>addSalesVisit(props.deal.clientId,props.deal.id)}>
                            <img src={Add} style={{width:20}}/>
                            &nbsp;&nbsp;
                            <h3>Add Sales Visit</h3>
                        </div>
                        {props.card_id!=='lead-in'&&
                        <div className='modal-deals-item' onClick={()=>addProposal(props.deal.clientId,props.deal.id)}>
                            <img src={Add} style={{width:20}}/>
                            &nbsp;&nbsp;
                            <h3>Upload Proposal</h3>
                        </div>
                        }
                        <div className='modal-deals-footer'>
                            <MuiThemeProvider theme={themeButton}>
                                <Button onClick={()=>wonDeal(props.deal.id,props.deal.invoicePeriod)} size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{width:80}}>Won</Button>
                                &nbsp;&nbsp;
                                <Button onClick={()=>lostDeal(props.deal.id)} size='small' color='secondary' variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{width:80}}>Lost</Button>
                                &nbsp;&nbsp;
                                <Button onClick={()=>deleteDeal(props.deal.id)} size='small' color='secondary' variant='text' className='btn-remove-capital btn-rounded remove-boxshadow' style={{width:80,backgroundColor:'#eeeeee'}}>Delete</Button>
                            </MuiThemeProvider>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            )}
        </Draggable>
        
    )
}
const Card=({cardOrder,card,deals,tabsToggle,index,token,profile,loading,updated,dragSuccess,modalsToggle,modal_action,backdropToggle})=>{
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
    let reverse_deal=deals
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
                    {reverse_deal.map((deal,index)=><Deals backdropToggle={backdropToggle} modalsToggle={modalsToggle} modal_action={modal_action} dragSuccess={dragSuccess} updated={updated} loading={loading} token={token} profile={profile} tabsToggle={tabsToggle} card_probability={card.card_probability} card_id={card.id} key={deal.id} deal={deal} index={index}/>)}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            <Button onClick={addDeal} style={{textTransform:'none',width:180,boxShadow:'none',marginLeft:18}} color='secondary' variant="contained">
                <img src={Add} style={{width:20}}/>
            </Button>

        </div>
    )
}
export default function Pipeline(props) {
    const pipeline=useSelector(state=>state.pipeline)
    const master=useSelector(state=>state.master)
    const state=pipeline
    const [modal,setModal]=useState(false)
    const [modal_action,openModal]=useState('')
    const [backdrop,openBackdrop]=useState(false)
    const [loading,setLoading]=useState({})
    const [dragSuccess,setDragSuccess]=useState({})
    const [updated,setUpdated]=useState({})
    const [prob,setProb]=useState()
    const [total_after,setTotalAfter]=useState(null)

    const dispatch=useDispatch()
    const classes=useStyles()
    let {tribe,segment,rm,probability,textPeriode,periode}=pipeline.filter
    useEffect(() => {
        let map=probability.map((data,index)=>{
            return `${data.id}`
        })
        
        dispatch( getPipeline(props.token,`${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${rm.value}/${probability.length>0?map:0}`))
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
        const start = state.cards[source.droppableId];
        const finish = state.cards[destination.droppableId];
        if(handle_access(props.profile.id,props.profile.roleId,pipeline.deals[draggableId].access,pipeline.deals[draggableId].rms)){
            if(start===finish){
                const card=state.cards[source.droppableId]
                const newDealsId=Array.from(card.dealsId)
                newDealsId.splice(source.index,1)
                newDealsId.splice(destination.index,0,draggableId)
                const newCard={
                  ...card,
                  dealsId:newDealsId
                }
                const newState={
                  
                    ...state.cards,
                    [newCard.id]:newCard
                }
                dispatch(setCards(newState))
                return
            }
    
            const startDealId = Array.from(start.dealsId);
            startDealId.splice(source.index, 1);
            const newStart = {
                ...start,
                dealsId: startDealId
            }
        
            const finishDealId = Array.from(finish.dealsId);
            finishDealId.splice(destination.index, 0, draggableId);
            const newFinish = {
                ...finish,
                dealsId: finishDealId
            }
            const newState = {
                ...state.cards,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
                
            }
            dispatch(setCards(newState))
            setLoading({[draggableId]:true})
    
            let res=await dispatch(updateStage(props.token,`/${draggableId}/${props.profile.id}/${finish.stage_id}`))
            if(res){
                pipeline.deals[draggableId].probability=res.probability
    
                await setLoading({[draggableId]:false})
                setUpdated({[draggableId]:true})
                setDragSuccess({[draggableId]:true})
                setTimeout(()=>setUpdated({[draggableId]:false}),2000)
            }else{
                await setLoading({[draggableId]:false})
                setUpdated({[draggableId]:true})
                setDragSuccess({[draggableId]:false})
                setTimeout(()=>setUpdated({[draggableId]:false}),2000)
            }
        }else{
            dispatch(modalToggle({ 
                modal_open: true,
                modal_title: "Hold Up!",
                modal_component: "on_authorize",
                modal_size:250,
                modal_type:'alert',
                modal_data:{
                    msg:"<p>Authorized owner's only</p>"
                },
                modal_action:'on_authorize'
            }))
        }
        
       
        return;
        
    }
    const addFilter=()=>{
        
        dispatch(modalToggle({
            modal_open: true,
            modal_title: "Pipeline Filter",
            modal_component: "pipeline_filter",
            modal_data:null ,
            modal_size:300,
            modal_action:'add_pipeline_filter',
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
    const countProb=()=>{
        countToggle()
        let total=prob*state.total_pv
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
    let tribe_filter=master.tribes.filter((data)=>{return data.id===tribe})
    let segment_filter=master.segments.filter((data)=>{return data.id===segment})
    let rm_filter=master.rm.filter((data)=>{return data.value===rm})
    return (
        <div>
            
            <div className='head-section'>
                <div>
                {handle_access(props.profile.id,props.profile.roleId,[],[{id:props.profile.id}])&&<><Button onClick={addDeal} size='small' color='primary' variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{width:100}}>Add deal</Button> &nbsp;&nbsp;&nbsp;&nbsp;</>}
                
                <Button onClick={()=>tabsToggle('projection')} size='small'  variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{color:'white',backgroundColor:'#ffb100',width:130}}>Projection deal</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={()=>tabsToggle('summary')} size='small'  variant='contained' className='btn-remove-capital btn-rounded remove-boxshadow' style={{color:'white',backgroundColor:'#ffb100',width:180}}>Projection summary</Button>
                </div>
                <div style={{display:'flex',alignItems:'center',}}>
                    <div>
                        <p className='pipeline-filterby'><b>Filter by:</b></p>
                        <div style={{display:'flex',flexWrap:'wrap',width:400}}>
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

                {state.cardOrder.map((cardId,index)=>{
                    const card=state.cards[cardId]
                    const deals=card.dealsId.map(dealsId=>state.deals[dealsId])
                    return <Card cardOrder={state.cardOrder} modalsToggle={modalsToggle} modal_action={modal_action} dragSuccess={dragSuccess} updated={updated} loading={loading} token={props.token} profile={props.profile} tabsToggle={tabsToggle} key={cardId} card={card} deals={deals} index={index} backdropToggle={backdropToggle}/>
                })}
            </DragDropContext>

            </div>
            <div className='pipeline-footer'>
                <div onClick={backdropToggle} style={{zIndex:2,width:'100%',height:700,position:'absolute',left:0,display:backdrop?'block':'none'}}></div>
                <p>Total proposal value: IDR <NumberFormat value={state.total_pv.toString().length>=7?`${Math.round(state.total_pv/1000000)}`:state.total_pv} displayType={'text'} thousandSeparator={true}  /> {state.total_pv.toString().length>=7&&'M'}</p>
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
