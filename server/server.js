const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config/db');
const initDB = require('./config/initDB');
const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');
const quizRoutes = require('./routes/quizRoutes');

const bookRoutes = require('./routes/bookRoutes');
const blogRoutes = require('./routes/blogRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const categoryRoutes = require('./routes/categoryRoutes');
const assignmentsRoutes = require('./routes/assignmentsRoutes');

const userRoutes = require('./routes/userRoutes');
const childRequestsRoutes = require('./routes/childRequestRoutes');
const childRoutes = require('./routes/childRoutes');

const quizSubmissionRoutes = require('./routes/quizSubmissionRoutes');
const assignmentSubmissionRoutes = require('./routes/assignmentSubmissionRoutes');


initDB();
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);

app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videoRoutes);

// app.use('/uploads', express.static('uploads'));


app.use('/api/books', bookRoutes);

app.use('/api/blogs', blogRoutes);

app.use('/api/subscriptions', subscriptionRoutes);

app.use('/api/quizzes', quizRoutes);

app.use('/api/assignments', assignmentsRoutes);

app.use("/api/Category", categoryRoutes);

app.use('/api', userRoutes);

app.use('/api/child-requests', childRequestsRoutes);

app.use('/api/child', childRoutes);

app.use('/api/quiz-submissions', quizSubmissionRoutes);
app.use('/api/assignment-submissions', assignmentSubmissionRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Explore Islam API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
