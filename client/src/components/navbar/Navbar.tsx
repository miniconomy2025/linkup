import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";
import { IoHomeOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiPlusSquare } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate("/feed")}>
        LinkUp
      </div>
      <nav className="sidebar-links">
        <Link to="/feed" className=""><IoHomeOutline size={20} />Home</Link>
        <Link to="/search"><FiSearch size={20} />Search</Link>
        <Link to="/create"><FiPlusSquare size={20} />Create</Link>
        <Link to={`/profile/${user?.name.toLowerCase().replace(/\\s+/g, '')}`}>
            {user?.avatar ? <img src={user.avatar} alt="avatar" width={20} height={20} className="sidebar-avatar" /> : <RxAvatar size={20} />}
            Profile
        </Link>
        <Link to="/settings"><FiSettings size={20} />Settings</Link>
        <button className="logout-btn" onClick={logout}><MdLogout size={20} />Logout</button>
      </nav>
    </aside>
  );
};

export default Navbar;
