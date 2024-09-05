import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
    Redirect
  } from "react-router-dom";
  import React,{useEffect} from 'react'
import Client from 'views/Clients'
import Login from 'views/login'
import Deals from 'views/Deals'
import Invoices from 'views/Invoices'
import SalesReport from 'views/SalesReport'
import Lost from 'views/Lost'
import Account from 'views/Account'
import Cookie from 'universal-cookie'
import { useSelector, useDispatch } from "react-redux";
import {logout} from 'redux/actions/auth'
import Rm from 'views/rm'
import Team from 'views/Team'
import ClientsFromModalVisit from "views/ClientsFromModalVisit";
import Profile from 'views/Profile'

const cookie=new Cookie
const Logout=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        dispatch(logout())

    },[])
    return(
        <Redirect to='/'/>
    )
}
const IndexRouter=(props)=>{
    const token=cookie.get('login_cookie')
    const profile=cookie.get('profile_cookie')
    const reducer = useSelector(reducer => reducer)
    const dispatch = useDispatch()
    const isHaveToken=()=>{
        if(token!==undefined &&profile!==undefined){
            return(
            <>
                <Route path='/clients' exact render={()=>(<Client dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/clientsfrommodalvisit' exact render={()=>(<ClientsFromModalVisit dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/deals' exact render={()=>(<Deals dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/invoices' exact render={()=>(<Invoices dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/salesreport' exact render={()=>(<SalesReport dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/lostdeal' exact render={()=>(<Lost dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/account' exact render={()=>(<Account dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/rm' exact render={()=>(<Rm dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/teamconfig' exact render={()=>(<Team dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
                <Route path='/profile' exact render={()=>(<Profile dispatch={dispatch} reducer={reducer} token={token} profile={profile}/>)} />
               
            </>
            )
        }else{
            return <Logout/>
        }
    }
    return(
        <Router>
        <Switch>
            <Route path='/' exact component={Login}/>
            {/* <Route path='/previewdetail' exact component={DetailPreview}/> */}
            {isHaveToken()}
        </Switch>
        </Router>
    )
}
  export default IndexRouter
  