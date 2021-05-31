import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "react-bootstrap";

export default function SpeechRecognitionModule() {
  const commands = [
    {
      command: "I would like to order *",
      callback: (food) => alert(`Your order is for: ${food}`),
      matchInterim: true,
    },
    {
      command: "The weather is :condition today",
      callback: (condition) => alert(`Today, the weather is ${condition}`),
      matchInterim: true,
    },
    {
      command: "My top sports are * and *",
      callback: (sport1, sport2) => alert(`#1: ${sport1}, #2: ${sport2}`),
      matchInterim: true,
    },
    {
      command: "Pass the salt (please)",
      callback: () => alert("My pleasure"),
      matchInterim: true,
    },
    {
      command: ["Hello", "Hi"],
      callback: ({ command }) => alert(`Hi there! You said: "${command}"`),
      matchInterim: true,
    },
    {
      command: ["Clear."],
      callback: ({ resetTranscript }) => {
        console.log("loading...");
        resetTranscript();
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
      <Button
        onClick={() =>
          SpeechRecognition.startListening({
            continuous: true,
            language: "en-IN",
          })
        }
      >
        Start
      </Button>
      <Button onClick={SpeechRecognition.stopListening}>Stop</Button>
      <Button onClick={resetTranscript}>Reset</Button>
      <p>{transcript}</p>
    </div>
  );
}
