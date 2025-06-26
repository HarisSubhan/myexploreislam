const db = require('../config/db');

const uploadVideoFile = (req, res) => {
    const { title, description, category } = req.body;

    //   if (!req.files || !req.file || !req.files.thumbnail) {
    //     return res.status(400).json({ error: 'Video or thumbnail not uploaded' });
    //   }

    if (
        !req.files ||
        !req.files.video ||
        !req.files.thumbnail ||
        req.files.video.length === 0 ||
        req.files.thumbnail.length === 0
    ) {
        return res.status(400).json({ error: 'Video or thumbnail not uploaded' });
    }


    // const videoPath = `/uploads/videos/${req.file.filename}`;
    // const thumbnailPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;

    const videoPath = `/uploads/videos/${req.files.video[0].filename}`;
    const thumbnailPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;

    const sql = `
    INSERT INTO videos (title, description, thumbnail_url, video_url, category)
    VALUES (?, ?, ?, ?, ?)
  `;
    db.query(
        sql,
        [title, description, thumbnailPath, videoPath, category],
        (err) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            res.status(201).json({ message: 'Video uploaded successfully' });
        }
    );
};

const getAllVideos = (req, res) => {
  const sql = 'SELECT * FROM videos ORDER BY created_at DESC';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch videos' });
    res.json(results);
  });
};


const getVideoById = (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM videos WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch video' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(results[0]);
  });
};


// ✅ VERY IMPORTANT
module.exports = {
    uploadVideoFile,
    getAllVideos,
    getVideoById,
};
