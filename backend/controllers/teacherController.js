const Teacher = require('../models/Teacher');

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ createdAt: -1 });
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const addTeacher = async (req, res) => {
    try {
        const { name, gender, subjects, phone, email, status } = req.body;

        if (!name || !gender || !subjects || !phone || !email) {
            return res.status(400).json({ message: "Fadlan buuxi dhammaan xogta muhiimka ah." });
        }

        // Hubi in email-ku uusan horay u jirin
        const existingTeacher = await Teacher.findOne({ email: email.trim() });
        if (existingTeacher) {
            return res.status(400).json({ message: `Macallin leh email-kan (${email}) horay ayuu u jiray.` });
        }

        // Tirada macallimiinta ee hadda jirta tirto si loo helo ID-ga xiga ee saxda ah
        const count = await Teacher.countDocuments();
        const nextNumber = count + 1;
        const newId = `TCH${String(nextNumber).padStart(3, '0')}`;

        // Hubi in ID-gan uusan weli jirin (safety check)
        let finalId = newId;
        let checkId = await Teacher.findOne({ id: finalId });
        let counter = nextNumber;
        while (checkId) {
            counter++;
            finalId = `TCH${String(counter).padStart(3, '0')}`;
            checkId = await Teacher.findOne({ id: finalId });
        }

        const teacher = new Teacher({
            id: finalId,
            name: name.trim(),
            gender,
            subjects: subjects.trim(),
            phone: phone.trim(),
            email: email.trim(),
            status: status || 'Active'
        });

        const savedTeacher = await teacher.save();
        res.status(201).json({ message: "Macallinka si guul leh ayaa loo diiwaangeliyay", teacher: savedTeacher });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Teacher.findOneAndUpdate({ id: id }, req.body, { new: true });
        
        if (!updated) {
            return res.status(404).json({ message: "Macallinkan lama helin." });
        }

        res.status(200).json({ message: "Updated successfully", teacher: updated });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findOneAndDelete({ id: id });

        if (!teacher) {
            return res.status(404).json({ message: "Macallinkan lama helin." });
        }

        res.status(200).json({ message: "Macallinka si guul leh ayaa loo tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteAllTeachers = async (req, res) => {
    try {
        await Teacher.deleteMany({});
        res.status(200).json({ message: "Dhammaan macallimiintii si guul leh ayaa loo tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteAllTeachers
};