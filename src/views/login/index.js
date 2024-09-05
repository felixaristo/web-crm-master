import React, { Component } from 'react'
import './style.css'
import {TextField,Modal,Button,CircularProgress,IconButton,OutlinedInput,InputAdornment,InputLabel,FormControl} from '@material-ui/core'
import {Visibility,VisibilityOff,} from '@material-ui/icons'
import {connect} from 'react-redux'
import {login} from 'redux/actions/auth'
// import Modal from 'components/Modal'
import Cookie from 'universal-cookie'
import { MuiThemeProvider, createMuiTheme,withStyles, } from '@material-ui/core/styles'
const cookie=new Cookie()

const themeButton = createMuiTheme({ 
    palette: { 
        primary: {
            main:'#ffb100',
            contrastText: '#FFFFFF',

        },
    } 
})
class index extends Component {
    state={
        show_pass:false,
        email:'',
        password:'',
        width: window.innerWidth,
        show_modal:false
    }
    componentDidMount(){
        let token=cookie.get('login_cookie')
        if(token!==undefined){
            window.location.assign('/deals')
        }
    }
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };
    passwordToggle=()=>{
        this.setState({show_pass:!this.state.show_pass})
    }
    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    onSubmit=(e)=>{
        e.preventDefault()
        let {email,password}=this.state
        let data={
            userName:email,
            password,
            os:'windows',
            deviceID: 1,
            sourceID: 1,
            versionCode: 1,
            versionName: "string"
        }
        this.props.login(data)
    }

    render() {
        let {show_pass,width}=this.state
        let {general}=this.props
        const isMobile = width <= 768;
        let show=false
        if(isMobile){
            show=true
            // this.setState({show_modal:true})
        }
        return (
            <div className='login-wrapper'>
                <Modal
                    // className='modal'
                    open={show}
                    // onClose={modalToggle}
                    style={{magrin:'auto',width:'100%'}}
                >
                    <div className='modal-content' style={{marginTop:100,marginLeft:50,width:'75%',padding:10}}>
                    <p className='semi-bold'>This application is not compatible for mobile device, access CRM application from desktop (PC/Laptop) browser.</p>

                    </div>
                </Modal>
                <div className='login-form'>
                    <h1>Increase Productivity, Convert More Leads & Make More Sales</h1>
                    <p>Manage your sales process, win more deals and create loyal customers using CRM Application.</p>
                    <h3>Login</h3>
                    <form onSubmit={this.onSubmit}>
                    <TextField
                        label="Email address"
                        // label={<p>Name<span style={{color:'red'}}>*</span></p>}
                        variant="outlined"
                        size="small"
                        className='form-login'
                        name='email'
                        onChange={this.onChange}
                        required
                    />
                    
                    <FormControl variant="outlined" size="small">
                        <InputLabel  htmlFor="outlined-adornment-password">Password <span >*</span></InputLabel>
                        <OutlinedInput
                            className='form-login'
                            id="outlined-adornment-password"
                            type={show_pass ? 'text' : 'password'}
                            // label='Password'
                            name='password'
                            onChange={this.onChange}
                            required
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={this.passwordToggle}
                                edge="end"
                                >
                                {show_pass ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                            labelWidth={85}
                        />
                    </FormControl>
                    {general.error_msg!==null&&general.error_msg.map((data,i)=>(
                        <p className='bold' key={i} style={{color:'red'}}>{data.description}</p>
                    ))}
                    <br/>
                    <MuiThemeProvider theme={themeButton}>
                        <Button type='submit' color="primary" className='btn-login' variant='contained'>
                            {general.isLoading?<CircularProgress style={{color:'white'}}  size={25} />:'Login'}
                        </Button>
                    </MuiThemeProvider>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    general:state.general
})
const mapDispatchToProps={
    login
}
export default connect(mapStateToProps,mapDispatchToProps)(index)