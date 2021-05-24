import React from "react";
import api from "./../api";
import { Link } from "react-router-dom";
import "./../styles/register.css";

export default class PatientRegister extends React.Component {
  initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    error: false,
  };

  state = this.initialState;

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: false });
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: true });
    } else {
      api
        .post("/doctor/register", {
          name: this.state.name,
          email: this.state.email,
          phno: this.state.phoneNumber,
          password: this.state.password,
        })
        .then((response) => {
          this.setState({ error: false });
          alert(response.statusText);
        })
        .catch(() => {
          this.setState({ error: true });
        });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Doctor register</label>
          <div className="input-group mb-3">
            <input
              type="text"
              value={this.state.name}
              className="form-control"
              required
              placeholder="Name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              placeholder="example@email.com"
              className="form-control"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />{" "}
          </div>
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
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              value={this.state.confirmPassword}
              placeholder="Confirm password"
              required
              onChange={(e) =>
                this.setState({ confirmPassword: e.target.value })
              }
            />
          </div>
          <div className="btn-section">
            <input type="submit" className="btn btn-success" />
            <input
              className="btn btn-danger"
              type="reset"
              onClick={() => this.setState(this.initialState)}
            />
          </div>
          {this.state.error ? (
            <div className="error"> Unable to register</div>
          ) : (
            ""
          )}
          <span>Already have an account? </span>{" "}
          <Link to="/patient/login">Login here</Link>
        </form>
      </div>
    );
  }
}
