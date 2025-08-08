const db = require('../config/db');

const uploadVideoFile = (req, res) => {
  const { title, description, category } = req.body;

  // Validate files
  if (
    !req.files ||
    !req.files.video ||
    !req.files.thumbnail ||
    req.files.video.length === 0 ||
    req.files.thumbnail.length === 0
  ) {
    return res.status(400).json({ error: 'Video or thumbnail not uploaded' });
  }

  const videoFiles = req.files.video;
  const thumbnailPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;

  // Check if it's a series (more than one video file)
  const isSeries = videoFiles.length > 1;

  if (isSeries) {
    // Handle multiple videos for series
    const values = videoFiles.map((file) => [
      title,
      description,
      thumbnailPath,
      `/uploads/videos/${file.filename}`,
      category
    ]);

    const sql = `
      INSERT INTO videos (title, description, thumbnail_url, video_url, category)
      VALUES ?
    `;

    db.query(sql, [values], (err) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error during series upload.' });
      }
      res.status(201).json({ message: 'Series videos uploaded successfully.' });
    });
  } else {
    // Handle single video
    const videoPath = `/uploads/videos/${videoFiles[0].filename}`;

    const sql = `
      INSERT INTO videos (title, description, thumbnail_url, video_url, category)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [title, description, thumbnailPath, videoPath, category],
      (err) => {
        if (err) {
          console.error('DB Error:', err);
          return res.status(500).json({ error: 'Database error during single video upload.' });
        }
        res.status(201).json({ message: 'Single video uploaded successfully.' });
      }
    );
  }
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

const updateVideoById = (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  let thumbnailUrl = null;
  let videoUrl = null;

  // If new files are uploaded
  if (req.files) {
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }
    if (req.files.video && req.files.video[0]) {
      videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }
  }

  // Build dynamic SQL + values
  let sql = `UPDATE videos SET title = ?, description = ?, category = ?`;
  const values = [title, description, category];

  if (thumbnailUrl) {
    sql += `, thumbnail_url = ?`;
    values.push(thumbnailUrl);
  }

  if (videoUrl) {
    sql += `, video_url = ?`;
    values.push(videoUrl);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to update video" });
    }

    res.json({ message: "Video updated successfully" });
  });
};



// ✅ VERY IMPORTANT
module.exports = {
    uploadVideoFile,
    getAllVideos,
    getVideoById,
    updateVideoById
};
