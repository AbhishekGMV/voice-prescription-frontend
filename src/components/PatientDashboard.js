import { React, useState, useEffect } from "react";
import api from "./../api";
import moment from "moment";
import UserNavbar from "./UserNavbar";
import "./../styles/patient-dashboard.css";
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
                <th>PDF</th>
                <th>Audio file</th>
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
                      {/* <input type="button" className="btn btn-success btn-sm"> */}
                      <input
                        type="button"
                        className="btn btn-success btn-sm"
                        value="VIEW"
                      />
                      {/* </input> */}
                    </td>
                    <td>
                      {/* brute force to play files*/}
                      <a
                        className="btn btn-danger btn-sm"
                        href={consultation.audio}
                      >
                        LISTEN
                      </a>
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
