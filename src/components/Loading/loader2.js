import React, { Component } from 'react'
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import './style.css'
import {connect} from 'react-redux'
const override = css`
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index: 9000;
    height: 100vh;
    width: 100%;
    background-color: #00000085;
    display: flex; 
    justify-content: center;
    align-items: center;
`;
class index extends Component {
    
    render() {
        const {isLoadingTable}=this.props.general
        return (
                <BeatLoader
                    size={30}
                    margin={2}
                    color={"#ffb100"}
                    loading={isLoadingTable}
                    css={override}
                />
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general
})
export default connect(mapStateToProps,null)(index)