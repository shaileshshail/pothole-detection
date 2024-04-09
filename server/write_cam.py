import cv2
import struct
import redis
import numpy as np

def toRedis(r,array,name):
   """Store given Numpy array 'a' in Redis under key 'n'"""
   h, w = array.shape[:2]
   shape = struct.pack('>II',h,w)
   encoded = shape + array.tobytes()

   # Store encoded data in Redis
   r.set(name,encoded)
   return
