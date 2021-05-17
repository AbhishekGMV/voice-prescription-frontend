import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./../api";
import moment from "moment";
import "./../styles/patient-dashboard.css";

export default function PatientDashboard({ match, history }) {
  const [consultationInfo, setConsultationInfo] = useState([]);
  const [patientInfo, setPatientInfo] = useState({ name: "", id: "" });
  const pid = match.params.id;
  useEffect(() => {
    //get all consultation details of the patient
    //along with doctor name
    api.get(`/consultation/patient/${pid}`).then((res) => {
      res.data.map((con) => {
        return api.get(`/doctor/${con.did}`).then((doc) => {
          con["dname"] = doc.data[0].dname;
          con["cdatetime"] = moment(con.cdatetime).format("h:mm a, MMM Do YY");
          setConsultationInfo((prev) => [...prev, con]);
        });
      });
    });
  }, [pid]);

  useEffect(() => {
    //get patient name and ID to display on navbar
    let parsed = Number.parseInt(pid);
    if (Number.isNaN(parsed)) {
      history.push("/404");
    }

    api.get(`/patient/${pid}`).then((res) => {
      if (res.data.length > 0) {
        setPatientInfo({ name: res.data[0].pname, id: res.data[0].pid });
      }
    });
  }, [pid, history]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/patient/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">doctors</li>
            <li className="nav-item">appointments</li>
            <li className="nav-item">book an appointment</li>
            <li className="nav-item info">
              <strong>
                {patientInfo.name}-{patientInfo.id}
              </strong>
            </li>
          </ul>
        </div>
      </nav>
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
            {consultationInfo && consultationInfo.length ? (
              consultationInfo.map((consultation) => {
                return (
                  <tr key={consultation.cid}>
                    <td>{consultation.cid}</td>
                    <td>{consultation.dname}</td>
                    <td>{consultation.cdatetime}</td>
                    <td>
                      <input
                        type="button"
                        className="btn btn-success btn-sm"
                        value="VIEW"
                      />
                    </td>
                    <td>
                      <input
                        type="button"
                        className="btn btn-danger btn-sm"
                        value="LISTEN"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
