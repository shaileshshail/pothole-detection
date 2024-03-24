from ultralyticsplus import YOLO, render_result
import cv2,numpy as np
import read_cam
import redis
import requests
import gps
import json
class VideoConnect:
    def __init__(self) -> None:
        self.model = YOLO("D:\pothole-detection\server\models\model.pt")
        self.model.overrides['conf'] = 0.25  # NMS confidence threshold
        self.model.overrides['iou'] = 0.45  # NMS IoU threshold
        self.model.overrides['agnostic_nms'] = False  # NMS class-agnostic
        self.model.overrides['max_det'] = 3  # maximum number of detections per image

    def getStream(self):
        r = redis.Redis(host='localhost', port=6379, db=0)
        print("Connect to redis from detection")
        while(True): 

            # Capture the video frame 
            frame = read_cam.fromRedis(r,'image')

            results = self.model.predict(frame,verbose=False)
            # parse results
            result = results[0]
            boxes = result.boxes.xyxy # x1, y1, x2, y2
            scores = result.boxes.conf
            categories = result.boxes.cls
            #scores = result.probs # for classification models
            masks = result.masks # for segmentation models
            masked_frame = render_result(model=self.model, image=frame, result=result)
            masked_frame =  np.array(masked_frame)
            for score in scores.tolist():
                if score>0.7:
                    self.postData(frame,masked_frame)
                    #print("scores : ",scores.tolist())


            cv2.imshow('TRANSMITTING VIDEO',masked_frame)
            key = cv2.waitKey(1) & 0xFF
            if key ==ord('q'):
                break
    
    def postData(self,frame1,frame2):
        _,imencoded1 = cv2.imencode(".jpg", frame1)
        _,imencoded2 = cv2.imencode(".jpg", frame2)
        file1 = ('file', ('image1.jpg', imencoded1.tobytes(), 'image/jpeg'))
        file2 = ('file', ('image2.jpg', imencoded2.tobytes(), 'image/jpeg'))
        lat,long,speed = gps.getGPSData()
        address = gps.reverseGeoCode(lat,long)
        #headers = {'Authorization': f'Bearer {auth_token}'}

        data1 ={"data" :json.dumps({"lat":lat,"long":long,"address":address})}
        print(data1)
        try:
            requests.post("http://localhost:5000/report/", files=[file1,file2],data=data1)
        except Exception as error:
            print('Exiting connection ...\n',error)
            return
    def getGPS(self):
        return 

