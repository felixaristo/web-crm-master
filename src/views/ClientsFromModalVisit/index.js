import React, { Component } from 'react'
import Layout from 'components/Layouts'
import List from '../Clients/list'
import Add from '../Clients/add'
import {connect} from 'react-redux'
import {getClient} from 'redux/actions/client'

class index extends Component {
    state={
        tab_active:'add_client'
    }
    
    tabToggle=(key)=>{
        this.setState({tab_active:key})
    }
    render() {
        const {tab_active}=this.state
        return (
            <div>
                <Layout>
                    {tab_active==='list_client'&&<List tabToggle={this.tabToggle} token={this.props.token} profile={this.props.profile}/>}
                    {tab_active==='add_client'&&<Add token={this.props.token} profile={this.props.profile} tabToggle={this.tabToggle}/>}
                </Layout>
            </div>
        )
    }
}
export default connect(null,{getClient})(index)