require('dotenv').config();
require('./config/database');

const express = require('express');


const app = express();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}
// Middleware
const cors = require('cors');
const logger = require('morgan');
const isSignedIn = require('./middleware/isSignedIn');
const isAdmin = require('./middleware/isAdmin');

// Routers
const authRouter = require('./routes/authRouter');
const userRoutes = require('./routes/userRoutes');
const campaignRequestRoutes = require('./routes/CampaignRequestRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const taskRoutes = require('./routes/taskRoutes');
const clientCampReqRouter = require('./routes/client/clientCampaignRequestRouter');
const clientCampaignRouter = require('./routes/client/clientCampaignRouter');
const agencyClientRoutes = require('./routes/agencyClientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const outsourceRoutes = require('./routes/outsource/outsourceRoute');
const outsourceTaskRoutes = require('./routes/outsource/outsourceTaskRoutes');
const staffRoutes = require('./routes/staffRoutes');

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
app.use('/admin', isAdmin, adminRoutes);
app.use('/outsource', outsourceRoutes);
app.use('/outsource-tasks', outsourceTaskRoutes);
app.use('/staff',staffRoutes);

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

app.listen(port, '0.0.0.0', () => {
  console.log(`The express app is ready on port ${port}!`);
});
