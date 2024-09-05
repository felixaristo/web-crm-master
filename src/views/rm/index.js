import React,{useState} from 'react'
import Layout from 'components/Layouts'
import List from './list'
import { MuiThemeProvider, createMuiTheme,withStyles,
} from '@material-ui/core/styles'
import Profile from 'views/Profile'
import Detail from './detail'
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
                    {tab==='add'&&<Detail tab={tab} settab={settab} {...props} />}
                    {tab==='edit'&&<Detail tab={tab} settab={settab} {...props} />}
                    {tab==='detail'&&<Detail tab={tab} settab={settab} {...props} />}
                </MuiThemeProvider>
            </Layout>
        </div>
    )
}
