import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Package className="logo-icon" size={28} />
        <h2>SportStorage</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        {/* We can add more links later if needed */}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
