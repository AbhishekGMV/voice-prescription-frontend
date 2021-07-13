import React from "react";
import api from "./../../api";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "./../../styles/register.css";

export default class DoctorRegister extends React.Component {
  dropDownOptions = [
    "General",
    "Gynecology",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];

  initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    error: false,
    specialization: null,
    dropdownError: false,
    digitalSign: "",
  };

  state = this.initialState;

  formData = new FormData();

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.specialization) {
      this.setState({ dropdownError: true });
      return;
    }
    this.setState({ error: false });
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: true });
    } else {
      this.formData.append("name", this.state.name);
      this.formData.append("email", this.state.email);
      this.formData.append("phno", this.state.phoneNumber);
      this.formData.append("password", this.state.password);
      this.formData.append("role", this.state.specialization);

      api
        .post("/doctor/register", this.formData)
        .then(({ data }) => {
          this.setState({ dropdownError: false, error: false });
          let did = data[0];
          this.props.history.push(`/doctor/${did}`);
        })
        .catch(() => {
          this.setState({ error: true });
        });
    }
  };

  handleDigitalSignUpload = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.append("signature", reader.result.toString());
    };
  };

  render() {
    return (
      <div className="pic">
        <form className="form-group" onSubmit={this.handleSubmit}>
          <div style={{ fontfamily: "Sans-Serif" }}>
            <h2>
              Doctor Register
            </h2>
          </div><br></br>
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
          <div>
            <label>Specialization:</label>
            <DropdownButton
              onSelect={(value) =>
                this.setState({ specialization: value, dropdownError: false })
              }
              title={
                this.state.specialization === null
                  ? "Specialization"
                  : this.state.specialization
              }
            >
              {this.dropDownOptions.map((title) => {
                return (
                  <Dropdown.Item key={title} eventKey={title}>
                    {title}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
          <div>
            <label>Add signature</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => this.handleDigitalSignUpload(e)}
            />
          </div>
          <div className="Dropdown-required-error">
            {this.state.dropdownError ? (
              <div className="error">Specialization is required</div>
            ) : (
              ""
            )}
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
          <Link to="/doctor/login">Login here</Link>
        </form>
      </div>
    );
  }
}
