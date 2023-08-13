import React, { useState, useEffect } from "react";
import api from "./../../api";
import moment from "moment";
import { Table, Button, Card } from "react-bootstrap";
import logo from "./../../images/prescription-logo.png";
import d_logo from "./../../images/Logo.jpeg";
import "./../../styles/prescription-page.css";
import SpeechRecognitionModule from "../../components/SpeechRecognitionModule";
import html2canvas from "html2canvas";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ProcessPrescription() {
  // constructor(props) {
  //   super(props);
  //   state = {
  //     selectedFile: null,
  //     responseText: "",
  //     loading: false,
  //     error: false,
  //     patientInfo: [],
  //     doctorInfo: [],
  //     prescriptionData: [],
  //     advice: "",
  //     diagnosis: "",
  //     digitalSignImg: "",
  //     toggleBtn: false,
  //   };
  // }
  const [patientInfo, setPatientInfo] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [advice, setAdvice] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [digitalSignImg, setDigitalSignImg] = useState("");
  const [toggleBtn, setToggleBtn] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const pid = useParams().did;
  const location = useLocation();
  const currentDate = moment();
  const did = location.pathname.split("/")[2];
  const bid = location.state.bid;
  const slot_no = location.state.slot_no;

  useEffect(() => {
    api
      .get(`/patient/${pid}`)
      .then(({ data }) => {
        setPatientInfo(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
    api.get(`/doctor/${did}`).then(({ data }) => {
      setDoctorInfo(data[0]);
      setDigitalSignImg(data[0].signature);
    });
  }, [did, pid]);

  const getAge = () => {
    const dob = moment(patientInfo.dob).format("MM/DD/YYYY");
    const age = moment(dob, "MM/DD/YYYY").fromNow().slice(0, 2);
    return age;
  };

  const getFrequency = (frequency) => {
    let formattedFrequency = "";
    let rawFrequency = frequency.split("-");
    formattedFrequency += rawFrequency[0] === "1" ? "morning," : "";
    formattedFrequency += rawFrequency[1] === "1" ? " afternoon," : "";
    formattedFrequency += rawFrequency[2] === "1" ? " and evening" : "";
    return formattedFrequency;
  };

  const processPrescriptionAudio = () => {
    // Diagnosing for {diagnosis}
    // take {quantity} of {medicine} at {frequency} for {duration}
    // {advice}
    let speechData = {
      diagnosis: diagnosis,
      medicineData: [],
      advice: advice,
    };
    prescriptionData.map((row) => {
      //{medicine: "Crocin", frequency: "1-0-0", medicineTiming: "After food.", quantity: "1 tablet. ", duration: "3 days. "}
      let rowSpeechData = `Take ${row.quantity} of ${
        row.medicine
      } at ${getFrequency(row.frequency)} ${row.medicineTiming} for ${
        row.duration
      }`;
      rowSpeechData = rowSpeechData.replace(/[.]/g, "");
      return speechData.medicineData.push(rowSpeechData);
    });
    return speechData;
  };

  const handleSubmit = () => {
    let speechData = processPrescriptionAudio();
    const postData = {
      audio: speechData,
      did,
      pid,
      cdatetime: moment().format("YYYY-MM-DD hh:mm:ss"),
      bid,
    };
    const prescriptionCanvas = document.getElementById("prescription");
    html2canvas(prescriptionCanvas, { scrollY: -window.scrollY }).then(
      (data) => {
        postData["pdf"] = data.toDataURL();
        api
          .post("/consultation", postData)
          .then(() => {
            api
              .post("/appointment/cancel", {
                bid,
                did,
                slotNo: slot_no,
              })
              .then(() => {
                alert("Prescription generated!");
                navigate(`/doctor/${did}`);
              })
              .catch((err) => {
                console.error(err);
                alert("error");
              });
          })
          .catch((err) => {
            console.error(err);
            alert("error");
          });
      }
    );
  };

  const addRowData = (
    medName,
    frequency,
    medicineTiming,
    duration,
    quantity
  ) => {
    if (
      medName.length &&
      frequency.length &&
      medicineTiming.length &&
      duration.length &&
      quantity.length
    ) {
      setPrescriptionData([
        ...prescriptionData,
        {
          medicine: medName,
          frequency: frequency,
          medicineTiming: medicineTiming,
          quantity: quantity,
          duration: duration,
        },
      ]);
    }
  };

  const addAdvice = (advice) => {
    setAdvice(advice);
  };

  const addDiagnosis = (diagnosis) => {
    setDiagnosis(diagnosis);
  };

  return (
    <div className="main container">
      <div
        style={{ padding: "15px", border: "1px solid black" }}
        id="prescription"
      >
        <div>
          <img
            style={{ float: "right", marginRight: "0" }}
            src={d_logo}
            alt="banner"
            width="200px"
            height="100px"
          />
        </div>
        {patientInfo && (
          <div className="patient-info">
            <div>
              <div className="doctor-info">
                <div style={{ color: "rgb(7, 70, 143)" }}>
                  <h4>Dr. {doctorInfo.dname}</h4>
                </div>
                <div style={{ textTransform: "capitalize" }}>
                  <strong>{doctorInfo.role}</strong>
                </div>
                <div>
                  <strong>{doctorInfo.demail} </strong>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  {" "}
                  <strong> </strong>
                  {doctorInfo.dphno}
                </div>
              </div>
              <div>
                <strong>Name: </strong>
                {patientInfo.pname}
              </div>
              <div>
                <strong>AGE: </strong> {getAge()}
                <span className="date">
                  <strong>Date: </strong> {currentDate.format("DD MMM, yy")}
                </span>
              </div>
              <div>
                <strong>Gender: </strong> {patientInfo.gender}
              </div>
            </div>

            <div>
              <strong>PID: </strong>
              {patientInfo.pid}
            </div>
          </div>
        )}
        {diagnosis.length ? (
          <Card.Header>
            <strong>Diagnosis: </strong>
            <span contentEditable={true} suppressContentEditableWarning={true}>
              {diagnosis}
            </span>
          </Card.Header>
        ) : (
          ""
        )}
        <Table striped bordered hover className="prescription-table">
          <thead>
            <tr>
              <th colSpan="5">
                <img src={logo} className="logo" alt="logo" />
              </th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {prescriptionData &&
              prescriptionData.map((data, idx) => {
                return (
                  <>
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td colSpan="4">
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                        >
                          {data.medicine}
                        </span>
                      </td>
                      <td>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                        >
                          {data.frequency} (
                          <strong> {data.medicineTiming} </strong>)
                        </span>
                      </td>
                      <td>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                        >
                          {data.duration}
                        </span>
                      </td>
                      <td>
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                        >
                          {data.quantity}
                        </span>
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </Table>
        {advice && (
          <span>
            ADVICE TO PATIENT:
            <textarea
              class="form-control"
              contentEditable={true}
              suppressContentEditableWarning={true}
            >
              {advice}
            </textarea>
          </span>
        )}
        {digitalSignImg && toggleBtn ? (
          <p>
            Sign:
            <img
              src={digitalSignImg}
              alt="digital sign"
              width="80px"
              height="50px"
            />
          </p>
        ) : (
          ""
        )}
      </div>
      <Button className="download-btn" onClick={handleSubmit}>
        Save
      </Button>
      <Button
        className={
          toggleBtn
            ? "btn download-btn btn-danger"
            : "btn download-btn btn-success"
        }
        onClick={() => setToggleBtn((prev) => !prev)}
      >
        {toggleBtn ? "Remove signature" : "Add signature"}
      </Button>
      <SpeechRecognitionModule
        addRowData={addRowData}
        addAdvice={addAdvice}
        addDiagnosis={addDiagnosis}
        diagnosis={diagnosis}
        setPrescriptionData={(data) => {
          setData(data);
        }}
        data={data}
      />
    </div>
  );
}
