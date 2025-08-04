import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";
import { IoHomeOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FiPlusSquare } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineNotifications } from "react-icons/md";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate("/feed")}>
        LinkUp
      </div>
      <nav className="sidebar-links">
        <Link to="/feed"><IoHomeOutline size={20} /><span className="label">Home</span></Link>
        <Link to="/search"><FiSearch size={20} /><span className="label">Search</span></Link>
        <Link to="/create"><FiPlusSquare size={20} /><span className="label">Create</span></Link>
        <Link to={`/profile/${user?.name.toLowerCase().replace(/\s+/g, '')}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" width={20} height={20} className="sidebar-avatar" />
          ) : (
            <RxAvatar size={20} />
          )}
          <span className="label">Profile</span>
        </Link>
        <button className="logout-btn" onClick={logout}>
          <MdLogout size={20} />
          <span className="label">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Navbar;
