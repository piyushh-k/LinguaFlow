import { useState } from "react";
import Transcription from "./transcription";
import Translation from "./translation";

export default function Result({output}) {
  const [tab , setTab] = useState(true)
  return (
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5 p-4 text-center justify-center w-fit mx-auto max-w-full">
      <h1 className="font-black text-4xl sm:text-5xl md:text-6xl">
        Your<span className="text-pink-700 "> Transcription </span>
      </h1>
      <div className="flex items-center gap-2 mx-auto bg-white rounded-full overflow-hidden text-2xl">
        <button className={`px-4 py-1 font-semibold duration-300 ${tab ? "bg-pink-400 text-white" : "text-pink-400"}`} onClick={() => setTab(!tab)
        } disabled={tab}>Transcription</button>
        <button className={`px-4 py-1 font-semibold duration-300 ${tab ? " text-pink-400" : "bg-pink-400 text-white"}`} onClick={() => setTab(!tab)} disabled={!tab}>Translation</button>
      </div>
      {tab ? <Transcription result={output}/> : <Translation />}
    </main>
  );
}
