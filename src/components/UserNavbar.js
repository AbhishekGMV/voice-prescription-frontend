import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function UserNavbar({ userInfo, userRole }) {
  const { name, id } = userInfo;
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor:"rgb(23,162,184)"}}>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav" >
            <li className="nav-item" >
              <Link to={`/${userRole}/${id}`} style={{ color:"white"}}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${userRole}/${id}/appointment` }style={{ color:"white"}}>Appointments</Link>
            </li>
            {userRole === "patient" && (
              <>
                <li className="nav-item">
                  <Link to={`/patient/${id}/doctors-list`} style={{ color:"white"}}>Doctors</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/patient/${id}/booking`} style={{ color:"white"}}>Book an appointment</Link>
                </li>
              </>
            )}
            {userRole === "doctor" && (
              <>
                <li className="nav-item">
                  <Link to={`/doctor/${id}/add-patient`} style={{ color:"white"}}>Add Patient</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <span className="user-info">
          <li className="nav-item" style={{ color:"white"}}>
            <FontAwesomeIcon className="fa-icon" icon={faUser}  />
            {name}-{id}
          </li>
        </span>
        <li style={{ listStyle: "none" }} className="nav-item">
          <Link to="/" style={{ color:"white"}}>LOGOUT</Link>
        </li>
      </nav>
    </div>
  );
}
