const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    teacher: { type: String, required: true }, // Magaca macallinka laga soo xulay Teachers collection
    studentsCount: { type: Number, default: 0 }, // Tirada ardayda xiran fasalkan
    schedule: { type: String, default: "Saturday - Wednesday" },
    time: { type: String, default: "07:30 AM - 09:00 AM" },
    room: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);