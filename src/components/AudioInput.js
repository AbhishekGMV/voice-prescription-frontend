import React from "react";

export default function AudioInput() {
  const [audioUrl, setAudioUrl] = React.useState("");

  let mediaRecorder = "";
  let mic = "";
  let sr = new window.webkitSpeechRecognition();
  sr.continuous = true;
  let result = "";
  const handleSuccess = function (stream) {
    const options = { mimeType: "audio/webm" };
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.addEventListener("dataavailable", function (e) {
      if (e.data.size > 0) {
        setAudioUrl(URL.createObjectURL(e.data));
      }
    });
    mediaRecorder.addEventListener("stop", function () {
      console.log(audioUrl);
    });
  };

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    mic = devices.filter((d) => d.kind === "audioinput");
  });

  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId: mic.length ? mic[2].deviceId : "",
      },
    })
    .then(handleSuccess);

  sr.onresult = (res) => {
    result = res;
  };

  return (
    <div>
      <input
        placeholder="MN-AF-NT"
        value={result.length ? result : ""}
        readOnly
        onMouseEnter={() => {
          if (mediaRecorder.state === "paused") {
            mediaRecorder.resume();
          } else {
            mediaRecorder.start();
            sr.start();
            console.log("onEnter: ", mediaRecorder.state);
          }
        }}
        onMouseLeave={() => {
          mediaRecorder.pause();
        }}
      />{" "}
      <button
        onClick={() => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            sr.stop();
          }
        }}
      >
        stop
      </button>
      {console.log(audioUrl)}
      {audioUrl.length > 1 && <audio src={audioUrl} controls />}
    </div>
  );
}
