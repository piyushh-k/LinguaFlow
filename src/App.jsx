import Homepage from "./components/homepage";
import Header from "./components/header";
import FileDisplay from "./components/filedisplay";
import Result from "./components/result";
import Loader from "./components/loader";
import { useState, useEffect } from "react";



function App() {
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleResetAudio() {
    setFile(null);
    setAudio(null);
  }



  const isAudioPresent = file || audio;

  return (
    <div className="flex flex-col max-w-[1000] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? <Result /> : 
        loading ? <Loader isLoading = {loading}/> : 
        isAudioPresent ? <FileDisplay file={file} audio={audio} onClick={sendBlob} reset={handleResetAudio} /> :  <Homepage setFile={setFile} setAudio={setAudio} />
        }
      </section>

      <footer></footer>
    </div>
  );
}

export default App;
