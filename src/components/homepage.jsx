import { useState, useEffect, useRef } from "react";

export default function Homepage({ setFile, setAudio }) {
    const [isRecording , setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [voiceDuration, setVoiceDuration] = useState(0);

    const mediaRecorder = useRef(null);
    const mimeType = 'audio/webm';

    async function startRecording() {
        let stream;
        console.log('Start recording');

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
        } catch (err) {
            console.log(err.message)
            return
        }
        setIsRecording(true)

        const media = new MediaRecorder(stream, { type: mimeType })
        mediaRecorder.current = media

        mediaRecorder.current.start()
        let Chunks = []
        mediaRecorder.current.ondataavailable = (e) => {
            if (typeof e.data === 'undefined') return;
            if (e.data.size === 0) return;
            Chunks.push(e.data);
        }
        setAudioChunks(Chunks);
    }

    async function stopRecording() {
        setIsRecording(false)
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const newBlob = new Blob(audioChunks, { type: mimeType })
            setAudio(newBlob)
            setAudioChunks([])
            setVoiceDuration(0)
        }
    }

    useEffect(() => {
        if (isRecording === false) return

        const interval = setInterval(() => {
            setVoiceDuration(v => v + 1);
        }, 1000)

        return () => clearInterval(interval)
    },[isRecording])

  return (
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5 p-4 text-center justify-center">
      <h1 className="font-black text-5xl sm:text-6xl md:text-7xl">
        Lingua<span className="text-pink-700 ">Flow</span>
      </h1>
      <h3 className="font-medium text-2xl md:text-lg ">
        Record
        <span className="text-pink-700">
          <i className="fa-solid fa-circle-arrow-right"></i>
        </span>
        Transcribe
        <span className="text-pink-700">
          <i className="fa-solid fa-circle-arrow-right"></i>
        </span>
        Translate
      </h3>
      <button className="specialBtn flex item-center text-base justify-between gap-4 mx-auto w-72 max-w-full px-5 py-3 rounded-xl" onClick={isRecording ? stopRecording : startRecording}>
        <p>{isRecording ? `Stop` : `Record`}</p>
        <div className="flex items-center gap-2">
          {voiceDuration !== 0 && <p className="text-sm">{voiceDuration}s</p>}{" "} 
        </div> 
        <i
          className={`fa-solid fa-microphone duration-200 ${
            isRecording ? "text-red-500" : ""
          }`}
        />
      </button>
      <p className="text-2xl">
        Or{" "}
        <label className="text-pink-400  cursor-pointer hover:text-pink-600 hover:underline duration-300">
          Upload{" "}
          <input
            className="hidden"
            type="file"
            accept=".mp3 , .wave "
            onChange={(e) => {
              const temp = e.target.files[0];
              setFile(temp);
            }}
          />
        </label>
        a mp3 file
      </p>
    </main>
  );
}
