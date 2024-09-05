import React,{useState} from 'react'
import List from './List'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import Layout from 'components/Layouts'
import './style.css'
const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#70bf4e',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',
        }
    } 
})

export default function Index(props) {
    const [tab, settab] = useState('list')
    return (
        <div>
             <Layout>
                <MuiThemeProvider theme={themeButton}>
                    {tab==='list'&&<List tab={tab} settab={settab} {...props} />}
                </MuiThemeProvider>
            </Layout>
        </div>
    )
}
