import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <Link className="navbar-brand" to="/patient/login">
          Patient
        </Link>
        <Link className="navbar-brand" to="/doctor/login">
          Doctor
        </Link>
        <Link className="navbar-brand" to="/doctor/process-prescription">
          Prescription
        </Link>
      </nav>
    </div>
  );
}
