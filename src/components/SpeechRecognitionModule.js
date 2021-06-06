import { React, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "react-bootstrap";
import "./../styles/prescription-page.css";

export default function SpeechRecognitionModule(props) {
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [quantity, setQuantity] = useState("");
  const [listening, setListening] = useState({
    medicine: false,
    frequency: false,
    quantity: false,
  });

  const commands = [
    {
      command: ["Clear."],
      callback: ({ resetTranscript }) => {
        resetTranscript();
      },
      matchInterim: true,
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (medName.length && frequency.length && quantity.length) {
      props.addRowData(medName, frequency, quantity);
      setMedName("");
      setFrequency("");
      setQuantity("");
    }
  }, [medName, frequency, quantity, props]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return alert("Browser not supported!");
  }

  return (
    <div>
      <div className="row-input">
        <div>
          med name:{" "}
          <input
            value={medName}
            onChange={() => setMedName(transcript)}
            onMouseEnter={() => {
              setListening({ ...listening, medicine: true });
              resetTranscript();
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
              });
            }}
            onMouseLeave={() => {
              setListening({ ...listening, medicine: false });
              SpeechRecognition.stopListening();
              setMedName(transcript);
            }}
          />
          {listening.medicine && <span>Listening...</span>}
        </div>
        <div>
          Frequency:{" "}
          <input
            value={frequency}
            onChange={() => setFrequency(transcript)}
            onMouseEnter={() => {
              setListening({ ...listening, frequency: true });
              resetTranscript();
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
              });
            }}
            onMouseLeave={() => {
              setListening({ ...listening, frequency: false });
              SpeechRecognition.stopListening();
              setFrequency(transcript);
            }}
          />
          {listening.frequency && <span>Listening...</span>}
        </div>
        <div>
          Quantity:{" "}
          <input
            onChange={() => setQuantity(transcript)}
            value={quantity}
            onMouseEnter={() => {
              setListening({ ...listening, quantity: true });
              resetTranscript();
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
              });
            }}
            onMouseLeave={() => {
              setListening({ ...listening, quantity: false });
              SpeechRecognition.stopListening();
              setQuantity(transcript);
            }}
          />
          {listening.quantity && <span>Listening...</span>}
        </div>
        <Button
          onClick={() => {
            setMedName("");
            setFrequency("");
            setQuantity("");
            props.addRowData(medName, frequency, quantity);
          }}
        >
          Add data
        </Button>
        <Button
          onClick={() => {
            SpeechRecognition.stopListening();
            resetTranscript();
          }}
        >
          Stop
        </Button>
      </div>
      <p>{transcript}</p>
    </div>
  );
}
