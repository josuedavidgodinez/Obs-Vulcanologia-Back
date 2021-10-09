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
filePath = sys.argv[2]
#imgPath = '/home/litedev/Downloads/tempFolder/prueba1.png'
#filePath = '/home/litedev/Downloads/tempFolder/prueba1.txt'

txt = ''
with open(filePath,'r') as f:
    txt = f.read()
miniseeds = txt.split('\n')

st = read(miniseeds[0])
if(len(miniseeds) > 1):
    for i in range(1,len(miniseeds)):
        if len(miniseeds[i]) > 0:
            st += read(miniseeds[i])

st.filter('bandpass', freqmin=0.1, freqmax=25, corners=2, zerophase=True)
st.plot(type='dayplot', outfile= imgPath)

print(imgPath)
os.remove(filePath)