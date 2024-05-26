const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const riskRoutes = require('./routes/risks');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');
const { Server } = require('socket.io');
const logger = require('./logger');
const azureAdStrategy = require('./strategies/azureAdStrategy');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());
app.use(cors());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(azureAdStrategy);

mongoose.connect('mongodb://localhost:27017/riskdashboard', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', authRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(errorHandler); // centralized error handler

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

app.set('socketio', io);

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});