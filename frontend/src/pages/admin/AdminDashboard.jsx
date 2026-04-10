import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin-login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '240px', background: '#1e293b', color: '#fff', padding: '20px' }}>
        <h3 style={{ marginBottom: '30px', textAlign: 'center' }}>🛡️ Админ-панель</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/admin/stats" style={styles.link}>📊 Статистика</Link>
          <Link to="/admin/users" style={styles.link}>👥 Пользователи</Link>
          <Link to="/admin/templates" style={styles.link}>🎨 Шаблоны</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Выйти</button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '30px', background: '#f8fafc' }}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  link: { color: '#cbd5e1', textDecoration: 'none', padding: '10px', borderRadius: '6px', transition: '0.2s' },
  logoutBtn: { marginTop: '20px', padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};