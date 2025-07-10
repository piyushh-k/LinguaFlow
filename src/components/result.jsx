import { useState, useRef, useEffect } from "react";
import Transcription from "./transcription";
import Translation from "./translation";

export default function Result({ output }) {
  const [tab, setTab] = useState(true);
  const [translation, setTranslation] = useState(null);
  const [lang, setLang] = useState("select language");
  const [loading, setLoading] = useState(false); // should be boolean
  const worker = useRef();

  const download = () => {
    const data = output.map((val) => val.text).join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const fileURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = `LinguaFlow_${Date.now()}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const copy = () => {
    navigator.clipboard
      .writeText(output.map((val) => val.text).join("\n"))
      .then(() => {
        console.log("Text copied ✅");
        alert("Text copied ✅");
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        alert("Failed to copy text");
      });
  };

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../workers/translator.js", import.meta.url),
        { type: "module" }
      );
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "initiate":
          console.log("DOWNLOADING");
          break;
        case "progress":
          console.log("LOADING");
          break;
        case "update":
          setTranslation(e.data.output);
          console.log(e.data.output);
          break;
        case "complete":
          setLoading(false); 
          console.log("DONE");
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  }, []);

  const generateTranslation = () => {
    if (loading || lang === "select language") return;
    setLoading(true);
    worker.current.postMessage({
      text: output.map((val) => val.text).join("\n"),
      src_lang: "eng_Latn",
      tgt_lang: lang,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5 p-4 text-center justify-center w-fit mx-auto max-w-full">
      <h1 className="font-black text-4xl sm:text-5xl md:text-6xl">
        Your<span className="text-pink-700"> Transcription </span>
      </h1>

      <div className="flex items-center gap-2 mx-auto bg-white rounded-full overflow-hidden text-2xl">
        <button
          className={`px-4 py-1 font-semibold duration-300 ${
            tab ? "bg-pink-400 text-white" : "text-pink-400"
          }`}
          onClick={() => setTab(true)}
          disabled={tab}
        >
          Transcription
        </button>
        <button
          className={`px-4 py-1 font-semibold duration-300 ${
            !tab ? "bg-pink-400 text-white" : "text-pink-400"
          }`}
          onClick={() => setTab(false)}
          disabled={!tab}
        >
          Translation
        </button>
      </div>

      {tab ? (
        <Transcription result={output} />
      ) : (
        <Translation
          translation={translation}
          lang={lang}
          text={output.map((val) => val.text).join("\n")}
          loading={loading}
          setLang={setLang}
          setLoading={setLoading}
          setTranslation={setTranslation}
          generateTranslation={generateTranslation}
        />
      )}

      <div className="flex-row items-center gap-4 text-3xl space-x-6 text-pink-600 ">
        <button
          className="specialBtn p-2 rounded-lg hover:cursor-pointer"
          onClick={copy}
        >
          <i className="fa-solid fa-copy"></i>
        </button>
        <button
          className="specialBtn p-2 rounded-lg hover:cursor-pointer"
          onClick={download}
        >
          <i className="fa-solid fa-download"></i>
        </button>
        <a href="/" className="specialBtn p-2 rounded-lg hover:cursor-pointer">
          <i className="fa-solid fa-house"></i>
        </a>
      </div>
    </main>
  );
}
