import { useState, useEffect, useRef } from "react";
import {ScaleLoader} from 'react-spinners'
export default function Homepage({ setFile, setAudio}) {
    const [isRecording , setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [voiceDuration, setVoiceDuration] = useState(0);
    const mediaRecorder = useRef(null);

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

        const media = new MediaRecorder(stream, { type: 'audio/webm' })
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
            const newBlob = new Blob(audioChunks, { type: 'audio/webm' })
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
    <main className="min-h-screen flex items-center justify-center ">
      <div className="bg-pink-50 rounded-3xl p-8 sm:p-12 max-w-xl w-full mx-4 border border-pink-100">
        <h1 className="font-pacifico text-5xl sm:text-6xl md:text-7xl mb-2 tracking-tight drop-shadow-lg">
          Lingua<span className="text-pink-700 animate-gradient">Flow</span>
        </h1>
        <h3 className="font-medium text-xl md:text-lg mb-6 text-gray-700">
          Record
          <span className="text-pink-700 mx-2">
            <i className="fa-solid fa-circle-arrow-right animate-bounce"></i>
          </span>
          Transcribe
          <span className="text-pink-700 mx-2">
            <i className="fa-solid fa-circle-arrow-right animate-bounce"></i>
          </span>
          Translate
        </h3>
        <button className={`specialBtn flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full px-5 py-3 rounded-xl shadow-lg transition-all duration-200 border-2 border-pink-200 hover:bg-pink-50 active:scale-95 ${isRecording ? 'ring-2 ring-red-300' : ''}`} onClick={isRecording ? stopRecording : startRecording}>
          <p>{isRecording ? `Stop` : `Record`}</p>
          <div className="flex items-center gap-2">
            {voiceDuration !== 0 && <p className="text-sm">{voiceDuration}s</p>} {" "}
          </div>
          <i
            className={`fa-solid fa-microphone duration-200 text-xl ${isRecording ? "text-red-500 animate-pulse" : "text-gray-500"}`}
          />
        </button>
        <div className="my-6">
          <p className="text-lg text-gray-600">Or</p>
          <label className="block border-2 border-dashed border-pink-300 rounded-xl px-6 py-4 mt-2 text-pink-400 cursor-pointer hover:text-pink-600 hover:bg-pink-50 hover:border-pink-500 transition-all duration-300">
            <span className="font-semibold">Upload</span>
            <input
              className="hidden"
              type="file"
              accept=".mp3,.wav"
              onChange={(e) => {
                const temp = e.target.files[0];
                setFile(temp);
              }}
            />
            <span className="ml-2 text-gray-400 text-sm">a mp3 file</span>
          </label>
        </div>
      </div>
    </main>
  );
}
