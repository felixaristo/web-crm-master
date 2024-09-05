import { combineReducers } from "redux";
import  general from './general'
import client from './client'
import pipeline from './pipeline'
import master from './master'
import invoices from './invoices'
import report from './report'
import account from './account'
import rm from "./rm";
import team from './team'
export default combineReducers({
    general,
    client,
    master,
    pipeline,
    invoices,
    report,
    account,
    rm,
    team
})