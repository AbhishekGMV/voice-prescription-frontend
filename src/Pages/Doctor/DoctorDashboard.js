import { React, useState, useEffect } from "react";
import api from "./../../api";
import moment from "moment";
import UserNavbar from "./../../components/UserNavbar";
import "./../../styles/patient-dashboard.css";
// import { Button } from "react-bootstrap";

export default function PatientDashboard({ match, history }) {
  const [consultationInfo, setConsultationInfo] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({ name: "", id: "" });
  const did = match.params.id;

  useEffect(() => {
    let parsed = Number.parseInt(did);
    if (Number.isNaN(parsed)) {
      history.push("/404");
    }

    api.get(`/doctor/${did}`).then((res) => {
      if (res.data.length > 0) {
        setDoctorInfo({ name: res.data[0].dname, id: res.data[0].did });
      }
    });

    api.get(`/consultation/doctor/${did}`).then((res) => {
      res.data.map((con) => {
        return api.get(`/patient/${con.pid}`).then((patient) => {
          con["pname"] = patient.data[0].pname;
          con["pid"] = patient.data[0].pid;
          con["cdatetime"] = moment(con.cdatetime).format(" h:mm a, MMM Do YY");
          setConsultationInfo((prev) => [...prev, con]);
        });
      });
    });
  }, [did, history]);

  return (
    <div>
      <UserNavbar userRole={"doctor"} userInfo={doctorInfo} />
      {consultationInfo.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <strong>Patients consultation details will appear here</strong>
        </div>
      ) : (
        <div className="consultation-list">
          {/* <table className="table">
            <thead>
              <tr>
                <th>Consultation No</th>
                <th>Patient ID </th>
                <th>Patient name </th>
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
                    <td>{consultation.pid}</td>
                    <td>{consultation.pname}</td>
                    <td>{consultation.cdatetime}</td> */}
                    
                    
                    {/* <td>{consultation.pdf}</td>
                    <td>{consultation.audio}</td> */}

                    {/* <td> */}

                      {/* <input type="button" className="btn btn-success btn-sm"> */}

                      {/* <input
                        type="button"
                        className="btn btn-success btn-sm"
                        value="VIEW"
                      /> */}

                      {/* </input> */}

                    {/* </td>
                    <td> */}
                      {/* brute force to play files*/}
                      {/* <a
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
          </table> */}
        </div>
      )}
    </div>
  );
}
