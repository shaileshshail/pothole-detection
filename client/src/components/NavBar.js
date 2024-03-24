import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css'; // Import CSS file for styling
import { useUserAuth } from '../context/UserAuthContext';

const Navbar = () => {
  const {auth,logOut} =useUserAuth();
  const currPath =window.location.pathname;
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/admin/adminhome">{auth?.roles=='AD'?'ADMIN CONSOLE':'CONTRACTOR CONSOLE'}</Link>
      </div>
      <ul className="nav-links">
        {currPath != '/admin/adminhome'?
        <>
        <li><Link className='link' to="/admin/videostream">VideoStream</Link></li>
        <li><Link className='link' to="/admin/reports">Reports</Link></li>
        <li><Link className='link' to="/admin/managecontract">Contractor</Link></li>
        </>
        :<></>}
        <li>{auth?.user.email}</li>
        <li><button onClick={()=>logOut()}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
