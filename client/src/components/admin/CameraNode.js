import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {useNode} from '../../context/NodeContext'
import '../../css/Cameranode.css'
const CameraNode = (props) => {
    const {getAll} = useNode();
    const [videoSrc, setVideoSrc] = useState('');
    const [socketInstance, setsocketInstance] = useState('')
    useEffect(() => {

        console.log(props.data)
        const socket = io('http://'+props.data.ip+':'+props.data.port);
        setsocketInstance(socket);
        socket.on('connect', () => {
            console.log('Connected to server');
            socket.emit('startStream');
        });
        socket.on('videoFrame', async (frame) => {
            console.log('videoFramevideoFrame')
            setVideoSrc(`data:image/jpeg;base64,${frame}`);
        });

        return () => {
            socket.disconnect();
        };
    }, [props]);
    return (
        <>
      <div className="video-container">
        <div className="video-stream">
          <h1>Video Stream from host : {props?.data.name}</h1>
          <p>Last seen time : {props?.data.lastseen}</p>
          <p>Last seen location :<a target="_blank" href={'https://maps.google.com/?q='+props?.data.latitude+','+props?.data.longitude }>Maps</a>
</p>

          {videoSrc && <img src={videoSrc} alt="Video Stream" />}
        </div>
        <div className="video-controls">
          <button type='button' className='start-btn' onClick={() => socketInstance.connect()}>Start</button>
          <button type='button' className='stop-btn' onClick={() => socketInstance.disconnect()}>Stop</button>
        </div>
      </div>
    </>
    )
}

export default CameraNode