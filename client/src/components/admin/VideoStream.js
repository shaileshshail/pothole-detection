import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNode } from '../../context/NodeContext'
import Navbar from '../NavBar';
import '../../css/Videostream.css'
import CameraNode from './CameraNode';
import { json } from 'react-router-dom';
const VideoStream = () => {
  const { getAll } = useNode();
  const [node, setnode] = useState()
  const [host, sethost] = useState()
  useEffect(() => {
    const load = async () => {
      const val = await getAll();
      setnode(val.data.data);
      console.log(val.data.data);
    }
    load();
  }, []);

  const onclick = (data) => {
    sethost(null)
    sethost(data)
  }
  return (
    <>
      <Navbar />
      <table>
        <tr>
          <th>Id</th>
          <th>IP Address</th>
          <th>Port</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
        {node?.map(element => {
         return (
          <tr onClick={()=>onclick(element)} style={element?.id==host?.id?{backgroundColor:'green'}:{}}>
            <td>{element.id}</td>
            <td>{element.ip}</td>
            <td>{element.port}</td>
            <td>{element.latitude}</td>
            <td>{element.longitude}</td>
          </tr>
         )
        })}
      </table>
        {host?<CameraNode data={host}/>:''}
    </>
  )
}

export default VideoStream