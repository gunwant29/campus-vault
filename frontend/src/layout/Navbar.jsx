import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom shadow-soft">
      <div className="container">
        <Link className="navbar-brand fw-bold brand-color" to="/">
          CampusVault
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary-custom text-white px-3" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3 text-muted">
                  Hi, <span className="fw-semibold">{user?.name}</span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;