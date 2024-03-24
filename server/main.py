from fastapi import FastAPI
from sockets import socket_app
import uvicorn
import threading
import write_cam
import time
import requests
import json,os
import gps
from detection import VideoConnect

def start_write_cam_thread():
    try:   
        write_cam_thread = threading.Thread(target=write_cam.start_writing_cam_feed, daemon=True)
        write_cam_thread.start()
    except Exception as e:
        print("Error starting write_cam_thread:", e)

def wait_for_camera_connection():
    i = 1
    while not write_cam.ISCONNECTED:
        print('Connecting to camera from main thread... ', i, 's', end='\r')
        time.sleep(1)
        i += 1
    print("Connected to camera successfully...")

def start_detection_thread():
    try:   
        videoconnect = VideoConnect()
        detect_pothole_thread = threading.Thread(target=videoconnect.getStream, daemon=True)
        detect_pothole_thread.start()
    except Exception as e:
        print("Error starting detect_pothole_thread:", e)

def keep_alive():
    while True:
        lat,long,speed = gps.getGPSData()
        address = gps.reverseGeoCode(lat,long)
        data1 ={"id":"A123","ip":"localhost","port":8000,"lat":lat,"long":long,"loc":"default"}
        print(data1)
        try:
            requests.post("http://localhost:5000/node/keepalive",json=data1)
        except:
            pass
        time.sleep(10)

def keep_alive_thread():
    try:   
        keep_alive_thread = threading.Thread(target=keep_alive, daemon=True)
        keep_alive_thread.start()
    except Exception as e:
        print("Error starting keep_alive_thread:", e)

app = FastAPI()
app.mount("/", socket_app)

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    start_write_cam_thread()
    wait_for_camera_connection()
    start_detection_thread()
    keep_alive_thread()
    print('Starting FastAPI server...')
    uvicorn.run("main:app", host="localhost", port=8000, lifespan="on", reload=True)
