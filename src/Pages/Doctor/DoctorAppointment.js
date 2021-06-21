import React, { useState, useEffect } from "react";
import api from "../../api";

export default function DoctorAppointment(props) {
  const did = props.match.params.id;
  const [patientList, setPatientList] = useState([]);
  useEffect(() => {
    api.get(`/appointment/doctor/${did}`).then(({ data }) => {
      data.map((patientInfo) => {
        return api.get(`/patient/${patientInfo.pid}`).then((data) => {
          setPatientList((prev) => [...prev, data.data]);
        });
      });
    });
  }, [did]);
  return <div>{console.log(patientList)}</div>;
}
