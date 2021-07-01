import React from "react";
import api from "./../../api";
import moment from "moment";
import { Table, Button, Card } from "react-bootstrap";
import logo from "./../../images/prescription-logo.png";
import d_logo from "./../../images/Logo.jpeg";
import "./../../styles/prescription-page.css";
import SpeechRecognitionModule from "../../components/SpeechRecognitionModule";
import html2canvas from "html2canvas";

export default class ProcessPrescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      responseText: "",
      loading: false,
      error: false,
      patientInfo: [],
      doctorInfo: [],
      prescriptionData: [],
      advice: "",
      diagnosis: "",
      digitalSignImg: "",
      toggleBtn: false,
    };
  }
  pid = this.props.match.params.id;
  currentDate = moment();
  did = this.props.location.pathname.split("/")[2];
  // formData = new FormData();

  componentDidMount() {
    api
      .get(`/patient/${this.pid}`)
      .then(({ data }) => {
        this.setState({ patientInfo: data[0] });
      })
      .catch((err) => {
        console.error(err);
      });
    api.get(`/doctor/${this.did}`).then(({ data }) => {
      this.setState({
        doctorInfo: data[0],
        digitalSignImg: data[0].signature,
      });
    });
  }

  getAge = () => {
    const dob = moment(this.state.patientInfo.dob).format("MM/DD/YYYY");
    const age = moment(dob, "MM/DD/YYYY").fromNow().slice(0, 2);
    return age;
  };

  // transcribeAudioFile = () => {
  //   if (this.state.loading) {
  //     return (
  //       <div className="d-flex justify-content-center" role="status">
  //         <div className="spinner-border" role="status"></div>
  //         <span className="sr-only">Processing prescription...</span>
  //       </div>
  //     );
  //   } else if (this.state.error) {
  //     return (
  //       <p className="error" style={{ color: "red" }}>
  //         Unable to process request...
  //       </p>
  //     );
  //   }
  // };

  getFrequency = (frequency) => {
    let formattedFrequency = "";
    let rawFrequency = frequency.split("-");
    formattedFrequency += rawFrequency[0] === "1" ? "morning," : "";
    formattedFrequency += rawFrequency[1] === "1" ? " afternoon," : "";
    formattedFrequency += rawFrequency[2] === "1" ? " and evening" : "";
    return formattedFrequency;
  };

  processPrescriptionAudio = () => {
    // Diagnising for {diagnosis}
    // take {quantity} of {medicine} at {frequency} for {duration}
    // {advice}
    let speechData = {
      diagnosis: this.state.diagnosis,
      medicineData: [],
      advice: this.state.advice,
    };
    this.state.prescriptionData.map((row) => {
      //{medicine: "Crocin", frequency: "1-0-0", medicineTiming: "After food.", quantity: "1 tablet. ", duration: "3 days. "}
      let rowSpeechData = `Take ${row.quantity} of ${
        row.medicine
      } at ${this.getFrequency(row.frequency)} ${row.medicineTiming} for ${
        row.duration
      }`;
      rowSpeechData = rowSpeechData.replace(/[.]/g, "");
      return speechData.medicineData.push(rowSpeechData);
    });
    return speechData;
  };

  handleSubmit = () => {
    let speechData = this.processPrescriptionAudio();
    const postData = {
      audio: speechData,
      did: this.did,
      pid: this.pid,
      cdatetime: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    const prescriptionCanvas = document.getElementById("prescription");
    html2canvas(prescriptionCanvas, { scrollY: -window.scrollY }).then(
      (data) => {
        postData["pdf"] = data.toDataURL();
        api
          .post("/consultation", postData)
          .then(({ data }) => {
            alert("success");
          })
          .catch(() => {
            alert("error");
          });
      }
    );

    // window
    //   .html2pdf()
    //   .from(prescriptionCanvas)
    //   .saveAs(
    //     `${this.state.patientInfo.pname}-${this.state.patientInfo.pid}-prescription`
    //   );
  };

  addRowData = (medName, frequency, medicineTiming, duration, quantity) => {
    if (
      medName.length &&
      frequency.length &&
      medicineTiming.length &&
      duration.length &&
      quantity.length
    ) {
      this.setState({
        prescriptionData: [
          ...this.state.prescriptionData,
          {
            medicine: medName,
            frequency: frequency,
            medicineTiming: medicineTiming,
            quantity: quantity,
            duration: duration,
          },
        ],
      });
    }
  };

  addAdvice = (advice) => {
    this.setState({ advice: advice });
  };

  addDiagnosis = (diagnosis) => {
    this.setState({
      diagnosis: diagnosis,
    });
  };

  render() {
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
          {this.state.patientInfo && (
            <div className="patient-info">
              <div>
                <div className="doctor-info">
                  <div style={{ color: "rgb(7, 70, 143)" }}>
                    <h4>Dr. {this.state.doctorInfo.dname}</h4>
                  </div>
                  <div style={{ textTransform: "capitalize" }}>
                    <strong>{this.state.doctorInfo.role}</strong>
                  </div>
                  <div>
                    <strong> </strong> {this.state.doctorInfo.demail}
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    {" "}
                    <strong> </strong>
                    {this.state.doctorInfo.dphno}
                  </div>
                </div>
                <div>
                  <strong>Name: </strong>
                  {this.state.patientInfo.pname}
                </div>
                <div>
                  <strong>AGE: </strong> {this.getAge()}
                  <span className="date">
                    <strong>Date: </strong>{" "}
                    {this.currentDate.format("DD MMM, yy")}
                  </span>
                </div>
                <div>
                  <strong>Gender: </strong> {this.state.patientInfo.gender}
                </div>
              </div>

              <div>
                <strong>PID: </strong>
                {this.state.patientInfo.pid}
              </div>
            </div>
          )}
          {/* {this.transcribeAudioFile()} */}
          {this.state.diagnosis.length ? (
            <Card.Header>
              <strong>Diagnosis: </strong>
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                {this.state.diagnosis}
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
              {this.state.prescriptionData &&
                this.state.prescriptionData.map((data, idx) => {
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
          {this.state.advice && (
            <span>
              <label>ADVICE TO PATIENT: </label>
              {/* <textarea
                className="form-control"
                onChange={() => {
                  this.setState(this.state.advice);
                }}
                value={this.state.advice}
              /> */}
              <textarea
                class="form-control"
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                {this.state.advice}
              </textarea>
            </span>
          )}
          {this.state.digitalSignImg && this.state.toggleBtn ? (
            <p>
              Sign:
              <img
                src={this.state.digitalSignImg}
                alt="digital sign"
                width="80px"
                height="50px"
              />
            </p>
          ) : (
            ""
          )}
        </div>
        <Button className="download-btn" onClick={this.handleSubmit}>
          Save
        </Button>
        <Button
          className={
            this.state.toggleBtn
              ? "btn download-btn btn-danger"
              : "btn download-btn btn-success"
          }
          onClick={() => this.setState({ toggleBtn: !this.state.toggleBtn })}
        >
          {this.state.toggleBtn ? "Remove signature" : "Add signature"}
        </Button>
        <SpeechRecognitionModule
          addRowData={this.addRowData}
          addAdvice={this.addAdvice}
          addDiagnosis={this.addDiagnosis}
          diagnosis={this.state.diagnosis}
          setPrescriptionData={(data) => {
            this.setState({ data });
          }}
          data={this.state.data}
        />
      </div>
    );
  }
}
