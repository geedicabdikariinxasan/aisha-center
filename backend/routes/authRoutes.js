const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Si aan u qarsano password-ka

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Hubi inuu user-ku horay u jirin
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email-kan horay ayaa loo isticmaalay." });
        }

        // Hash password-ka (Amni ahaan)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Abuur user cusub
        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: role || 'Teacher'
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Account-kaaga si guul leh ayaa loo diiwaan geliyay!"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Raadi user-ka Email-ka ama magaca ku jira
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email-kan ama Username-kan lama helin." });
        }

        // Hubi inuu Role-ku sax yahay (Tusaale: haddii uu Admin isku dayayo ama Teacher)
        if (user.role !== role) {
            return res.status(400).json({ success: false, message: `Fadlan dooro doorka saxda ah (${user.role}).` });
        }

        // Is barbardhig password-ka
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password-ka waa qalad." });
        }

        res.status(200).json({
            success: true,
            message: "Waa lagu guuleystay soo gelitaanka!",
            role: user.role,
            token: "sample_token_markaz_aisha_" + user._id
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

module.exports = router;