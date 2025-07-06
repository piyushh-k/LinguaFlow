export default function Homepage({setFile , setAudio}) {
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
      <button className="specialBtn flex item-center text-base justify-between gap-4 mx-auto w-72 max-w-full px-5 py-3 rounded-xl">
        <p >Record</p>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-2xl">
        Or{" "}
        <label className="text-pink-400  cursor-pointer hover:text-pink-600 hover:underline duration-300">
          Upload <input className="hidden" type="file" accept=".mp3 , .wave " onChange={(e) =>{
            const temp = e.target.files[0]
            setFile(temp)
          }}/>
        </label>
        a mp3 file
      </p>
    </main>
  );
}
