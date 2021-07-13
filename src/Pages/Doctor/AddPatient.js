import React from "react";
import api from "./../../api";
import "./../../styles/register.css";
import UserNavbar from "./../../components/UserNavbar";


export default class AddPatient extends React.Component {

  initialState = {
    name: "",
    pid:"",
    dob: "",
    gender: "",
    phoneNumber: "",
    error: false,
    dname:"",
    did:"",
  };
  state = this.initialState;
  did = this.props.match.params.id;
  
  componentDidMount(){
    api.get(`/doctor/${this.did}`).then((res) => {
        if (res.data.length > 0) {
          this.setState({ dname:res.data[0].dname,did:res.data[0].did });
          console.log(res);

        }
  })}
  
  

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: false });
      api
        .put("/patient/register", {
          pname: this.state.name,
          pid: this.state.pid,
          dob: this.state.dob,
          pphno: this.state.phoneNumber,
          gender: this.state.gender,
        })
        .then(() => {
          alert("Patient details updated successfully!")
          this.props.history.push(`/doctor/${this.did}/appointment`);
        })
        .catch(() => {
          this.setState({ error: true });
        });
    
  };

  render() {
    return (
       
       <>
      <UserNavbar userRole="doctor" userInfo={{name:this.state.dname,id:this.state.did}} />
      <div className="outFormControl">
          
          <form onSubmit={this.handleSubmit}>
          <div style={{marginBottom: '10%', fontfamily: 'Sans-Serif'}}><h2>Patient Register</h2></div>
           <div className="input-group mb-3">
              <input
                type="text"
                value={this.state.pid}
                className="form-control"
                placeholder="PID"
                required
                onChange={(e) => this.setState({ pid: e.target.value })}
              />
            </div>
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
                type="date"
                className="form-control"
                value={this.state.dob}
                required
                onChange={(e) => this.setState({ dob: e.target.value })}
              />
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                required
                onChange={(e) => {
                  this.setState({ gender: e.currentTarget.value });
                }}
                checked={this.state.gender === "Male"}
                value="Male"
              />
              <label>Male</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                required
                name="flexRadioDefault"
                onChange={(e) => {
                  this.setState({ gender: e.currentTarget.value });
                }}
                value="Female"
                checked={this.state.gender === "Female"}
              />
              <label>Female</label>
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
          </form>
        </div>
      </>
    );
  }
}
