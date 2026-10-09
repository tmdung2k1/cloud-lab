import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Lấy Base URL từ biến môi trường, fallback về link Render của Backend
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-backend-236912.onrender.com';
  const API_ENDPOINT = `${BASE_URL}/api/students`;

  // Lấy danh sách
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${response.status} (${response.statusText})`);
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_ENDPOINT}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(`Lỗi: ${err.message || 'Không thể lưu sinh viên!'}`);
        return;
      }

      setEditingId(null);
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error("Lỗi khi lưu sinh viên:", error);
      alert("Không thể kết nối tới server!");
    }
  };

  // Đưa thông tin sinh viên lên form để sửa
  const handleEdit = (student) => {
    const idToEdit = student._id || student.studentId;
    setEditingId(idToEdit);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!id) {
      alert("Không tìm thấy mã định danh sinh viên để xóa!");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(`Lỗi: ${err.message || 'Không thể xóa sinh viên!'}`);
        return;
      }
      fetchStudents();
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      alert("Không thể kết nối tới server khi xóa!");
    }
  };

  return (
    <div className="browser-mockup">
      <div className="browser-address-bar">
        https://quanly.sinhvien/dashboard
      </div>

      <div className="main-card">
        <div className="card-header">
          <h1>MERN Stack Application - Version 2.0</h1>
        </div>

        <div className="form-section">
          <div className="sub-header">
            {editingId ? "Cập nhật Thông tin Sinh viên" : "Thêm Sinh viên Mới"}
          </div>

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

            <div className="add-btn-container" style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="add-btn">
                {editingId ? "Lưu thay đổi" : "Thêm sinh viên"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="add-btn"
                  style={{ backgroundColor: '#6c757d' }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ studentId: '', name: '', email: '' });
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="list-section">
          <div className="sub-header">
            Danh sách Sinh viên Hiện có
          </div>

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
                <tr key={student._id || student.studentId || index}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="action-icons">
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(student)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(student._id || student.studentId)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
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