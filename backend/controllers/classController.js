const ClassModel = require('../models/ClassModel');
const Student = require('../models/Student');

const getClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find().sort({ createdAt: -1 });
        
        const classesWithCount = await Promise.all(
            classes.map(async (cls) => {
                // Tirada ardayda dhabta ah ee ku jirta Class-kaas (tusaale: Class A)
                const count = await Student.countDocuments({ 
                    $or: [
                        { className: cls.name },
                        { class: cls.name }
                    ]
                });
                
                return {
                    ...cls.toObject(),
                    students: count
                };
            })
        );

        res.status(200).json(classesWithCount);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const addClass = async (req, res) => {
    try {
        const { name, teacher, room, status } = req.body;
        if (!name || !teacher || !room) {
            return res.status(400).json({ message: "Fadlan buuxi xogta." });
        }

        const count = await ClassModel.countDocuments();
        const newId = `CLS${String(count + 1).padStart(3, '0')}`;

        const newClass = new ClassModel({
            id: newId,
            name: name.trim(), // Tusaale: Class A
            teacher: teacher.trim(),
            room: room.trim(),
            status: status || 'Active'
        });

        const saved = await newClass.save();
        res.status(201).json({ message: "Fasalka si guul leh ayaa loo diiwaangeliyay", class: saved });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await ClassModel.findOneAndUpdate({ id: id }, req.body, { new: true });
        res.status(200).json({ message: "Updated successfully", class: updated });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        await ClassModel.findOneAndDelete({ id: id });
        res.status(200).json({ message: "Fasalka waa la tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteAllClasses = async (req, res) => {
    try {
        await ClassModel.deleteMany({});
        res.status(200).json({ message: "Dhammaan fasalladii waa la tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getClasses, addClass, updateClass, deleteClass, deleteAllClasses };