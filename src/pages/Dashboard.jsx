import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, login, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [activeSection, setActiveSection] = useState('resumes'); // 'resumes', 'profile', 'settings'

  // Состояния для формы редактирования профиля
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Состояния для уведомлений (локальные настройки)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('userNotifications');
    return saved ? JSON.parse(saved) : true;
  });

  // Загрузка резюме
  useEffect(() => {
    const saved = localStorage.getItem('resumes');
    if (saved) {
      setResumes(JSON.parse(saved));
    } else {
      const mockResumes = [
        { id: '1', title: 'Frontend Developer', updatedAt: '2024-03-15' },
        { id: '2', title: 'Full Stack Engineer', updatedAt: '2024-02-28' },
      ];
      setResumes(mockResumes);
      localStorage.setItem('resumes', JSON.stringify(mockResumes));
    }
  }, []);

  // Сохранение уведомлений при изменении
  useEffect(() => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Удаление резюме
  const handleDelete = (id) => {
    const updated = resumes.filter(r => r.id !== id);
    setResumes(updated);
    localStorage.setItem('resumes', JSON.stringify(updated));
  };

  // Обработчик сохранения профиля
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');

    // Валидация пароля (если заполнен)
    if (editPassword) {
      if (editPassword.length < 8) {
        setProfileError('Пароль должен содержать минимум 8 символов');
        return;
      }
      if (!/[A-Z]/.test(editPassword)) {
        setProfileError('Пароль должен содержать хотя бы одну заглавную букву');
        return;
      }
      if (!/\d/.test(editPassword)) {
        setProfileError('Пароль должен содержать хотя бы одну цифру');
        return;
      }
      if (editPassword !== editConfirmPassword) {
        setProfileError('Пароли не совпадают');
        return;
      }
    }

    // Обновляем данные пользователя
    const updatedUser = {
      username: editUsername,
      email: editEmail,
    };
    login(updatedUser); // обновляем контекст и localStorage
    setProfileMessage('Данные успешно обновлены!');
    // Очищаем поля пароля
    setEditPassword('');
    setEditConfirmPassword('');
  };

  // Переключение уведомлений
  const toggleNotifications = () => {
    setNotifications(prev => !prev);
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1>Личный кабинет</h1>
            <div className="user-info">
              <p>Привет, {user?.username}!</p>
              <button onClick={logout} className="btn btn-outline">Выйти</button>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="sidebar">
              <div className="user-profile">
                <div className="avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <h3>{user?.username}</h3>
                <p>{user?.email}</p>
              </div>
              <nav className="dashboard-nav">
                <ul>
                  <li
                    className={activeSection === 'resumes' ? 'active' : ''}
                    onClick={() => setActiveSection('resumes')}
                  >
                    <i className="fas fa-file-alt"></i> Мои резюме
                  </li>
                  <li
                    className={activeSection === 'profile' ? 'active' : ''}
                    onClick={() => setActiveSection('profile')}
                  >
                    <i className="fas fa-user-edit"></i> Редактировать профиль
                  </li>
                  <li
                    className={activeSection === 'settings' ? 'active' : ''}
                    onClick={() => setActiveSection('settings')}
                  >
                    <i className="fas fa-cog"></i> Настройки
                  </li>
                </ul>
              </nav>
            </div>

            <div className="main-content">
              {activeSection === 'resumes' && (
                <>
                  <div className="actions">
                    <Link to="/editor/new" className="btn btn-primary">
                      <i className="fas fa-plus"></i> Создать новое резюме
                    </Link>
                  </div>
                  <div className="resumes-list">
                    <h2>Мои резюме</h2>
                    {resumes.length === 0 ? (
                      <p>У вас пока нет сохраненных резюме. Нажмите "Создать новое резюме".</p>
                    ) : (
                      <div className="resume-cards">
                        {resumes.map(resume => (
                          <div key={resume.id} className="resume-card">
                            <div className="resume-info">
                              <h3>{resume.title}</h3>
                              <p>Обновлено: {resume.updatedAt}</p>
                            </div>
                            <div className="resume-actions">
                              <Link to={`/editor/${resume.id}`} className="btn-sm">
                                <i className="fas fa-edit"></i> Редактировать
                              </Link>
                              <button onClick={() => handleDelete(resume.id)} className="btn-sm btn-danger">
                                <i className="fas fa-trash"></i> Удалить
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === 'profile' && (
                <div className="profile-section">
                  <h2>Редактирование профиля</h2>
                  <form onSubmit={handleProfileSave} className="profile-form">
                    <div className="form-group">
                      <label>Имя пользователя</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Новый пароль (оставьте пустым, если не меняете)</label>
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Подтвердите новый пароль</label>
                      <input
                        type="password"
                        value={editConfirmPassword}
                        onChange={(e) => setEditConfirmPassword(e.target.value)}
                      />
                    </div>
                    {profileError && <div className="error-message">{profileError}</div>}
                    {profileMessage && <div className="success-message">{profileMessage}</div>}
                    <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                  </form>
                </div>
              )}

              {activeSection === 'settings' && (
                <div className="settings-section">
                  <h2>Настройки</h2>
                  <div className="settings-item">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={toggleNotifications}
                      />
                      <span className="slider"></span>
                      Получать уведомления о просмотрах резюме
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                      />
                      <span className="slider"></span>
                      Тёмная тема
                    </label>
                  </div>
                  <p className="settings-note">Настройки сохраняются автоматически.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;