const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const resetExpiredSecretKeys = require('./models/resetExpiredSecretKeys');
const syncDatabase = require('./models/syncDatabase');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  // methods: 'GET,POST,PUT,DELETE',  
  credentials: true,               
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false, 
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

resetExpiredSecretKeys();
setInterval(syncDatabase, 1 * 60 * 1000 * 60); // Sync database every 1 hour
