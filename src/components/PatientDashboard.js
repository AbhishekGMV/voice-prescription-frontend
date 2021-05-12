import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./../api";
import "./../styles/patient-dashboard.css";
export default function PatientDashboard() {
  const [patients, setPatients] = useState();

  useEffect(() => {
    api.get("/patient").then((res) => setPatients(res.data));
  }, []);

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
            <li className="nav-item">NAME-PID</li>
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
            {patients && patients.length ? (
              patients.map((patient) => {
                return (
                  <tr key={patient.pid}>
                    <td>{patient.pname}</td>
                    <td>{patient.pphno}</td>
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
                    <td>{patient.dob}</td>
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
