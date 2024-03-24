import pynmea2
from geopy.geocoders import Nominatim
# rtk gps for atmost precision

def getGPSData():
    nmea = '$GPRMC,164125,A,4425.8988,N,07543.5370,W,000.0,000.0,151116,,,A*66'
    nmeaobj = pynmea2.parse(nmea)

    fields = nmeaobj.fields
    data = nmeaobj.data
    '''for i in range(12):
        print(fields[i][0],data[i])'''
    # return lat,long,vehicle speed
        
    return 52.509669,13.376294,22
            


def reverseGeoCode(lat,long):
    geolocator = Nominatim(user_agent="pothole_detection")
    location = geolocator.reverse(str(lat)+", "+str(long))
    print(location.address) 
    return location.address