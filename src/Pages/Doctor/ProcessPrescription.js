import React from "react";
import api from "./../../api";
import moment from "moment";
import { Table, Button, Card } from "react-bootstrap";
import logo from "./../../images/prescription-logo.png";
import "./../../styles/prescription-page.css";
import SpeechRecognitionModule from "../../components/SpeechRecognitionModule";

export default class ProcessPrescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      responseText: "",
      loading: false,
      error: false,
      patientInfo: [],
      prescriptionData: [],
      advice: "",
      diagnosis: "",
    };
  }
  pid = this.props.match.params.id;
  currentDate = moment();

  componentDidMount() {
    api
      .get(`/patient/${this.pid}`)
      .then(({ data }) => {
        this.setState({ patientInfo: data[0] });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleFileChange = (e) => {
    this.setState({
      loading: true,
    });
    const data = new FormData();
    data.append("audio", e.target.files[0]);
    api
      .post(
        "https://speech-to-text-api-1.herokuapp.com/transcribeAudio",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        this.setState({
          loading: false,
          error: false,
          responseText: res.data.responseText,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: true,
        });
      });
    e.target.value = "";
  };

  getAge = () => {
    const dob = moment(this.state.patientInfo.dob).format("MM/DD/YYYY");
    const age = moment(dob, "MM/DD/YYYY").fromNow().slice(0, 2);
    return age;
  };

  transcribeAudioFile = () => {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center" role="status">
          <div className="spinner-border" role="status"></div>
          <span className="sr-only">Processing prescription...</span>
        </div>
      );
    } else if (this.state.error) {
      return (
        <p className="error" style={{ color: "red" }}>
          Unable to process request...
        </p>
      );
    }
  };

  handleClick = () => {
    const prescriptionCanvas = document.getElementById("prescription");
    window
      .html2pdf()
      .from(prescriptionCanvas)
      .saveAs(
        `${this.state.patientInfo.pname}-${this.state.patientInfo.pid}-prescription`
      );
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
        <div id="prescription">
          {this.state.patientInfo && (
            <div className="patient-info">
              <div>
                <div>
                  <strong>Name: </strong>
                  {this.state.patientInfo.pname}
                </div>
                <div>
                  <strong>AGE: </strong> {this.getAge()}
                </div>
                <div>
                  <strong>Gender: </strong> {this.state.patientInfo.gender}
                </div>
              </div>
              <span className="date">
                <strong>Date: </strong> {this.currentDate.format("DD MMM, yy")}
              </span>
              <div>
                <strong>PID: </strong>
                {this.state.patientInfo.pid}
              </div>
            </div>
          )}
          {/* {this.transcribeAudioFile()} */}
          {this.state.diagnosis.length ? (
            <Card.Header>
              <strong>Diagnosis:</strong> {this.state.diagnosis}
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
                      <tr key={idx + 1}>
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
                          {data.frequency} - (
                          <strong> {data.medicineTiming} </strong>)
                        </td>
                        <td>{data.duration}</td>
                        <td>{data.quantity}</td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </Table>
          {this.state.advice && (
            <span>
              <label>ADVICE: </label>
              <textarea
                className="form-control"
                defaultValue={this.state.advice}
              />
            </span>
          )}
        </div>
        <Button className="download-btn" onClick={this.handleClick}>
          Download pdf
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
