const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Set up file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to upload an audio file and transcribe it
app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No audio file uploaded.");
  }

  // Path to the uploaded file
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  // Run the Whisper Python script using the uploaded file
  exec(`python whisper.py ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send("Error during transcription.");
    }

    if (stderr) {
      return res.status(500).send(stderr);
    }

    // Send the transcription result back to the client
    res.json({ transcription: stdout });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
