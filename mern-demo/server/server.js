const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: path.resolve(__dirname, '.env') });
}

const Student = require('./Student');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=== MERN Backend v1.2 Auto-Deployed on port ${PORT} ===`);
});

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép gọi nếu không có origin (ví dụ Postman/curl) 
        // hoặc origin nằm trong danh sách whitelist
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Chặn bởi chính sách CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Đã kết nối MongoDB Atlas thành công!"))
    .catch((err) => console.log("Lỗi kết nối:", err));

// Route kiểm tra
app.get('/api/hello', (req, res) => {
    res.json({ message: "Backend đang hoạt động!" });
});

// Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sinh viên
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật sinh viên (hỗ trợ cả MongoDB _id lẫn studentId/MSSV)
app.put('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = mongoose.Types.ObjectId.isValid(id)
            ? { $or: [{ _id: id }, { studentId: id }] }
            : { studentId: id };

        const updatedStudent = await Student.findOneAndUpdate(
            filter,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa sinh viên (hỗ trợ cả MongoDB _id lẫn studentId/MSSV)
app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = mongoose.Types.ObjectId.isValid(id)
            ? { $or: [{ _id: id }, { studentId: id }] }
            : { studentId: id };

        const deletedStudent = await Student.findOneAndDelete(filter);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên!" });
        }
        res.status(200).json({ message: "Đã xóa sinh viên thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Health Check Endpoint cho Cloud PaaS Monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Khởi chạy server (LUÔN ĐẶT Ở CUỐI CÙNG)
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});