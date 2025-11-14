const db = require('../config/db');

const logUserActivity = require("../utils/activityLogger");

const uploadVideoFile = (req, res) => {
  const { title, description, series_id, age } = req.body;

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

  const isSeries = !!series_id || videoFiles.length > 1;

  if (isSeries) {
    if (videoFiles.length > 1) {
      const values = videoFiles.map((file) => [
        title,
        description,
        age || null,
        thumbnailPath,
        series_id || null,
        `/uploads/videos/${file.filename}`
      ]);

      const sql = `
        INSERT INTO videos (title, description, age, thumbnail_url, series_id, video_url)
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
      const videoPath = `/uploads/videos/${videoFiles[0].filename}`;
      const sql = `
        INSERT INTO videos (title, description, age, thumbnail_url, series_id, video_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        sql,
        [title, description, age || null, thumbnailPath, series_id, videoPath],
        (err) => {
          if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Database error during series upload.' });
          }
          res.status(201).json({ message: 'Series video uploaded successfully.' });
        }
      );
    }

  } else {
    const videoPath = `/uploads/videos/${videoFiles[0].filename}`;
    const sql = `
      INSERT INTO videos (title, description, age, thumbnail_url, video_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [title, description, age || null, thumbnailPath, videoPath],
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


// Get all videos (latest first)
const getAllVideos = (req, res) => {
  const sql = `
    SELECT v.*, s.title AS series_title 
    FROM videos v
    LEFT JOIN series s ON v.series_id = s.id
    ORDER BY v.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch videos' });
    res.json(results);
  });
};

const getUnassignedVideos = (req, res) => {
  const sql = `
    SELECT v.* 
    FROM videos v
    WHERE v.series_id IS NULL
    ORDER BY v.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch unassigned videos" });
    res.json(results);
  });
};

// Get single video by ID
const getVideoById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT v.*, s.title AS series_title, s.description AS series_description
    FROM videos v
    LEFT JOIN series s ON v.series_id = s.id
    WHERE v.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch video' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(results[0]);
  });
};

// Update video
const updateVideoById = (req, res) => {
  const { id } = req.params;
  const { title, description, series_id } = req.body;

  let thumbnailUrl = null;
  let videoUrl = null;

  if (req.files) {
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }
    if (req.files.video && req.files.video[0]) {
      videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }
  }

  let sql = `UPDATE videos SET title = ?, description = ?, series_id = ?`;
  const values = [title, description, series_id || null];

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

  db.query(sql, values, (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to update video" });
    }

    res.json({ message: "Video updated successfully" });
  });
};

// Get videos by series_id
const getVideosBySeriesId = (req, res) => {
  const { seriesId } = req.params;

  const sql = `
    SELECT v.*, s.title AS series_title
    FROM videos v
    LEFT JOIN series s ON v.series_id = s.id
    WHERE v.series_id = ?
    ORDER BY v.created_at DESC
  `;

  db.query(sql, [seriesId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch videos by series" });
    res.json(results);
  });
};

const watchVideo = (req, res) => {
  const { child_id, video_id } = req.body;

  if (!child_id || !video_id) {
    return res.status(400).json({ message: "child_id and video_id are required" });
  }

  // ✅ Log activity
  logUserActivity(child_id, "Watched Video", { video_id }, "child");

  res.status(200).json({ message: "Video watch logged successfully" });
};


module.exports = {
  uploadVideoFile,
  getAllVideos,
  getVideoById,
  updateVideoById,
  getVideosBySeriesId,
  getUnassignedVideos,
  watchVideo
};
