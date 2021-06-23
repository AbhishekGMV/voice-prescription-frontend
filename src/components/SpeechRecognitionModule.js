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
      medName.length > 1 &&
      frequency.length > 1 &&
      quantity.length > 1 &&
      duration.length > 1 &&
      medicineTiming.length > 1
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

  const formatData = (rawData) => {
    let formattedData = "";
    rawData.split(" ").map((word) => {
      let parsedWord = parseInt(wordsToNumbers(word.toLowerCase()));
      if (isNaN(parsedWord)) {
        formattedData += word + " ";
      } else {
        formattedData += parsedWord + " ";
      }
    });
    return formattedData;
  }

  const formatFrequency = (frequency) => {
    let frequencyArr = {"morning":0,"afternoon":0,"night":0}
    frequency.split(" ").map(word=>{
      word = word.toLowerCase();
      word = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");  //removing punctuations
      word = word.replace(/\s{2,}/g," ")  //removing 2 or more spaces if any
      if(word in frequencyArr){
        frequencyArr[word] = 1
      }
  })
  let formattedData = Object.values(frequencyArr).join("-");
  return formattedData
}

  return (
    <div>
      <div className="row-input">
        <div>
          {!props.diagnosis ? (
            <>
              <label>Diagnosis: </label>
              <input
              placeholder= "Ex: Fever"
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
          <label>Medicine:</label>
          <input
              placeholder= "Ex: paracetamol"
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
            <label>Frequency:</label>
            <input
              placeholder= "MN-AF-NT"
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
                let formattedFrequency = formatFrequency(transcript);
                setFrequency(formattedFrequency);
              }}
            />
            {listening.frequency && <span>Listening...</span>}
          </div>

          {frequency && frequency.length ? (
            <div style={{ display: "flex" }}>
              <label>AF/BF: </label>
              <input
              placeholder= "Ex: Before food"
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
          <label>Duration:</label>
          <input
            placeholder= "'X' day(s)"
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
              let formattedDuration = formatData(transcript);
              setDuration(formattedDuration);
            }}
          />
          {listening.duration && <span>Listening...</span>}
        </div>
        <div>
          <label>Quantity: </label>
          <input
            placeholder= "dosage"
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
              let formattedQuantity = formatData(transcript);;
              setQuantity(formattedQuantity);
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
            <label>Advice:</label>
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
