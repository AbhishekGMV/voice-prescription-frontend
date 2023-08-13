import React, { useEffect, useState } from "react";
import api from "./../../api";
import "./../../styles/register.css";
import UserNavbar from "./../../components/UserNavbar";
import { useNavigate, useParams } from "react-router-dom";

export default function AddPatient() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pid, setPid] = useState("");
  const [error, setError] = useState(false);
  const [dname, setDname] = useState("");
  const id = useParams().did;
  const [did, setDid] = useState(id);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/doctor/${did}`).then((res) => {
      if (res.data.length > 0) {
        setDname(res.data[0].dname);
        setDid(res.data[0].did);
      }
    });
  }, [did]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);
    api
      .put("/patient/register", {
        pname: name,
        pid,
        dob,
        pphno: phoneNumber,
        gender,
      })
      .then(() => {
        alert("Patient details updated successfully!");
        navigate(`/doctor/${did}/appointment`);
      })
      .catch(() => {
        alert("Incorrect PID");
        setError(true);
      });
  };

  return (
    <>
      <UserNavbar userRole="doctor" userInfo={{ name: dname, id: did }} />
      <div className="outFormControl">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10%", fontfamily: "Sans-Serif" }}>
            <h2>Patient Register</h2>
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              value={pid}
              className="form-control"
              placeholder="PID"
              required
              onChange={(e) => setPid(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              value={name}
              className="form-control"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="date"
              className="form-control"
              value={dob}
              required
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              required
              onChange={(e) => setGender(e.currentTarget.value)}
              checked={gender === "M"}
              value="M"
            />
            <label>Male</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              required
              name="flexRadioDefault"
              onChange={(e) => setGender(e.currentTarget.value)}
              value="F"
              checked={gender === "F"}
            />
            <label>Female</label>
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={phoneNumber}
              required
              placeholder="Phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="btn-section">
            <input type="submit" className="btn btn-success" />
            <input
              className="btn btn-danger"
              type="reset"
              onClick={() => console.log("clear")}
            />
          </div>
          {error ? <div className="error"> Unable to register</div> : ""}
        </form>
      </div>
    </>
  );
}
