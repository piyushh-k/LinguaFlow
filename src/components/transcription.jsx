export default function Transcription({result}) {
  let transcription;
  if(!result){
    transcription = '';
  } else{
    transcription = result[0].text
  }
  return <div>{transcription}</div>;
}
