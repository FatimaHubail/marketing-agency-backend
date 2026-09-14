require('dotenv').config();
require('./config/database');

const express = require('express');

const app = express();

// Middleware
const cors = require('cors');
const logger = require('morgan');
const isSignedIn = require('./middleware/isSignedIn');

// Routers
const authRouter = require('./routes/authRouter');
const userRoutes = require('./routes/userRoutes');
const campaignRequestRoutes = require('./routes/CampaignRequestRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const taskRoutes = require('./routes/taskRoutes');
const clientCampReqRouter = require('./routes/client/clientCampaignRequestRouter');
const agencyClientRoutes = require('./routes/agencyClientRoutes');


app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// ROUTES

// PUBLIC
app.use('/auth', authRouter);

// PROTECTED
app.use(isSignedIn);

//Admin routes 
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/clients', agencyClientRoutes);


// client campaign requests routes
app.use('/requests', clientCampReqRouter);

// campaign requests routes
app.use('/campaign-requests', campaignRequestRoutes)

// campaigns routes (client: own only, staff/admin: all)
app.use('/campaigns', campaignRoutes);


app.get('/protected', (req, res) => {
  try {
    const userPayload = req.user;

    res.status(200).json({ user: userPayload });
  } catch (error) {
    res.status(500).json({ err: 'Something went wrong' });
  }
});

app.listen(3000, () => {
  console.log('The express app is ready!');
});
