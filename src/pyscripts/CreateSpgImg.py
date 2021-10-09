from __future__ import print_function, with_statement
#from  obspy import read
import os
import sys
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from obspy import UTCDateTime, read, Trace, Stream


imgPath = sys.argv[1]
filePath = sys.argv[2]

#imgPath = '/home/ubuntu/Downloads/tempData/prueba1.png'
#filePath = '/home/ubuntu/Downloads/tempData/prueba.txt'

txt=''
with open(filePath,'r') as f:
    txt=f.read()
miniseeds=txt.split('\n')
st=read(miniseeds[0].replace('\r',''))
if(len(miniseeds)>1):
    for i in range (1,len(miniseeds)):
        if len(miniseeds[i]) > 0:
            st+=read(miniseeds[i].replace('\r',''))

import matplotlib
matplotlib.use('Agg')

st.spectrogram(log=True, title='Espectrograma', outfile=imgPath)
os.remove(filePath)