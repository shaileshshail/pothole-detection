import logo from './logo.svg';
import './App.css';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { ReportContextProvider } from './context/ReportContext';
import { Route, Routes } from 'react-router-dom'
import AdminHome from './components/admin/AdminHome';
import Unauthorized from './components/Unauthorized';
import Login from './components/Login';
import VideoStream from './components/admin/VideoStream';
import ContractHome from './components/contractor/ContractHome';
import ManageContract from './components/admin/ManageContract';
import {ProtectedRoute} from './ProtectedRoute';
import Reports from './components/admin/Reports';
import Navbar from './components/NavBar';
import { NodeContextProvider } from './context/NodeContext';
const ROLES = {
  'Contractor': 'CO',
  'Admin': 'AD'
}

function App() {
  return (
    <>
      <UserAuthContextProvider>
        <ReportContextProvider>
          <NodeContextProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<ProtectedRoute allowedRoles={[ROLES.Admin]} />}>
            
            <Route path='/admin/adminhome' element={<AdminHome />} />
            <Route path='/admin/videostream' element={<VideoStream />} />
            <Route path='/admin/managecontract' element={<ManageContract />} />
            <Route path='/admin/reports' element={<Reports />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={[ROLES.Contractor]} />}>
            
            <Route path='/contractor/home' element={<ContractHome />} />
          </Route>


        </Routes>
        </NodeContextProvider>
        </ReportContextProvider>
      </UserAuthContextProvider>
    </>
  );
}

export default App;
