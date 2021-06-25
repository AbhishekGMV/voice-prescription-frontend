import React from "react";
import api from "./../../api";
import { Link } from "react-router-dom";
import "./../../styles/login.css";
export default class PatientLogin extends React.Component {
  initialState = { phoneNumber: "", password: "", error: false };
  state = this.initialState;

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: false });
    api
      .post("/patient/login", {
        phno: this.state.phoneNumber,
        password: this.state.password,
      })
      .then((response) => {
        const pid = response.data.pid;
        this.props.history.push(`/patient/${pid}`);
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: true });
      });
  };

  render() {
    return (
      <div>
        <div className="split leftt">
          
        </div>
        
        <div className="form-group split right">
        <div style={{fontfamily: 'Sans-Serif'}}><h4><u>Patient login</u></h4></div>
          <form onSubmit={this.handleSubmit}>
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
                value={this.state.password}
                placeholder="Password"
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
            <span><b>Don't have an account?</b></span>
            <Link to="/patient/register">Register here</Link>
          </form>
        </div>
      </div>
    );
  }
}
