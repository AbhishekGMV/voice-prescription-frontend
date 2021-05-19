import { React, useEffect, useState } from "react";
import moment from "moment";
import UserNavbar from "./UserNavbar";
import api from "./../api";

export default function PatientAppointment({ match, history }) {
  const [appointmentInfo, setAppointmentInfo] = useState([]);
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

    api.get(`/appointment/patient/${pid}`).then((res) => {
      res.data.map((app) => {
        return api.get(`/doctor/${app.did}`).then((doc) => {
          app["dname"] = doc.data[0].dname;
          app["booking_date"] = moment(app.booking_date).format("MMM Do, YY");
          app["start_time"] = moment(app.start_time, "hh:mm").format("hh:mm a");
          app["end_time"] = moment(app.end_time, "hh:mm").format("hh:mm a");
          // moment("1234", "hmm").format("HH:mm") === "12:34";
          setAppointmentInfo((prev) => [...prev, app]);
        });
      });
    });
  }, [pid, history]);
  return (
    <div>
      <UserNavbar userRole={"patient"} userInfo={patientInfo} />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Appointment No</th>
              <th>Doctor name</th>
              <th>Date</th>
              <th>Timings</th>
            </tr>
          </thead>
          <tbody>
            {appointmentInfo && appointmentInfo.length ? (
              appointmentInfo.map((appointment) => {
                return (
                  <tr key={appointment.bid}>
                    <td>{appointment.bid}</td>
                    <td>{appointment.dname}</td>
                    <td>{appointment.booking_date}</td>
                    <td>
                      {appointment.start_time} - {appointment.end_time}
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
