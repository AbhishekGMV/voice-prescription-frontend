import { React, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "react-bootstrap";

export default function SpeechRecognitionModule(props) {
  const [btnText, setBtnText] = useState("Start");
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [quantity, setQuantity] = useState("");

  const commands = [
    {
      command: ["Clear."],
      callback: ({ resetTranscript }) => {
        resetTranscript();
      },
      matchInterim: true,
    },
    {
      command: ["medicine."],
      callback: ({ resetTranscript }) => {
        props.setPrescriptionData("");
        resetTranscript();
        setBtnText("Listening...");
      },
      matchInterim: true,
    },
    {
      command: ["End."],
      callback: ({ resetTranscript }) => {
        props.setPrescriptionData(transcript);
        resetTranscript();
        SpeechRecognition.stopListening();
        setBtnText("Start");
      },
      matchInterim: true,
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }
  return (
    <div>
      <div>
        med name:{" "}
        <input
          value={medName}
          onChange={() => setMedName(transcript)}
          onMouseEnter={() => {
            resetTranscript();
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-IN",
            });
          }}
          onMouseLeave={() => {
            SpeechRecognition.stopListening();
            setMedName(transcript);
          }}
        />
      </div>
      <div>
        Frequency:{" "}
        <input
          value={frequency}
          onChange={() => setFrequency(transcript)}
          onMouseEnter={() => {
            resetTranscript();
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-IN",
            });
          }}
          onMouseLeave={() => {
            SpeechRecognition.stopListening();
            setFrequency(transcript);
          }}
        />
      </div>
      <div>
        Quantity:{" "}
        <input
          onChange={() => setQuantity(transcript)}
          value={quantity}
          onMouseEnter={() => {
            resetTranscript();
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-IN",
            });
          }}
          onMouseLeave={() => {
            SpeechRecognition.stopListening();
            setQuantity(transcript);
          }}
        />
        {console.log(JSON.stringify(props))}
        <Button onClick={() => props.addRowData(medName, frequency, quantity)}>
          Add data
        </Button>
      </div>
      <Button
        onClick={() => {
          SpeechRecognition.startListening({
            continuous: true,
            language: "en-IN",
          });
          setBtnText("Listening");
        }}
      >
        {btnText}
      </Button>
      <Button
        onClick={() => {
          setBtnText("Start");
          SpeechRecognition.stopListening();
        }}
      >
        Stop
      </Button>
      <Button onClick={resetTranscript}>Reset</Button>
      <p>{transcript}</p>
      <p>data: {props.data}</p>
    </div>
  );
}
