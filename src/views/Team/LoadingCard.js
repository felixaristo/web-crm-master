import React ,{useState}from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import Close from 'assets/icon/close.svg'
import { Button } from '@material-ui/core'

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
const Loader=()=>(
    <div className='team-grid'>
        <div className='team-card'>
            <div className='team-head'>
                <p><b><Skeleton animation="wave" height={40} width={100} /></b></p>
                <div className='div-flex'>
                    <Skeleton animation="wave" height={40} width={50} />
                    &nbsp;&nbsp;&nbsp;
                    <Skeleton animation="wave" height={40} width={50} />

                </div>
            </div>
            <div className='team-body'>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
        <div className='team-card'>
            <div className='team-head'>
                <p><b><Skeleton animation="wave" height={40} width={100} /></b></p>
                <div className='div-flex'>
                    <Skeleton animation="wave" height={40} width={50} />
                    &nbsp;&nbsp;&nbsp;
                    <Skeleton animation="wave" height={40} width={50} />

                </div>
            </div>
            <div className='team-body'>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
        <div className='team-card'>
            <div className='team-head'>
                <p><b><Skeleton animation="wave" height={40} width={100} /></b></p>
                <div className='div-flex'>
                    <Skeleton animation="wave" height={40} width={50} />
                    &nbsp;&nbsp;&nbsp;
                    <Skeleton animation="wave" height={40} width={50} />

                </div>
            </div>
            <div className='team-body'>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
                <div className='team-wrapper'>
                    <p style={{fontWeight:'bold',margin:0,color:'#777777',fontSize:16}}><Skeleton animation="wave" height={30} width={60} /></p>
                    <div className='team-item'>
                        <div style={{padding:10,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Skeleton animation="wave" height={40} width="100%" />
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
        
    </div>
)
export default Loader