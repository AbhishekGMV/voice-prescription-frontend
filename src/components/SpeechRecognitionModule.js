import { React, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { Card } from "react-bootstrap";
import wordsToNumbers from "words-to-numbers";
import { Button } from "react-bootstrap";
import "./../styles/prescription-page.css";

export default function SpeechRecognitionModule(props) {
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [quantity, setQuantity] = useState("");
  const [duration, setDuration] = useState(""); // DURATION
  const [medicineTiming, setMedicineTiming] = useState(""); // AF/BF
  const [advice, setAdvice] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [toggleAdvice, setToggleAdvice] = useState("");
  const [btnClass, setBtnClass] = useState("primary");

  const [listening, setListening] = useState({
    medicine: false,
    frequency: false,
    quantity: false,
    duration: false,
    medicineTiming: false,
    advice: false,
    diagnosis: false,
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
    if (
      medName.length &&
      frequency.length &&
      quantity.length &&
      duration.length &&
      medicineTiming.length
    ) {
      props.addRowData(medName, frequency, medicineTiming, duration, quantity);
      setMedName("");
      setFrequency("");
      setMedicineTiming("");
      setDuration("");
      setQuantity("");
    }
    if (advice.length) {
      props.addAdvice(advice);
      setAdvice("");
    }
    if (diagnosis.length) {
      props.addDiagnosis(diagnosis);
      setDiagnosis("");
    }
  }, [
    medName,
    frequency,
    medicineTiming,
    diagnosis,
    duration,
    advice,
    quantity,
    props,
  ]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return alert("Browser not supported!");
  }

  return (
    <div>
      <div className="row-input">
        <div>
          {!props.diagnosis ? (
            <>
              <label>Diagnosis: </label>
              <input
                value={diagnosis}
                onChange={() => setDiagnosis(transcript)}
                onMouseEnter={() => {
                  setListening({ ...listening, diagnosis: true });
                  resetTranscript();
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "en-IN",
                  });
                }}
                onMouseLeave={() => {
                  setListening({ ...listening, diagnosis: false });
                  SpeechRecognition.stopListening();
                  setDiagnosis(transcript);
                }}
              />
            </>
          ) : (
            ""
          )}
          {listening.diagnosis && <span>Listening...</span>}
        </div>
        <div>
          Medicine:{" "}
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
        <span style={{ display: "flex" }}>
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

          {frequency.length ? (
            <div style={{ display: "flex" }}>
              <label>AF/BF: </label>
              <input
                value={medicineTiming}
                onChange={() => {
                  setMedicineTiming(transcript);
                }}
                onMouseEnter={() => {
                  setListening({ ...listening, medicineTiming: true });
                  resetTranscript();
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "en-IN",
                  });
                }}
                onMouseLeave={() => {
                  setListening({ ...listening, medicineTiming: false });
                  SpeechRecognition.stopListening();
                  setMedicineTiming(transcript);
                }}
              />
              {listening.medicineTiming && <span>Listening...</span>}
            </div>
          ) : (
            ""
          )}
        </span>

        <div>
          Duration:{" "}
          <input
            value={duration}
            onChange={() => setDuration(transcript)}
            onMouseEnter={() => {
              setListening({ ...listening, duration: true });
              resetTranscript();
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
              });
            }}
            onMouseLeave={() => {
              setListening({ ...listening, duration: false });
              SpeechRecognition.stopListening();
              setDuration(transcript);
            }}
          />
          {listening.duration && <span>Listening...</span>}
        </div>
        <div>
          Quantity:{" "}
          <input
            onChange={() => {
              setQuantity(transcript);
            }}
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
              let tempQuantity = "";
              transcript.split(" ").map((word) => {
                let parsedWord = parseInt(wordsToNumbers(word.toLowerCase()));
                if (isNaN(parsedWord)) {
                  tempQuantity += word + " ";
                } else {
                  tempQuantity += parsedWord + " ";
                }
              });
              setQuantity(tempQuantity);
            }}
          />
          {listening.quantity && <span>Listening...</span>}
        </div>
        <Button
          variant={btnClass}
          onClick={() => {
            setBtnClass("danger");
            setToggleAdvice(!toggleAdvice);
            setAdvice("");
            if (toggleAdvice) {
              setBtnClass("primary");
              props.addAdvice(""); //Removing advice
            }
          }}
        >
          {toggleAdvice ? "Remove advice" : "Add advice"}
        </Button>
        {toggleAdvice && (
          <div>
            Advice:{" "}
            <input
              onChange={() => setAdvice(transcript)}
              value={advice}
              onMouseEnter={() => {
                setListening({ ...listening, advice: true });
                resetTranscript();
                SpeechRecognition.startListening({
                  continuous: true,
                  language: "en-IN",
                });
              }}
              onMouseLeave={() => {
                setListening({ ...listening, advice: false });
                SpeechRecognition.stopListening();
                setAdvice(transcript);
              }}
            />
            {listening.advice && <span>Listening...</span>}
          </div>
        )}
      </div>
      <p>{transcript}</p>
    </div>
  );
}
