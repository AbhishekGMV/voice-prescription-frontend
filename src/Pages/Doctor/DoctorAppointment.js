import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { Button } from "react-bootstrap";
import UserNavbar from "./../../components/UserNavbar";
import moment from "moment";
import api from "../../api";

export default function DoctorAppointment(props) {
  const did = props.match.params.id;
  const [appointmentList, setAppointmentList] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState([]);
  const [path, setPath] = useState({ location: "", bid: "", slot_no: "" });
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    api.get(`/doctor/${did}`).then((res) => {
      if (res.data.length > 0) {
        setDoctorInfo({ name: res.data[0].dname, id: res.data[0].did });
      }
    });
    api.get(`/appointment/doctor/${did}`).then(({ data }) => {
      data.map((appointmentInfo) => {
        return api
          .get(`/patient/${appointmentInfo.pid}`)
          .then((patientData) => {
            appointmentInfo["pname"] = patientData.data[0].pname;
            appointmentInfo["pid"] = patientData.data[0].pid;
            appointmentInfo["booking_date"] = moment(
              appointmentInfo.booking_date
            ).format("MMM Do");
            appointmentInfo["start_time"] = moment(
              appointmentInfo.start_time,
              "hh:mm"
            ).format("hh:mm a");

            setAppointmentList((prev) => [...prev, data]);
          });
      });
    });
  }, [did]);

  if (redirect) {
    return (
      <Navigate
        to={{
          pathname: path.location,
          state: { bid: path.bid, slot_no: path.slot_no },
        }}
      />
    );
  }

  return (
    <div>
      <UserNavbar userRole="doctor" userInfo={doctorInfo} />
      {appointmentList.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <strong>All your appointment details will appear here</strong>
        </div>
      ) : (
        <div className="consultation-list">
          <table className="table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient ID</th>
                <th>Patient name</th>
                <th>Slot</th>
                <th>Date & time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointmentList[0].map((appointment, idx) => {
                return (
                  <tr key={idx}>
                    <td>{appointment.bid}</td>
                    <td>{appointment.pid}</td>
                    <td>{appointment.pname}</td>
                    <td>{appointment.slot_no}</td>
                    <td>
                      {appointment.booking_date}, {appointment.start_time}
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          setPath({
                            location: `/doctor/${did}/process-prescription/${appointment.pid}`,
                            bid: appointment.bid,
                            slot_no: appointment.slot_no,
                          });
                          setRedirect(true);
                        }}
                      >
                        Make prescription
                      </Button>
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
