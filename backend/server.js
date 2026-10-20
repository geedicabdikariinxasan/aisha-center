const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');

// Load environment variables
dotenv.config();

// Ku qasbi Node.js inuu isticmaalo Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
// Waxaan u oggolaanay CORS inay ka yimaadaan meel kasta (si uu Frontend-ka online ula hadlo)
app.use(cors()); 
app.use(express.json());

// ─── ROUTES ───
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4 
        });
        console.log(`MongoDB Connected successfully`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => { // Waxaan ku darnay '0.0.0.0' si uu Render ugu xirmo
        console.log(`Server is running on port ${PORT}`);
    });
});

app.get('/', (req, res) => {
    res.send('Aisha Center API is running successfully...');
});