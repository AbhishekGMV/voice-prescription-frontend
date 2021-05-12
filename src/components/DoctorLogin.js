import React from "react";
import api from "./../api";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./../styles/login.css";

export default class DoctorLogin extends React.Component {
  initialState = { phoneNumber: "", password: "", error: false };
  state = this.initialState;

  handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/doctor/login", {
        phno: this.state.phoneNumber,
        password: this.state.password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(() => {
        this.setState({ error: true });
      });
  };

  render() {
    return (
      <div>
        <Navbar/>
        <div className="form-group">
          <form onSubmit={this.handleSubmit}>
            <label>Doctor login</label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={this.state.phoneNumber}
                placeholder="Phone number"
                required
                onChange={(e) => this.setState({ phoneNumber: e.target.value })}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={this.state.password}
                required
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>
            <div className="btn-section">
              <input type="submit" className="btn btn-success" />
              <input
                type="reset"
                className="btn btn-danger"
                onClick={() => this.setState(this.initialState)}
              />
            </div>
            {this.state.error ? (
              <div className="error"> Unable to login</div>
            ) : (
              ""
            )}
            <span>Don't have an account? </span>{" "}
            <Link to="/doctor/register">Register here</Link>
          </form>
        </div>
      </div>
    );
  }
}
