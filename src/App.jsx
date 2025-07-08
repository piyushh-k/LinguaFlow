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
