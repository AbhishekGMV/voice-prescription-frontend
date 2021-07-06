import { React, useState, useEffect } from "react";
import api from "./../../api";
import moment from "moment";
import UserNavbar from "./../../components/UserNavbar";
import "./../../styles/patient-dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faDownload,
  faPause,
  faStopCircle,
  faPlayCircle,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";

// import { Button } from "react-bootstrap";

export default function PatientDashboard({ match, history }) {
  const [consultationInfo, setConsultationInfo] = useState([]);
  const [patientInfo, setPatientInfo] = useState({ name: "", id: "" });
  const pid = match.params.id;

  useEffect(() => {
    let parsed = Number.parseInt(pid);
    if (Number.isNaN(parsed)) {
      history.push("/404");
    }

    api.get(`/patient/${pid}`).then((res) => {
      if (res.data.length > 0) {
        setPatientInfo({ name: res.data[0].pname, id: res.data[0].pid });
      }
    });

    api.get(`/consultation/patient/${pid}`).then((res) => {
      res.data.map((con) => {
        return api.get(`/doctor/${con.did}`).then((doc) => {
          con["dname"] = doc.data[0].dname;
          con["cdatetime"] = moment(con.cdatetime).format(" h:mm a, MMM Do YY");
          setConsultationInfo((prev) => [...prev, con]);
        });
      });
    });
  }, [pid, history]);

  const viewPrescription = (dataUrl) => {
    let image = new Image();
    image.src = dataUrl;
    let w = window.open("");
    w.document.write(image.outerHTML);
    w.document.close();
  };

  const downloadPrescription = (dataUrl) => {
    let image = new Image();
    image.src = dataUrl;
    image.width = "800";
    window
      .html2pdf()
      .from(image)
      .saveAs(`${patientInfo.name}-${patientInfo.id}-prescription`);
  };

  const playPrescriptionAudio = (prescriptionData) => {
    let msg = new SpeechSynthesisUtterance();
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.text = prescriptionData;
    msg.lang = "en-IN";
    speechSynthesis.speak(msg);
  };

  return (
    <div>
      <UserNavbar userRole={"patient"} userInfo={patientInfo} />
      {consultationInfo.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <strong>All your consultation details will appear here</strong>
        </div>
      ) : (
        <div className="consultation-list">
          <table className="table">
            <thead>
              <tr>
                <th>Consultation No</th>
                <th>Doctor name</th>
                <th>Date & time</th>
                <th>View</th>
                <th>Download</th>
                <th colSpan="4">Audio</th>
              </tr>
            </thead>
            <tbody>
              {consultationInfo.map((consultation) => {
                return (
                  <tr key={consultation.cid}>
                    <td>{consultation.cid}</td>
                    <td>{consultation.dname}</td>
                    <td>{consultation.cdatetime}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => viewPrescription(consultation.pdf)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => downloadPrescription(consultation.pdf)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </td>
                    <td>
                      <button
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Play"
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          playPrescriptionAudio(consultation.audio);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlayCircle} />
                      </button>

                      <button
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Pause"
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          window.speechSynthesis.pause();
                        }}
                      >
                        <FontAwesomeIcon icon={faPause} />
                      </button>
                      <button
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Resume"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          window.speechSynthesis.resume();
                        }}
                      >
                        <FontAwesomeIcon icon={faStepForward} />
                      </button>
                      <button
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Stop"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                        }}
                      >
                        <FontAwesomeIcon icon={faStopCircle} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
