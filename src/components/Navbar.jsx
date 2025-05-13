import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar ">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="navbar-brand">
          <img
            src="/nmdpraLogo.png"
            alt="NMDPRA Logo"
            className="navbar-logo"
          />
          <h1>NMDPRA Store</h1>
        </div>
      </Link>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/requisition">New Requisition</Link>
        </li>
        <li>
          <Link to="/requisitions">Requisition History</Link>
        </li>
        <li>
          <Link to="/weekly-report">Weekly Report</Link>
        </li>
        <li>
          <Link to="/monthly-report">Monthly Report</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
