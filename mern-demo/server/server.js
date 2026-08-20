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