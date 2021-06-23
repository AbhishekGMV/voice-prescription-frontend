import React from "react";
import api from "./../../api";
import moment from "moment";
import { Table, Button } from "react-bootstrap";
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

  vonagesendSMS = () => {

    const Vonage = require('@vonage/server-sdk')

    const vonage = new Vonage({
      apiKey: "a8e9ff65",
      apiSecret: "PuENTMe7vanl96zV"
    });

    const from = "Vonage APIs"
    const to = "919483952634"
    const text = 'A text message sent using the Vonage SMS API'

    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
  }

  fast2smssendSMS = () => {

    let prescriptionTable = document.getElementById("prescription");
    let tableContent = prescriptionTable.innerText.split('\n');
    let countItems = tableContent.length-1;
    let smsTextObject = {};
    let patientPhoneNumber = this.state.patientInfo.pphno;

    for (let i = 4; i <= countItems; i++) {
      const singleRow = tableContent[i];
      smsTextObject[i] = singleRow.split('\t');
    }

    // console.warn(smsTextObject, typeof(patientPhoneNumber), patientPhoneNumber);


    var fast2sms = require('fast2sms');
    var options = {API_KEY:'B9Hy6Fvs3dJUo2cj175PeGOkKEA4TiVNLMWrq0XRhwZl8uCIQYOVePXyYrE6JMbj41iUHvR5owIWsh7x'};
    fast2sms.init(options);
    fast2sms.send({ message: 'The SMS content e.g. "This is a message from Fast2SMS"', to: '+916361599901' }).then(function (data) {
        console.log('data................', data);
    }).catch(function (error) {
        console.log('err.................', error);
    });

  }

  twiliosendSMS = () => {
    const accountSid = 'AC215b45eb4eda26670a9e4f221311be6e';
    const authToken = '171e378a55f1952515effffd3bd040ee';
    
    //Example Code from NPM.
    // const result = dotenv.config();

    // if (result.error) {
    //   throw result.error;
    // }

    // console.log(result.parsed);
    //End of Example code from NPM.


    // require('dotenv').config({ path: 'C:/Users/Ashish/Desktop/Medipro/voice-prescription-frontend/.env' });
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;

    console.warn(accountSid, authToken);
    const client = require('twilio')(accountSid, authToken);

    let prescriptionTable = document.getElementById("prescription");
    let tableContent = prescriptionTable.innerText.split('\n');
    let countItems = tableContent.length-1;
    let smsTextObject = {};
    let patientPhoneNumber = this.state.patientInfo.pphno;

    for (let i = 4; i <= countItems; i++) {
      const singleRow = tableContent[i];
      smsTextObject[i] = singleRow.split('\t');
    }

    console.warn(smsTextObject, typeof(patientPhoneNumber), patientPhoneNumber);
    //Construct SMS Body and send.

    client.messages
      .create({body: 'String(smsTextObject)', from: '+12025178333', to: '+919483952634'})
      .then(message => console.log(message.sid));
  }
  handleClick = () => {
    const prescriptionCanvas = document.getElementById("prescription");
    window
      .html2pdf()
      .from(prescriptionCanvas)
      .saveAs(`${this.state.patientInfo.pname}-prescription`);
  };

  addRowData = (medName, frequency, quantity) => {
    if (!medName.length || !frequency.length || !quantity.length) {
      return alert("Unable to add data");
    }
    this.setState({
      prescriptionData: [
        ...this.state.prescriptionData,
        { medicine: medName, frequency: frequency, quantity: quantity },
      ],
    });
  };

  render() {
    return (
      <div className="main container">
        <div id="prescription">
          {this.state.patientInfo && (
            <div className="patient-info">
              <div>
                <strong>
                  {this.state.patientInfo.pname},&nbsp;
                  {this.getAge()}/{this.state.patientInfo.gender}
                </strong>
              </div>
              <span className="date">
                {this.currentDate.format("DD MMM, yy")}
              </span>
              <div>Patient ID: {this.state.patientInfo.pid}</div>
            </div>
          )}
          {/* {!this.state.responseText.length && (
            <input type="file" onChange={this.handleFileChange} />
          )} */
          /*Will uncomment this line when starting to work with file upload*/}

          {this.transcribeAudioFile()}
          <Table striped bordered hover className="prescription-table">
            <thead>
              <tr>
                <th colSpan="5">
                  <img src={logo} className="logo" alt="logo" />
                </th>
                <th>Frequency</th>
                <th>Quantity</th>
              </tr>

              {this.state.prescriptionData &&
                this.state.prescriptionData.map((data, idx) => {
                  return (
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
                      <td>{data.frequency}</td>
                      <td>{data.quantity}</td>
                    </tr>
                  );
                })}
            </thead>
          </Table>
        </div>
        <Button className="download-btn" onClick={this.handleClick}>
          Download pdf
        </Button>

        <Button className="sendsms-btn" onClick={this.vonagesendSMS}>
          Send SMS
        </Button>

        <SpeechRecognitionModule
          addRowData={this.addRowData}
          setPrescriptionData={(data) => {
            this.setState({ data });
          }}
          data={this.state.data}
        />
      </div>
    );
  }
}
