import { pipeline, env } from '@xenova/transformers'
import { MessageTypes } from '../presets.js' //will come in handy for translation part

env.allowLocalModels = false
env.useBrowserCache = false //temp cache disable to avoid bugs

class Whisper {
  static modelName = 'openai/whisper-tiny.en'
  static func = 'automatic-speech-recognition' 
  static instance = null // we’ll store the model here once it’s loaded

  static async getPipe(cb = null) {
    console.log(1) // pipe requested
    if (!this.instance) {
      console.log(2) // loading model
      this.instance = await pipeline(this.func, null, {
        progress_callback: cb, // callback to show loading progress
      })
    }
    console.log(3) // pipe ready
    return this.instance // return loaded pipeline
  }
}

// main thread communication
self.addEventListener('message', async (e) => {
  console.log(4) // got message from main thread
  const { type, audio } = e.data

  if (type === MessageTypes.INFERENCE_REQUEST) {
    console.log(5) // inference request received
    await runTranscribe(audio) // main func of transcription
  }
})

async function runTranscribe(aud) {
  console.log(6) // transcription started
  loadingMsg('loading') 

  let pipeline
  try {
    pipeline = await Whisper.getPipe(onModelLoading)
    console.log(7) // model loaded
  } catch (err) {
    console.log('err:', err.message)
  }

  loadingMsg('success') 
  console.log(8) // sending success msg to UI

  const transcriber = new ResultTracker(pipeline)

  await pipeline(aud, {
    top_k: 0,
    do_sample: false, 
    chunk_length: 30,
    stride_length_s: 5,
    return_timestamps: true,
    callback_function: transcriber.partialFn.bind(transcriber),
    chunk_callback: transcriber.chunkFn.bind(transcriber),
  })

  console.log(9) // transcription complete
  transcriber.done()
}

// loading progress messages
async function onModelLoading(d) {
  if (d.status === 'progress') {
    console.log(10) // loading progress
    sendProgress(d.file, d.progress, d.loaded, d.total)
  }
}

function loadingMsg(status) {
  console.log(11) // loading msg sent
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  })
}

function sendProgress(f, prog, loaded, total) {
  console.log(12) // downloading progress sent
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file: f,
    progress: prog,
    loaded,
    total,
  })
}

class ResultTracker {
  constructor(pipe) {
    this.pipe = pipe 
    this.stride = 5
    this.chunks = []
    this.doneChunks = [] 
    this.counter = 0 

    this.precision =
      pipe?.processor.feature_extractor.config.chunk_length /
      pipe.model.config.max_source_positions
    console.log(13) // tracker initialized
  }

  done() {
    console.log(14) // sending done
    self.postMessage({
      type: MessageTypes.INFERENCE_DONE,
    })
  }

  partialFn(beams) {
    this.counter++
    if (this.counter % 10 !== 0) return

    console.log(15) // partial result triggered

    const first = beams[0]
    const decoded = this.pipe.tokenizer.decode(first.output_token_ids, {
      skip_special_tokens: true,
    })

    const result = {
      text: decoded,
      start: this.getLastTime(),
      end: undefined,
    }

    sendPartial(result)
  }

  chunkFn(data) {
    console.log(16) // chunk callback called
    this.chunks.push(data)

    const [text, decoded] = this.pipe.tokenizer._decode_asr(this.chunks, {
      time_precision: this.precision,
      return_timestamps: true,
      force_full_sequence: false,
    })

    this.doneChunks = decoded.chunks.map((chunk, idx) =>
      this.formatChunk(chunk, idx)
    )

    console.log(17) // sending chunk result
    sendResults(this.doneChunks, false, this.getLastTime())
  }

  getLastTime() {
    if (this.doneChunks.length === 0) return 0
    console.log(18) // got last timestamp
  }

  formatChunk(chunk, idx) {
    const [start, end] = chunk.timestamp
    console.log(19) // formatting chunk
    return {
      index: idx,
      text: chunk.text.trim(),
      start: Math.round(start),
      end:
        Math.round(end) || Math.round(start + 0.9 * this.stride),
    }
  }
}

function sendResults(res, done, timestamp) {
  console.log(20) // final results sent
  self.postMessage({
    type: MessageTypes.RESULT,
    results: res,
    isDone: done,
    completedUntilTimestamp: timestamp,
  })
}

function sendPartial(res) {
  console.log(21) // partial results sent
  self.postMessage({
    type: MessageTypes.RESULT_PARTIAL,
    result: res,
  })
}
