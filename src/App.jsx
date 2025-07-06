import Homepage from "./components/homepage";
import Header from "./components/header";
import FileDisplay from "./components/filedisplay";
import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const isAudioPresent = file || audio;

  function handleResetAudio() {
    setFile(null);
    setAudio(null);
  }

  return (
    <div className="flex flex-col max-w-[1000] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {isAudioPresent ? (
          <FileDisplay file={file} audio={audio} reset={handleResetAudio} />
        ) : (
          <Homepage setFile={setFile} setAudio={setAudio} />
        )}
      </section>
      <h1>hello</h1>
      <footer></footer>
    </div>
  );
}

export default App;
