import { React, useEffect, useState } from "react";
import moment from "moment";
import UserNavbar from "./../../components/UserNavbar";
import api from "./../../api";
import "./../../styles/appointment-page.css";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function PatientAppointment() {
  const [appointmentInfo, setAppointmentInfo] = useState([]);
  const [patientInfo, setPatientInfo] = useState({ name: "", id: "" });
  const { pid } = useParams();
  const navigate = useNavigate();

  const formatData = (app, doc) => {
    app["reason"] = doc.data[0].role;
    app["dname"] = doc.data[0].dname;
    app["did"] = doc.data[0].did;
    app["booking_date"] = moment(app.booking_date).format("MMM Do, YY");
    app["start_time"] = moment(app.start_time, "hh:mm").format("hh:mm a");
    app["end_time"] = moment(app.end_time, "hh:mm").format("hh:mm a");
    return app;
  };

  const cancelAppointment = (bid, did, slot_no) => {
    let sure = window.confirm("Are you sure?");
    if (sure) {
      api
        .post("/appointment/cancel", {
          bid: bid,
          did: did,
          slotNo: slot_no,
        })
        .then(() => {
          setAppointmentInfo([]);
          api.get(`/appointment/patient/${pid}`).then((res) => {
            res.data.map((app) => {
              return api
                .get(`/doctor/${app.did}`)
                .then((doc) => {
                  const data = formatData(app, doc);
                  setAppointmentInfo((prev) => [...prev, data]);
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
        })
        .catch((err) => {
          console.error(err);
          alert("error");
        });
    }
  };

  useEffect(() => {
    let parsed = Number.parseInt(pid);
    if (Number.isNaN(parsed)) {
      navigate("/404");
    }

    api.get(`/patient/${pid}`).then((res) => {
      if (res.data.length > 0) {
        setPatientInfo({ name: res.data[0].pname, id: res.data[0].pid });
      }
    });

    api.get(`/appointment/patient/${pid}`).then((res) => {
      res.data.map((app) => {
        return api
          .get(`/doctor/${app.did}`)
          .then((doc) => {
            const data = formatData(app, doc);
            setAppointmentInfo((prev) => [...prev, data]);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  }, [navigate, pid]);

  return (
    <div>
      <UserNavbar userRole={"patient"} userInfo={patientInfo} />
      {appointmentInfo.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <strong>All your appointment details will appear here</strong>
        </div>
      ) : (
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr className="table-primary">
                <th>Appointment No</th>
                <th>Doctor ID</th>
                <th>Doctor name</th>
                <th>Problem</th>
                <th>Date</th>
                <th>Timings</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointmentInfo && appointmentInfo.length ? (
                appointmentInfo.map((appointment) => {
                  return (
                    <tr key={appointment.bid}>
                      <td>{appointment.bid}</td>
                      <td>{appointment.did}</td>
                      <td>{appointment.dname}</td>
                      <td>{appointment.reason}</td>
                      <td>{appointment.booking_date}</td>
                      <td>
                        {appointment.start_time} - {appointment.end_time}
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() =>
                            cancelAppointment(
                              appointment.bid,
                              appointment.did,
                              appointment.slot_no
                            )
                          }
                        >
                          Cancel
                        </Button>
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
      )}
    </div>
  );
}
