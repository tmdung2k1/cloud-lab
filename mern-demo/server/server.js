const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Đã kết nối MongoDB Atlas thành công!"))
    .catch((err) => console.log("Lỗi kết nối:", err));

app.get('/api/hello', (req, res) => {
    res.json({ message: "Backend đang hoạt động!" });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
const Student = require('./Student');

// Câu 36: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Câu 37: Thêm sinh viên
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 38: Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 39: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa sinh viên" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});