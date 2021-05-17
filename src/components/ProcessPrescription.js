import React from "react";
import axios from "axios";
import Navbar from "./Navbar";

// import ReactPlayer from "react-player";

export default class ProcessPrescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      responseText: "",
      loading: false,
      error: false,
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
          error: false,
          responseText: res.data.responseText,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: true,
        });
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
    } else if (this.state.error) {
      return (
        <p className="error" style={{ color: "red" }}>
          Unable to process request...
        </p>
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
        {/* <ReactPlayer url="https://drive.google.com/file/d/1HB4UaNOGUFxDRpSngshNf5OhViGOaJk-/view?usp=sharing" /> */}
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

// {
//   medsname: {
//     ['med1','med2','med3','med4']
//  }
//  timing: {
//     []
//  }
//  diet_exercise: {

//  }
// }
