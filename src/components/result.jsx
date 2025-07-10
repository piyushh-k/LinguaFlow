import { useState } from "react";
import Transcription from "./transcription";
import Translation from "./translation";

export default function Result({ output }) {
  const download = () => {
    const data = `${output[0].text}`;
    const blob = new Blob([data], { type: "text/plain" });
    const fileURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = `$LinguaFlow_${Date.now()}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); //freeing up memory
  };

const copy = () => {
  navigator.clipboard
    .writeText(output[0].text)
    .then(() => {
      console.log(`copied: ${output[0].text}`);
      alert("text copied ✅");
    })
    .catch((err) => {
      console.log(`copy failed : ${err}`);
      alert("failed to copy text ");
    });
};


  const [tab, setTab] = useState(true);
  return (
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5 p-4 text-center justify-center w-fit mx-auto max-w-full">
      <h1 className="font-black text-4xl sm:text-5xl md:text-6xl">
        Your<span className="text-pink-700 "> Transcription </span>
      </h1>
      <div className="flex items-center gap-2 mx-auto bg-white rounded-full overflow-hidden text-2xl">
        <button
          className={`px-4 py-1 font-semibold duration-300 ${
            tab ? "bg-pink-400 text-white" : "text-pink-400"
          }`}
          onClick={() => setTab(!tab)}
          disabled={tab}
        >
          Transcription
        </button>
        <button
          className={`px-4 py-1 font-semibold duration-300 ${
            tab ? " text-pink-400" : "bg-pink-400 text-white"
          }`}
          onClick={() => setTab(!tab)}
          disabled={!tab}
        >
          Translation
        </button>
      </div>
      {tab ? <Transcription result={output} /> : <Translation />}
      <div className="flex-row items-center gap-4 text-3xl space-x-6 text-pink-600 ">
        <button className="specialBtn p-2 rounded-lg hover:cursor-pointer" onClick={copy}>
          <i className="fa-solid fa-copy"></i>
        </button>
        <button className="specialBtn p-2 rounded-lg hover:cursor-pointer" onClick={download}>
          <i className="fa-solid fa-download"></i>
        </button>
        <a href="/" className="specialBtn p-2 rounded-lg hover:cursor-pointer">
          <i className="fa-solid fa-house"></i>
        </a>
      </div>
    </main>
  );
}
