import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function UserNavbar({ userInfo, userRole }) {
  const { name, id } = userInfo;
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to={`/${userRole}/${id}`}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${userRole}/${id}/appointment`}>Appointments</Link>
            </li>
            {userRole === "patient" && (
              <>
                <li className="nav-item">
                  <Link to={`/patient/${id}/doctors-list`}>Doctors</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/patient/${id}/booking`}>Book an appointment</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <span className="user-info">
          <li className="nav-item">
            <FontAwesomeIcon className="fa-icon" icon={faUser} />
            {name}-{id}
          </li>
        </span>
        <li style={{ listStyle: "none" }} className="nav-item">
          <Link to="/">LOGOUT</Link>
        </li>
      </nav>
    </div>
  );
}
