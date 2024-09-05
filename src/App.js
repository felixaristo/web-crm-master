import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from 'components/Navbar'
import Sidebar from 'components/Sidebar'
import Routes from './routes'
import { ThemeProvider } from '@material-ui/styles';
import Theme from './theme'
import {Provider,useSelector} from 'react-redux'
import store from './store'
function App() {

  return (
      <Provider store={store}>
        <ThemeProvider theme={Theme}>
            <Routes />
        </ThemeProvider>
      </Provider>
  );
}

export default App;
