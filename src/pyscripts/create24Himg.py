from __future__ import print_function
#from  obspy import read
import cv2
import os
import numpy as np
import glob
import urllib.request
import pandas as pd
import webbrowser
import psycopg2
import pandas as pd
import sys
import time
from datetime import datetime, timedelta
from obspy import UTCDateTime, read, Trace, Stream

imgPath = sys.argv[1]
miniseeds = []
for i in range(2, len(sys.argv)):
    miniseeds.append(sys.argv[i])

# print('imagen: ' + imgPath)
# print(miniseeds)

st = read(miniseeds[0])
if(len(miniseeds) > 1):
    for i in range(1,miniseeds.count):
        st += read(miniseeds[i])

st.filter('bandpass', freqmin=0.1, freqmax=25, corners=2, zerophase=True)
st.plot(type='dayplot', outfile= imgPath)

print(imgPath)