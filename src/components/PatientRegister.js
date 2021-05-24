import React from "react";
import api from "./../api";
import { Link } from "react-router-dom";
import "./../styles/register.css";

export default class PatientRegister extends React.Component {
  initialState = {
    name: "",
    email: "",
    dob: "",
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
        .post("/patient/register", {
          name: this.state.name,
          email: this.state.email,
          dob: this.state.dob,
          phno: this.state.phoneNumber,
          password: this.state.password,
        })
        .then((response) => {
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
        <div className="form-control">
          <form onSubmit={this.handleSubmit}>
            <label>Register</label>
            <div className="input-group mb-3">
              <input
                type="text"
                value={this.state.name}
                className="form-control"
                placeholder="Name"
                required
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                value={this.state.email}
                placeholder="example@email.com(optional)"
                onChange={(e) => this.setState({ email: e.target.value })}
              />{" "}
            </div>
            <div className="input-group mb-3">
              <input
                type="date"
                className="form-control"
                value={this.state.dob}
                required
                onChange={(e) => this.setState({ dob: e.target.value })}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={this.state.phoneNumber}
                required
                placeholder="Phone number"
                onChange={(e) => this.setState({ phoneNumber: e.target.value })}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                value={this.state.password}
                required
                placeholder="Password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                value={this.state.confirmPassword}
                required
                placeholder="Confirm password"
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
      </div>
    );
  }
}
