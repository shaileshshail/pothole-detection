import React, { useEffect, useState } from 'react'
import Navbar from '../NavBar'
import { useReport } from '../../context/ReportContext';

const ContractHome = () => {
  const {getReportByContractorId} =useReport();

  useEffect(() => {
    const load = async () => {
      const val = await getReportByContractorId();
      console.log(val.data.data);
    }
    load();
  }, []);

  return (
    <>
    <Navbar />
    <div>ContractHome</div>
    </>
  )
}

export default ContractHome