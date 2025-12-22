const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
// const db = require('./config/db');
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

const moduleRoutes = require("./routes/moduleRoutes");

const seriesRoutes = require('./routes/seriesRoutes');

const ticketRoutes = require("./routes/ticketRoutes");

const couponRoutes = require("./routes/couponRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const parentDashboardRoutes = require("./routes/parentDashboardRoutes");

const parentChildrenRoutes = require("./routes/parentChildrenRoutes");

const childActivityRoutes = require("./routes/childActivityRoutes");


dotenv.config();
initDB();
const app = express();

app.set("trust proxy", 1);

app.use((req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const proto = req.headers["x-forwarded-proto"];
  if (isProd && proto && proto !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});



// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);

// app.use('/api', authRoutes);

// app.use('/api/parent', parentRoutes);

// app.use('/api/admin', adminRoutes);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/videos', videoRoutes);

// app.use('/api/books', bookRoutes);

// app.use('/api/blogs', blogRoutes);

// app.use('/api/subscriptions', subscriptionRoutes);

// app.use('/api/quizzes', quizRoutes);

// app.use('/api/assignments', assignmentsRoutes);

// app.use("/api/Category", categoryRoutes);

// app.use('/api', userRoutes);

// app.use('/api/child-requests', childRequestsRoutes);

// app.use('/api/child', childRoutes);

// app.use('/api/quiz-submissions', quizSubmissionRoutes);

// app.use('/api/assignment-submissions', assignmentSubmissionRoutes);

// app.use("/api/modules", moduleRoutes);

// app.use('/uploads', express.static('uploads'));

// // app.use('/api', adminRoutes);

// app.use("/api/videos", videoRoutes);

// // app.use("/api", videoRoutes);

// app.use('/api/series', seriesRoutes);

// app.use("/api/tickets", ticketRoutes);

// app.use("/api/coupons", couponRoutes);

// app.use("/api/dashboard", dashboardRoutes);

// app.use("/api/parent-dashboard", parentDashboardRoutes);

// app.use("/api/parent-dashboard", parentDashboardRoutes);

// app.use("/api/parent", parentChildrenRoutes);

// app.use("/api/children", parentChildrenRoutes);

// app.use("/api/activity", childActivityRoutes);

// app.use("/stripe", require("./routes/stripeWebhook"));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/videos", videoRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/category", categoryRoutes);   // ✅ keep lowercase consistent

app.use("/api/users", userRoutes);          // ✅ avoid mounting user routes on "/api" directly
app.use("/api/child-requests", childRequestsRoutes);
app.use("/api/child", childRoutes);

app.use("/api/quiz-submissions", quizSubmissionRoutes);
app.use("/api/assignment-submissions", assignmentSubmissionRoutes);

app.use("/api/modules", moduleRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/parent-dashboard", parentDashboardRoutes);
app.use("/api/children", parentChildrenRoutes);

app.use("/api/activity", childActivityRoutes);

app.use("/stripe", require("./routes/stripeWebhook"));




// Test route
app.get('/', (req, res) => {
  res.send('Explore Islam API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require('express');

// const cors = require('cors');

// const dotenv = require('dotenv');

// const bodyParser = require('body-parser');

// const path = require('path');

// const initDB = require('./config/initDB');



// // Load environment variables

// dotenv.config();



// // Initialize DB

// initDB();



// const app = express();



// // ✅ Trust proxy for detecting HTTPS behind Nginx

// app.set('trust proxy', 1);



// // ✅ Force HTTPS only in production

// app.use((req, res, next) => {

//   if (process.env.NODE_ENV === 'production' && !req.secure) {

//     return res.redirect('https://' + req.headers.host + req.url);

//   }

//   next();

// });



// // Middleware

// app.use(cors());

// app.use(bodyParser.json());



// // Routes

// app.use('/api/auth', require('./routes/authRoutes'));

// app.use('/api/parent', require('./routes/parentRoutes'));

// app.use('/api/admin', require('./routes/adminRoutes'));

// app.use('/api/videos', require('./routes/videoRoutes'));

// app.use('/api/books', require('./routes/bookRoutes'));

// app.use('/api/blogs', require('./routes/blogRoutes'));

// app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// app.use('/api/quizzes', require('./routes/quizRoutes'));

// app.use('/api/assignments', require('./routes/assignmentsRoutes'));

// app.use('/api/Category', require('./routes/categoryRoutes'));

// app.use('/api/child-requests', require('./routes/childRequestRoutes'));

// app.use('/api/child', require('./routes/childRoutes'));

// app.use('/api/quiz-submissions', require('./routes/quizSubmissionRoutes'));

// app.use('/api/assignment-submissions', require('./routes/assignmentSubmissionRoutes'));

// app.use('/api/modules', require('./routes/moduleRoutes'));

// app.use('/api/series', require('./routes/seriesRoutes'));

// app.use('/api/tickets', require('./routes/ticketRoutes'));

// app.use('/api/coupons', require('./routes/couponRoutes'));

// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// app.use('/api/parent-dashboard', require('./routes/parentDashboardRoutes'));

// app.use('/api/parent', require('./routes/parentChildrenRoutes'));

// app.use('/api/children', require('./routes/parentChildrenRoutes'));

// app.use('/api/activity', require('./routes/childActivityRoutes'));

// app.use('/stripe', require('./routes/stripeWebhook'));



// // Static uploads

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// // Test route

// app.get('/', (req, res) => {

//   res.send('Explore Islam API is running...');

// });



// // Start server

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {

//   console.log(`Server running on port ${PORT} | NODE_ENV=${process.env.NODE_ENV}`);

// });