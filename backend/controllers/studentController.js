const Student = require('../models/Student');

// 1. Helitaanka Dhamaan Ardayda (Get All Students)
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. Ku darista Arday Cusub iyadoo ID-gu yahay STU001, STU002... (Add Student with Auto ID)
const addStudent = async (req, res) => {
    try {
        const { name, className, gender, status } = req.body;

        if (!name || !className || !gender) {
            return res.status(400).json({ message: "Fadlan buuxi magaca, fasalka, iyo jinsiga." });
        }

        // Raadi ardaygii ugu dambeeyay ee la diiwaangeliyay si loo ogaado ID-giisa
        const lastStudent = await Student.findOne().sort({ createdAt: -1 });

        let newId = "STU001"; // Default haddii uusan arday jirin

        if (lastStudent && lastStudent.id) {
            // Ka soo jar nambarka ID-giisa hore (Tusaale: "STU005" -> 5)
            const lastNumber = parseInt(lastStudent.id.replace("STU", ""), 10);
            if (!isNaN(lastNumber)) {
                const nextNumber = lastNumber + 1;
                // Ka dhig qaab 3 lambar ah (Tusaale: 2 -> "002", 15 -> "015")
                newId = `STU${String(nextNumber).padStart(3, '0')}`;
            }
        }

        const student = new Student({
            id: newId,
            name,
            className,
            gender,
            status: status || 'Active'
        });

        const savedStudent = await student.save();
        res.status(201).json({ message: "Ardayga si guul leh ayaa loo diiwaangeliyay", student: savedStudent });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3. Tirtiridda Arday (Delete Student)
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params; // Halkan ID wuxuu noqon karaa MongoDB _id ama ardayga id-giisa sida STU001
        const student = await Student.findOneAndDelete({ id: id });

        if (!student) {
            return res.status(404).json({ message: "Ardaygan lama helin." });
        }

        res.status(200).json({ message: "Ardayga si guul leh ayaa loo tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4. Wax ka beddelka Ardayga (Update Student - Edit)
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params; // STU001
        const updated = await Student.findOneAndUpdate({ id: id }, req.body, { new: true });
        
        if (!updated) {
            return res.status(404).json({ message: "Ardaygan lama helin." });
        }

        res.status(200).json({ message: "Updated successfully", student: updated });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 5. Tirtiridda Dhammaan Ardayda
const deleteAllStudents = async (req, res) => {
    try {
        await Student.deleteMany({});
        res.status(200).json({ message: "Dhammaan ardaydii si guul leh ayaa loo tirtiray." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// HUBI INAAN HALKAN KU DARNAY 'deleteAllStudents':
module.exports = {
    getStudents,
    addStudent,
    deleteStudent,
    updateStudent,
    deleteAllStudents // <--- Waa kan oo maqnaa
};