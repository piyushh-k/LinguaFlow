export default function Transcription({ result }) {
  let transcription;
  if (!result) {
    transcription = "";
  } else {
    transcription = result[0].text;
  }
  return (
    <div className="flex-row space-y-10">
      <p className="text-4xl">{transcription}</p>
    </div>
  );
}
