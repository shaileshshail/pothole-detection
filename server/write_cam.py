import cv2
import struct
import redis
import numpy as np

def toRedis(r,a,n):
   """Store given Numpy array 'a' in Redis under key 'n'"""
   h, w = a.shape[:2]
   shape = struct.pack('>II',h,w)
   encoded = shape + a.tobytes()

   # Store encoded data in Redis
   r.set(n,encoded)
   return
ISCONNECTED = False

def start_writing_cam_feed():
    r = redis.Redis(host='localhost', port=6379, db=0)
    if r:
        print("Connected to redis...")
    #cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cam = cv2.VideoCapture(0,cv2.CAP_DSHOW)
    if cam:
        print("Connected to camera...")
    global ISCONNECTED 
    ISCONNECTED = True
    while True:
        ret, img = cam.read()
        if not ret:
            continue
        '''cv2.imshow('img', img)

        key = cv2.waitKey(1) & 0xFF

        # Check for specific key presses
        if key == ord('q'):
            break  # Break the loop if 'q' key is pressed'''
        toRedis(r, img, 'image')