import React, { useState, useEffect } from 'react';
import { useReport } from '../../context/ReportContext';
import { useTable } from 'react-table';
import Navbar from '../NavBar';
import '../../css/Report.css'
import image from '../../test.jpeg';

const Reports = () => {
  const { deleteReport, getAll } = useReport();
  const [reportList, setReportList] = useState([]);
  const [reload, setReload] = useState(true);

  const data = React.useMemo(() => reportList, [reportList]);
  const columns = React.useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
      width: 500, // Set the width of the ID column to 50px
    },
    {
      Header: "Created Time",
      accessor: "createdTime",
      width: 150, // Set the width of the Created Time column to 150px
    },
    {
      Header: "Area",
      accessor: "address",
      width: 200, // Set the width of the Area column to 200px
    },
    {  
      Header: "Image",
      accessor:"image_url",
      Cell: tableProps  => (
      <div><img className='image-cell' src={tableProps.row.original.image_url} width="250" height="250" /></div>
      //<div><img className='image-cell' src={image} width="250" height="250" /></div>
    )},
    {
      Header: "Masked Image",
      accessor: "masked_image_url",
      Cell: tableProps  => (
        <div><img className='image-masked-cell' src={tableProps.row.original.masked_image_url} width="250" height="250" /></div>
        //<div><img className='image-masked-cell' src={image} width="250" height="250" /></div>
      )
    },
    {
      Header: "Latitude",
      accessor: "latitude",
    },
    {
      Header: "Longitude",
      accessor: "longitude",
    },
    {
      Header: "Maps",
      Cell: tableProps =>(
        <div><a href={'https://maps.google.com/?q='+tableProps.row.original.latitude+','+tableProps.row.original.longitude }>Map location</a></div>
      )
    },
    {
      Header: "Edit",
      Cell: tableProps =>(
        <div><button onClick={()=>deleteOne(tableProps.row.original.id)}>Delete</button>
        </div>
      )
    }
  ], []);
  const deleteOne =(id)=>{
    if(window.confirm('Press OK to delete report :'+id)){
      deleteReport(id);
      setReload(!reload)}
  }
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data,defaultColumn: {
    size: 400, //starting column size
    minSize: 50, //enforced during column resizing
    maxSize: 500, //enforced during column resizing
  }, });

  useEffect(() => {
    const load = async () => {
      const val = await getAll();
      setReportList(val.data.data);
      console.log(val.data.data);
    }
    load();
  }, [reload]);

  return (
    <>
    <Navbar />
      Reports
      <div >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Reports;
