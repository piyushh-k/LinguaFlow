export default function FileDisplay({ reset, file, audio }) {
  return (
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5 p-4 text-center justify-center w-fit mx-auto max-w-full">
      <h1 className="font-black text-4xl sm:text-5xl md:text-6xl">
        Your<span className="text-pink-700 "> File</span>
      </h1>
      <div className="flex item-center gap-2 mx-auto  flex-col text-left my-7">
        <h3 className="font-extrabold">Name</h3>
        <p>{file.name}</p>
      </div>
      <div className="flex items-center justify-evenly gap-4">
        <button
          className="text-slate-400 hover:text-gray-900 duration-200"
          onClick={reset}
        >
          Reset
        </button>
        <button className="specialBtn px-4 py-3 rounded-2xl text-pink-500 hover:text-pink-800 duration-150">
          Transcribe
        </button>
      </div>
    </main>
  );
}
