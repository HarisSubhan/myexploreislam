const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config/db');
const initDB = require('./config/initDB');
const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');

initDB();
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Explore Islam API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
