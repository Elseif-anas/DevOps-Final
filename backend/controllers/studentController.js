const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students',
      error: error.message,
    });
  }
};

// Get single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching student',
      error: error.message,
    });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, department, year, phone, address } = req.body;

    // Check if student with email or roll number already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'Student with this email or roll number already exists',
      });
    }

    const student = new Student({
      name,
      email,
      rollNumber,
      department,
      year,
      phone,
      address,
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating student',
      error: error.message,
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, department, year, phone, address } = req.body;

    // Check if email or roll number is being changed to an existing one
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }],
      _id: { $ne: req.params.id },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'Student with this email or roll number already exists',
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        rollNumber,
        department,
        year,
        phone,
        address,
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({
      message: 'Error updating student',
      error: error.message,
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting student',
      error: error.message,
    });
  }
};

// Get student statistics
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);
    const yearStats = await Student.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalStudents,
      departmentStats,
      yearStats,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
