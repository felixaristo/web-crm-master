import React, { useState, useEffect } from "react";
import { Button, TextField, CircularProgress } from "@material-ui/core";
import filter from "assets/icon/filter.svg";
import Arrowright from "assets/icon/Arrowright.svg";
import Arrowleft from "assets/icon/Arrowleft.png";
import Upload from "assets/icon/Upload.svg";
import edit from "assets/icon/edit.png";
import close from "assets/icon/close.svg";
import { Icon, Step } from "semantic-ui-react";
// import {initialData} from './initialData'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Add from "assets/icon/Add.svg";
import eye from "assets/icon/eye.png";
import { useDispatch, useSelector } from "react-redux";
import { modalToggle, setLoading } from "redux/actions/general";
import { getContact, getEmployee } from "redux/actions/master";
import { getDetailDeal, viewFile } from "redux/actions/pipeline";
import {
  getInvoice,
  setTabInvoice,
  setInvoiceAction,
  cancelInvoice,
} from "redux/actions/invoices";
import Chevron from "assets/icon/chevron-right.svg";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  makeStyles,
} from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import Checklist from "assets/icon/checklist.png";
import { isEmpty } from "lodash";
import * as actionType from "redux/constants/invoices";
import ChevronBlue from "assets/icon/chevron-right-blue.svg";
import moment from "moment";
import { Edit } from "@material-ui/icons";
import { handle_access } from "service/handle_access";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const themeButton = createMuiTheme({
  palette: {
    primary: {
      main: "#70bf4e",
      contrastText: "#FFFFFF",
    },
    secondary: {
      // main:'#FF7165',
      main: "#ff7165",
      contrastText: "#FFFFFF",
      // contrastText: '#777777',
    },
  },
});
const themeField = createMuiTheme({
  palette: {
    primary: {
      main: "#70bf4e",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#3B99EB",
      contrastText: "#FFFFFF",
    },
  },
});
const useStyles = makeStyles((theme) => ({
  textField: {
    [`& fieldset`]: {
      borderRadius: 10,
    },
    width: "100%",
    marginBottom: 15,
  },
}));
const getProbability = (key) => {
  switch (key) {
    case 10:
      return 0.1;
      break;
    case 20:
      return 0.2;
      break;
    case 30:
      return 0.3;
      break;
    case 40:
      return 0.4;
      break;
    case 50:
      return 0.5;
      break;
    case 60:
      return 0.6;
      break;
    case 70:
      return 0.7;
      break;
    case 80:
      return 0.8;
      break;
    case 90:
      return 0.9;
      break;
    case 100:
      return 1;
    default:
      break;
  }
};
const Deals = (props) => {
  const [modal, openModal] = useState("");
  const general = useSelector((state) => state.general);
  const master = useSelector((state) => state.master);
  const invoices = useSelector((state) => state.invoices);
  const pipeline = useSelector((state) => state.pipeline);

  const dispatch = useDispatch();

  const detailDeal = async (clientId, dealId) => {
    let res = await dispatch(getDetailDeal(props.token, dealId));
    if (res) {
      await dispatch(getContact(props.token, clientId));
      await dispatch(getEmployee(props.token));
      props.tabsToggle("detail", "invoice");
    }
  };
  const editInvoice = (data) => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: "Edit invoice",
        modal_component: "add_invoice",
        modal_data: data,
        modal_size: 450,
        modal_action: "edit_invoice",
      })
    );
  };
  const seeInvoice = (data) => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: "Detail To Be invoice",
        modal_component: "add_invoice",
        modal_data: data,
        modal_size: 450,
        modal_action: "see_invoice",
      })
    );
  };
  const toInvoice = (data) => {
    // console.log('ehe', data.deal.text)
    dispatch(getContact(props.token, data.client.value));
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: `Add invoice for ${data.client.label}`,
        modal_component: "add_invoice",
        modal_data: data,
        modal_size: 500,
        modal_action: "to_invoice",
        modal_subtitle: data.deal.text,
      })
    );
  };
  const deleteInvoice = (invoicesId) => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: `Are you sure delete this payment?`,
        modal_component: "confirm2",
        modal_size: 400,
        modal_type: "confirm",
        modal_data: {
          invoicesId: invoicesId,
          tab: props.tab_invoice,
          msg: `<p></p>`,
          title_cancel: "No, Cancel",
          title_yes: "Yes, Delete",
        },
        modal_action: "delete_invoice",
      })
    );
  };
  const viewInvoice = (id) => {
    dispatch(viewFile(props.token, `3/${id.invoiceId}/${props.profile.id}`));
  };

  const renderLoader = (loading) => {
    return (
      <div
        style={{
          width: 180,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress color="secondary" size={30} />
        ) : (
          renderSucces()
        )}
      </div>
    );
  };
  const renderSucces = () => {
    // // console.log('object', object)
    // alert('oyyyy')
    return (
      <div className="success-drag">
        <img src={Checklist} style={{ width: 60 }} />
      </div>
    );
  };
  const detailInvoice = (data) => {
    // console.log('from detail invoice', data)
    props.tabsToggle("add_invoice");

    if (
      handle_access(
        props.profile.id,
        props.profile.roleId,
        props.invoices.access,
        props.invoices.rms
      )
    ) {
      dispatch(setInvoiceAction("detail_invoice"));
    } else {
      dispatch(setInvoiceAction("see_invoice"));
    }

    dispatch({
      type: actionType.SET_DETAIL_INVOICED,
      payload: data,
    });
  };
  let { tribe, segment, rm, probability, periode, textPeriode, rangeValue } =
    pipeline.filter;

  const toTobeInvoice = (data) => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: `Are you sure move this payment to Tobe Invoice?`,
        modal_component: "confirm2",
        modal_size: 400,
        modal_type: "confirm",
        modal_data: {
          invoicesId: data.id,
          msg: `<p></p>`,
          title_cancel: "No, Cancel",
          title_yes: "Yes, Move",
          modalAction: async () => {
            let res = await dispatch(
              cancelInvoice(`/${data.id}/${props.profile.id}`, props.token)
            );
            if (res) {
              dispatch(setTabInvoice("to_beinvoice"));
              dispatch(
                getInvoice(
                  props.token,
                  `${periode.fromMonth}/${
                    periode.toMonth
                  }/${tribe}/${segment}/${rm.value}/${
                    invoices.tab_invoice === "to_beinvoice" ? 1 : 0
                  }`,
                  invoices.tab_invoice
                )
              );
            }
          },
        },
        modal_action: "move_invoice",
      })
    );
    //
    // console.log('from to tobe invoice', data)
  };

  return (
    // <Draggable draggableId={props.invoices.id} index={props.index}>
    //     {(provided)=>(
    <div
      className="deals-card"
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // ref={provided.innerRef}
    >
      {props.loading[props.invoices.id] ? (
        renderLoader(props.loading[props.invoices.id])
      ) : props.updated[props.invoices.id] ? (
        renderSucces()
      ) : (
        <div className="deals-card-content">
          <p
            style={{ color: "#3B99EB" }}
            className="deals-card-title"
            onClick={() =>
              detailDeal(props.invoices.client.value, props.invoices.deal.id)
            }
          >
            {props.invoices.title.length > 60
              ? `${props.invoices.title.substring(0, 60)}...`
              : props.invoices.title}
            {props.invoices.title.length > 60 && (
              <span className="tooltip-text">{props.invoices.title}</span>
            )}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p className="deals-card-company" style={{ maxWidth: 140 }}>
              {props.invoices.client.label}
            </p>
            <div
              className="circle-chevron"
              onClick={() => props.modalsToggle(props.invoices.id)}
            >
              <img src={Chevron} style={{ width: 7 }} />
              <br />
            </div>
            <div
              className={`modal-deals${
                props.invoices.stage === 4 || props.invoices.stage === 5
                  ? "-left"
                  : ""
              }`}
              style={{
                display: props.modal_action[props.invoices.id]
                  ? "block"
                  : "none",
              }}
            >
              {invoices.tab_invoice === "to_beinvoice" ? (
                <>
                  {!handle_access(
                    props.profile.id,
                    props.profile.roleId,
                    props.invoices.access,
                    props.invoices.rms
                  ) ? (
                    <div
                      className="modal-deals-item"
                      onClick={() => seeInvoice(props.invoices)}
                    >
                      <img src={eye} style={{ width: 20 }} />
                      &nbsp;&nbsp;
                      <h3>Detail invoice</h3>
                    </div>
                  ) : (
                    <>
                      <div
                        className="modal-deals-item"
                        onClick={() => editInvoice(props.invoices)}
                      >
                        <img src={edit} style={{ width: 20 }} />
                        &nbsp;&nbsp;
                        <h3>Edit</h3>
                      </div>
                      {props.invoices.rms.some(
                        (e) => e.id === props.profile.id
                      ) === false && (
                        <div
                          className="modal-deals-item"
                          onClick={() => toInvoice(props.invoices)}
                        >
                          <img src={Arrowright} style={{ width: 20 }} />
                          &nbsp;&nbsp;
                          <h3>Invoiced</h3>
                        </div>
                      )}
                      <div
                        className="modal-deals-item"
                        onClick={() => deleteInvoice(props.invoices.invoiceId)}
                      >
                        <img src={close} style={{ width: 20 }} />
                        &nbsp;&nbsp;
                        <h3>Delete</h3>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div
                    className="modal-deals-item"
                    onClick={() => detailInvoice(props.invoices)}
                  >
                    <img src={eye} style={{ width: 20 }} />
                    &nbsp;&nbsp;
                    <h3>Detail invoice</h3>
                  </div>
                  {props.profile.roleId === 1 && (
                    <div
                      className="modal-deals-item"
                      onClick={() => toTobeInvoice(props.invoices)}
                    >
                      <img src={Arrowleft} style={{ width: 20 }} />
                      &nbsp;&nbsp;
                      <h3>To Be Invoice</h3>
                    </div>
                  )}
                  {handle_access(
                    props.profile.id,
                    props.profile.roleId,
                    props.invoices.access,
                    props.invoices.rms
                  ) && (
                    <div
                      className="modal-deals-item"
                      onClick={() => deleteInvoice(props.invoices.invoiceId)}
                    >
                      <img src={close} style={{ width: 20 }} />
                      &nbsp;&nbsp;
                      <h3>Delete</h3>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <p
            style={{
              color: "#777777",
              fontSize: 12,
              margin: "0px 0px 5px 0px",
              fontWeight: 600,
            }}
          >
            {props.invoices.rms.map((data, i) =>
              props.invoices.rms.length > 1 ? `${data.text},` : `${data.text}`
            )}
          </p>
          <div className="deals-card-footer">
            <div className="proposal-value">
              <p
                style={{
                  color: "#4e8637",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                IDR{" "}
                <NumberFormat
                  value={
                    props.invoices.value.toString().length >= 8
                      ? `${Math.round(props.invoices.value / 1000000)}`
                      : props.invoices.value
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                />{" "}
                {props.invoices.value.toString().length >= 8 && "M"}
              </p>
              <span className="tooltip-text-proposal-value">
                <div className="div-flex " style={{ justifyContent: "center" }}>
                  IDR&nbsp;
                  <NumberFormat
                    value={props.invoices.value}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </div>
              </span>
            </div>
            {/* <p style={{color:'#70bf4e'}}>IDR <NumberFormat value={props.invoices.value.toString().length>=8?`${Math.round(props.invoices.value/1000000)}`:props.invoices.value} displayType={'text'} thousandSeparator={true}  /> {props.invoices.value.toString().length>=8&&'M'}</p> */}
          </div>
        </div>
      )}
    </div>
    //     )}
    // </Draggable>
  );
};
const Card = ({
  cardOrder,
  addInvoice,
  tab_invoice,
  profile,
  modalsToggle,
  modal_action,
  card,
  invoices,
  tabsToggle,
  index,
  token,
  loading,
  updated,
}) => {
  const dispatch = useDispatch();

  let price = 0;
  invoices.map((data) => {
    price += data.value;
  });
  const renderFontSize = (digit) => {
    if (digit > 11) {
      return 12;
    } else if (digit > 12) {
      return 10;
    } else if (digit < 11) {
      return 14;
    }
  };
  let a = price / 1000000;
  return (
    <div className="pipeline-container">
      <div
        className={
          index === cardOrder.length - 1
            ? "pipeline-step-last"
            : "pipeline-step"
        }
        style={{
          zIndex: 5 - index,
          justifyContent:
            card.id === "proposal-development" ? "flex-end" : "center",
        }}
      >
        <p>{card.title}</p>
      </div>
      <div
        className="pipeline-deals"
        // {...provided.droppableProps}
        // ref={provided.innerRef}
      >
        {invoices.map((invoices, index) => (
          <Deals
            tab_invoice={tab_invoice}
            addInvoice={addInvoice}
            modalsToggle={modalsToggle}
            modal_action={modal_action}
            updated={updated}
            loading={loading}
            token={token}
            profile={profile}
            tabsToggle={tabsToggle}
            card_probability={card.card_probability}
            card_id={card.id}
            key={invoices.id}
            invoices={invoices}
            index={index}
          />
        ))}
        {/* {provided.placeholder} */}
      </div>
      {/* <Droppable droppableId={card.id}>
            {(provided)=>(
               
            )}
            </Droppable> */}
      <div
        className="projection-card-footer"
        style={{ fontSize: renderFontSize(price.toString().length) }}
      >
        Total : IDR &nbsp;
        <NumberFormat
          value={
            price.toString().length >= 8
              ? `${Math.round(price / 1000000)}`
              : price
          }
          displayType={"text"}
          thousandSeparator={true}
        />
        &nbsp;{price.toString().length >= 8 && "M"}
      </div>
    </div>
  );
};
export default function Invoice(props) {
  const pipeline = useSelector((state) => state.pipeline);
  const invoices = useSelector((state) => state.invoices);
  const master = useSelector((state) => state.master);
  const [prob, setProb] = useState();
  const [total_after, setTotalAfter] = useState(null);
  const state = invoices;
  const [modal, setModal] = useState(false);
  const [modal_action, openModal] = useState("");
  const [backdrop, openBackdrop] = useState(false);

  const [loading, setLoading] = useState({});
  const [updated, setUpdated] = useState({});
  // const [tab_invoice,setTabInvoice]=useState('to_beinvoice')
  const dispatch = useDispatch();
  const classes = useStyles();
  let { tribe, segment, rm, probability, periode, textPeriode, rangeValue } =
    pipeline.filter;
  // console.log(`periode`, pipeline.filter)
  useEffect(() => {
    // if(isEmpty(invoices.invoiced)||isEmpty(invoices.tobe_invoiced)){
    dispatch(
      getInvoice(
        props.token,
        `${periode.fromMonth}/${periode.toMonth}/${tribe}/${segment}/${
          rm.value
        }/${invoices.tab_invoice === "to_beinvoice" ? 1 : 0}`,
        invoices.tab_invoice
      )
    );
    // }
  }, [invoices.tab_invoice]);
  const countToggle = () => {
    openBackdrop(!backdrop);
    setModal(!modal);
  };

  const onDragEnd = async (result) => {
    const { draggableId, source, destination, type } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  };
  const modalsToggle = (deals) => {
    backdropToggle();
    openModal({
      ...modal_action,
      [deals]: !modal_action[deals],
    });
  };
  const backdropToggle = () => {
    openBackdrop(!backdrop);
    openModal("");
    setModal(false);
  };
  const addFilter = () => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: "Invoice Filter",
        modal_component: "invoices_filter",
        modal_data: null,
        modal_size: 300,
        modal_action: invoices.tab_invoice,
      })
    );
  };
  const tabsToggle = (key, back) => {
    props.tabToggle(key, back);
  };
  const addInvoice = () => {
    dispatch(
      modalToggle({
        modal_open: true,
        modal_title: "Add To Be Invoice",
        modal_component: "add_invoice",
        modal_data: null,
        modal_size: 450,
        modal_action: "add_invoice",
      })
    );
  };
  const toAddInvoice = () => {
    dispatch(setInvoiceAction("add_invoice"));
    props.tabToggle("add_invoice");
    dispatch({
      type: actionType.SET_DETAIL_INVOICED,
      payload: null,
    });
  };

  let tribe_filter = master.tribes.filter((data) => {
    return data.id === tribe;
  });
  let segment_filter = master.segments.filter((data) => {
    return data.id === segment;
  });
  let rm_filter = master.rm.filter((data) => {
    return data.value === rm;
  });
  let start_month =
    textPeriode === "All Period"
      ? moment()
          .month(
            state.card_tobe_invoiced[state.cardTobeInvoicedOrder[0]].month - 1
          )
          .format("MMM")
      : `${moment()
          .month(rangeValue.from.month - 1)
          .format("MMM")} ${rangeValue.from.year}`;
  let last_month =
    textPeriode === "All Period"
      ? moment()
          .month(
            state.card_tobe_invoiced[state.cardTobeInvoicedOrder[4]].month - 1
          )
          .format("MMM")
      : `${moment()
          .month(rangeValue.to.month - 1)
          .format("MMM")} ${rangeValue.to.year}`;
  let year =
    textPeriode === "All Period"
      ? moment().format("YYYY")
      : `${moment()
          .month(rangeValue.from.month - 1)
          .format("MMM")} ${rangeValue.from.year} - ${moment()
          .month(rangeValue.to.month - 1)
          .format("MMM")} ${rangeValue.to.year}`;
  const renderNameFileExcel = () => {
    return `Data ${
      invoices.tab_invoice === "to_beinvoice" ? "To Be Invoice" : "Invoice"
    } ${
      textPeriode === "All Period"
        ? moment()
            .month(
              state.card_tobe_invoiced[state.cardTobeInvoicedOrder[0]].month - 1
            )
            .format("MMM YYYY")
        : `${moment()
            .month(rangeValue.from.month - 1)
            .format("MMM")} ${rangeValue.from.year}`
    } - ${
      textPeriode === "All Period"
        ? moment()
            .month(
              state.card_tobe_invoiced[state.cardTobeInvoicedOrder[4]].month - 1
            )
            .format("MMM YYYY")
        : `${moment()
            .month(rangeValue.to.month - 1)
            .format("MMM")} ${rangeValue.to.year}`
    }`;
  };
  return (
    <div>
      <div className="head-section">
        <div className="head-tab">
          <li
            onClick={() => dispatch(setTabInvoice("to_beinvoice"))}
            className={
              invoices.tab_invoice === "to_beinvoice" ? "head-tab-active" : ""
            }
          >
            To be Invoice
          </li>
          <li
            onClick={() => dispatch(setTabInvoice("invoiced"))}
            className={
              invoices.tab_invoice === "invoiced" ? "head-tab-active" : ""
            }
          >
            Invoiced
          </li>
        </div>
        <ExcelFile
          filename={renderNameFileExcel()}
          element={
            <Button
              size="small"
              color="primary"
              variant="contained"
              className="btn-remove-capital btn-rounded remove-boxshadow"
              style={{ width: 150 }}
            >
              Export To Excel
            </Button>
          }
        >
          <ExcelSheet dataSet={invoices.to_excel} name={`invoice`} />
        </ExcelFile>
      </div>
      <br />

      <div className="head-section">
        <div>
          {invoices.tab_invoice === "to_beinvoice" &&
            handle_access(
              props.profile.id,
              props.profile.roleId,
              [],
              [{ id: props.profile.id }]
            ) && (
              <Button
                onClick={addInvoice}
                size="small"
                color="primary"
                variant="contained"
                className="btn-remove-capital btn-rounded remove-boxshadow"
                style={{ width: 150 }}
              >
                Add To Be Invoice
              </Button>
            )}
          {invoices.tab_invoice === "invoiced" &&
            handle_access(
              props.profile.id,
              props.profile.roleId,
              [],
              [{ id: props.profile.id }]
            ) && (
              <Button
                onClick={toAddInvoice}
                size="small"
                color="primary"
                variant="contained"
                className="btn-remove-capital btn-rounded remove-boxshadow"
                style={{ width: 120 }}
              >
                Add Invoice
              </Button>
            )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <p className="pipeline-filterby">
              <b>Filter by:</b>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", width: 500 }}>
              <p className="pipeline-filterby">
                Tribe : {tribe === 0 ? "All Tribe" : tribe_filter[0].text}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <p className="pipeline-filterby">
                Deal period : {textPeriode}&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <p className="pipeline-filterby">
                Segment :{" "}
                {segment === 0 ? "All Segment" : segment_filter[0].text}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <p className="pipeline-filterby">
                RM : {rm !== null ? rm.label : "All RM"}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <p className="pipeline-filterby">
                {probability.length > 0 &&
                  "Probability: " +
                    probability.map(
                      (data) => `${getProbability(data.id)}`
                    )}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </p>
            </div>
          </div>
          <button onClick={addFilter} className="card-table__head_btn">
            <img src={filter} style={{ width: 20 }} />
            &nbsp;&nbsp;Filter
          </button>
        </div>
      </div>
      <br />
      <div className="pipeline-wrapper">
        {/* <DragDropContext onDragEnd={onDragEnd}>
               
            </DragDropContext> */}
        {invoices.tab_invoice === "to_beinvoice"
          ? state.cardTobeInvoicedOrder.map((cardId, index) => {
              const card = state.card_tobe_invoiced[cardId];
              const invoices = card.invoicesId.map(
                (invoicesId) => state.tobe_invoiced[invoicesId]
              );
              return (
                <Card
                  cardOrder={state.cardInvoicedOrder}
                  profile={props.profile}
                  tab_invoice={invoices.tab_invoice}
                  addInvoice={addInvoice}
                  modalsToggle={modalsToggle}
                  modal_action={modal_action}
                  updated={updated}
                  loading={loading}
                  token={props.token}
                  tabsToggle={tabsToggle}
                  key={cardId}
                  card={card}
                  invoices={invoices}
                  index={index}
                />
              );
            })
          : state.cardInvoicedOrder.map((cardId, index) => {
              const card = state.card_invoiced[cardId];
              const invoices = card.invoicesId.map(
                (invoicesId) => state.invoiced[invoicesId]
              );
              return (
                <Card
                  cardOrder={state.cardInvoicedOrder}
                  profile={props.profile}
                  tab_invoice={invoices.tab_invoice}
                  addInvoice={addInvoice}
                  modalsToggle={modalsToggle}
                  modal_action={modal_action}
                  updated={updated}
                  loading={loading}
                  token={props.token}
                  tabsToggle={tabsToggle}
                  key={cardId}
                  card={card}
                  invoices={invoices}
                  index={index}
                />
              );
            })}
      </div>
      <div className="pipeline-footer">
        <div
          onClick={backdropToggle}
          style={{
            zIndex: 2,
            width: "100%",
            height: 700,
            position: "absolute",
            left: 0,
            display: backdrop ? "block" : "none",
          }}
        ></div>
        {invoices.tab_invoice === "to_beinvoice" ? (
          <p>
            Total to be invoice {start_month} - {last_month}: IDR{" "}
            <NumberFormat
              value={
                state.total_value_tobe.toString().length >= 7
                  ? `${Math.round(state.total_value_tobe / 1000000)}`
                  : state.total_value_tobe
              }
              displayType={"text"}
              thousandSeparator={true}
            />{" "}
            {state.total_value_tobe.toString().length >= 7 && "M"}
          </p>
        ) : (
          <p>
            Total sales in {year}: IDR{" "}
            <NumberFormat
              value={
                state.total_value_invoiced.toString().length >= 7
                  ? `${Math.round(state.total_value_invoiced / 1000000)}`
                  : state.total_value_invoiced
              }
              displayType={"text"}
              thousandSeparator={true}
            />{" "}
            {state.total_value_invoiced.toString().length >= 7 && "M"}
          </p>
        )}
      </div>
    </div>
  );
}
