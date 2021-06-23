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
      digitalSignImg: "",
    };
  }
  pid = this.props.match.params.id;
  currentDate = moment();
  reader = new FileReader();
  // url = "";

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

  handleDigitalSignUpload = (digitalSignFile) => {
    this.reader.readAsDataURL(digitalSignFile);
    this.reader.onloadend =  () => {
      this.setState({
          digitalSignImg: [this.reader.result]
      })
    }
  }

  render() {
    return (
      <div className="main container">
        <div style={{padding: "15px", border: "1px solid black"}} id="prescription">
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
              <label>ADVICE: </label>
              <textarea
                className="form-control"
                defaultValue={this.state.advice}
              />
            </span>
          )}
          {this.state.digitalSignImg && <p>Sign: 
            <img src={this.state.digitalSignImg} alt="digital sign" width="80px" height="50px" />
          </p>}
          
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
        {
            <>Add signature
            <input type="file" onChange={(e)=>this.handleDigitalSignUpload(e.target.files[0])}/>
            </>
          }
      </div>

    );
  }
}
