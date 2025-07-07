// 👉 Bring in required packages
import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";

dotenv.config();

const app = express();

app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file

    const formData = new FormData()
    formData.append('file', fs.createReadStream(file.path))
    formData.append('model', 'whisper-1')

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    )

    fs.unlinkSync(file.path)
    res.json({ text: response.data.text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Transcription failed' })
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
