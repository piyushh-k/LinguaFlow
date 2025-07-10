import Homepage from "./components/homepage";
import Header from "./components/header";
import Display from "./components/display";
import Result from "./components/result";
import Loader from "./components/loader";
import { useState, useEffect, useRef } from "react";
import { MessageTypes } from "./presets.js";
import { pipeline } from "@huggingface/transformers";

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


  const whisperRef = useRef(null)

  useEffect(() => {
    if (!whisperRef.current) {
      whisperRef.current = new Worker(new URL('./workers/whisper.js', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('DOWNLOADING')
          break;
        case 'LOADING':
          setLoading(true)
          console.log('LOADING')
          break;
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results)
          break;
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log("DONE")
          break;
      }
    }

    whisperRef.current.addEventListener('message', onMessageReceived)

    return () => whisperRef.current.removeEventListener('message', onMessageReceived)
  })

async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const voice = decoded.getChannelData(0)
    return voice
  }

  async function handleFormSubmission() {

    console.log(1)
    if (!file && !audio) { return }
    console.log(2)
    let finalAudio = await readAudioFrom(file ? file : audio)
    const model_name = `openai/whisper-tiny.en`
    whisperRef.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio : finalAudio,
      model_name
    })
    console.log(3)
  }

  

  const isAudioPresent = file || audio;

  return (
    <div className="flex flex-col max-w-[1000] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {(() => {
          if (output) {
            return <Result output={output}/>;
          }

          if (loading) {
            return <Loader isLoading={loading} />;
          }

          if (isAudioPresent) {
            return (
              <Display
                file={file}
                audio={audio}
                reset={handleResetAudio}
                handleTranscribe={handleFormSubmission}
              />
            );
          }

          return <Homepage setFile={setFile} setAudio={setAudio} />;
        })()}
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
