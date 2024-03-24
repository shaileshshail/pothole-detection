#Socket_io.py file
import socketio,redis
import cv2,base64
import read_cam
#Fast API application
#Socket io (sio) create a Socket.IO server
sio=socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
#wrap with ASGI application
socket_app = socketio.ASGIApp(sio)


connected_clients = set()

@sio.on("connect")
async def connect(sid, env):
    connected_clients.add(sid)
    print("New Client Connected to This id :"+" "+str(sid))

@sio.on("disconnect")
async def disconnect(sid):
    connected_clients.remove(sid)
    print("Client Disconnected: "+" "+str(sid))
    
@sio.on("startStream")
async def startStream(sid):
    r = redis.Redis(host='localhost', port=6379, db=0)

    while sid in connected_clients:
        frame = read_cam.fromRedis(r,'masked_img')

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = base64.b64encode(buffer.tobytes()).decode('utf-8')

        await sio.emit('videoFrame', frame_bytes)

