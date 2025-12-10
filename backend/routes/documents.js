const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9) + path.extname(file.originalname);
    cb(null, unique);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

// POST /upload
router.post('/upload', (req, res) => {
  const single = upload.single('file');
  single(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    try {
      const doc = new Document({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filepath: req.file.path,
        filesize: req.file.size
      });
      const saved = await doc.save();
      res.json({ message: 'File uploaded', document: saved });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'DB error' });
    }
  });
});

// GET / - list
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 }).select('-__v');
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /:id/download
router.get('/:id/download', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.download(path.resolve(doc.filepath), doc.originalName, (err) => {
      if (err) console.error('Download error', err);
    });
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    // delete file
    fs.unlink(doc.filepath, async (fsErr) => {
      if (fsErr) console.warn('File delete warning:', fsErr.message);
      await Document.deleteOne({ _id: doc._id });
      res.json({ message: 'Document deleted' });
    });
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
