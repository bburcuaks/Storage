import { Bell as BellIcon, UserCircle as UserIcon } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">Dashboard</h1>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <BellIcon size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <UserIcon size={24} />
          <span className="user-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
