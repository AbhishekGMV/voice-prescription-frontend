import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
export default class ProcessPrescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      responseText: "",
      loading: false,
    };
  }

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  handleFileSubmit = (e) => {
    this.setState({
      loading: true,
    });
    const data = new FormData();
    data.append("audio", this.state.selectedFile);
    axios
      .post(
        "https://speech-to-text-api-1.herokuapp.com/transcribeAudio",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        this.setState({
          loading: false,
          responseText: res.data.responseText,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  display() {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center" role="status">
          <div className="spinner-border" role="status"></div>
          <span className="sr-only">Processing prescription...</span>
        </div>
      );
    } else {
      return (
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          defaultValue={this.state.responseText}
        />
      );
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <input type="file" onChange={this.onChangeHandler} />
        <button
          type="button"
          className="btn btn-success btn-block"
          onClick={this.handleFileSubmit}
        >
          Upload
        </button>
        {this.display()}
      </div>
    );
  }
}
