import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import Navbar from '../NavBar';

import '../../css/AdminHome.css'
const AdminHome = () => {
  const { logOut, auth } = useUserAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Admin Home</h1>
        <div className='wrap' >
          <div className="button-container">
            <button type="button" className="button" onClick={() => navigate('/admin/videostream')}>
              Live video stream
            </button>
          </div>
          <div className="button-container">

            <button type="button" className="button" onClick={() => navigate('/admin/reports')}>
              View Reports
            </button>
          </div>
          <div className="button-container">

            <button type="button" className="button" onClick={() => navigate('/admin/managecontract')}>
              Manage Contract
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
