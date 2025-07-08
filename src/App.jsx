import Homepage from "./components/homepage";
import Header from "./components/header";
import Display from "./components/display";
import Result from "./components/result";
import Loader from "./components/loader";
import { useState, useEffect, useRef } from "react";
import { MessageTypes } from "./presets";

function App() {
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [finished, setFinished] = useState(false);

  function handleResetAudio() {
    setFile(null);
    setAudio(null);
  }

  const worker = useRef(null);


  async function readAudio(file) {
    const audioCTX = new AudioContext({ sampleRate: 16000 });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  }

  async function handleSubmit() {
    if (!file && !audio) return;

    let voice = await readAudio(file ? file : audio);
    const model_name = "openAI/whisper-tiny.en";

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
    });
  }

  const isAudioPresent = file || audio;

  return (
    <div className="flex flex-col max-w-[1000] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
       {(() => {
  if (output) {
    return <Result />;
  }

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (isAudioPresent) {
    return <Display file={file} audio={audio} reset={handleResetAudio} />;
  }

  return <Homepage setFile={setFile} setAudio={setAudio} />;
})()}
      </section>

      <footer></footer>
    </div>
  );
}

export default App;
