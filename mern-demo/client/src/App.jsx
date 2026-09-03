import { useState, useEffect } from 'react';
import './App.css'; // Nhập tệp CSS bên ngoài

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });

  // Đặt URL Backend của bạn vào biến này
  const API_URL = 'https://reimagined-meme-5gvvpr74vvgwh7j4-5000.app.github.dev/api/students';

  // Câu 47: Lấy danh sách
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Câu 48 & 49: Gửi dữ liệu POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormData({ studentId: '', name: '', email: '' }); // Reset form
      fetchStudents(); // Cập nhật lại danh sách ngay lập tức
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
    }
  };

  return (
    <div className="browser-mockup">
      <div className="browser-address-bar">
        https://quanly.sinhvien/dashboard
      </div>

      <div className="main-card">
        <div className="card-header">
          <span className="card-header-icon">🎓</span> {/* Biểu tượng mũ unicode */}
          <h1>Quản lý Sinh viên</h1>
        </div>

        <div className="form-section">
          <div className="sub-header">
            Thêm Sinh viên Mới
          </div>
          
          {/* Câu 48: Form */}
          <form onSubmit={handleSubmit}>
            <div className="add-student-grid">
              <div className="input-group">
                <label htmlFor="studentId">Mã số Sinh viên:</label>
                <input 
                  id="studentId"
                  name="studentId" 
                  placeholder="Ví dụ: 236912" 
                  value={formData.studentId} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label htmlFor="name">Họ tên Sinh viên:</label>
                <input 
                  id="name"
                  name="name" 
                  placeholder="Ví dụ: Nguyễn Văn Dũng" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group full-width-grid">
                <label htmlFor="email">Email Liên hệ:</label>
                <input 
                  id="email"
                  name="email" 
                  placeholder="Ví dụ: dung@example.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="add-btn-container">
              <button type="submit" className="add-btn">Thêm sinh viên</button>
            </div>
          </form>
        </div>

        <div className="list-section">
          <div className="sub-header">
            Danh sách Sinh viên Hiện có
          </div>

          {/* Danh sách */}
          <table className="student-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Email Liên hệ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="action-icons">
                      <span>✏️</span> {/* Biểu tượng bút chì giả */}
                      <span>🗑️</span> {/* Biểu tượng thùng rác giả */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="browser-footer">
        Dữ liệu được tải thành công. Sẵn sàng.
      </div>
    </div>
  );
}

export default App;