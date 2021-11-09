from __future__ import print_function
#from  obspy import read
import os
import numpy as np
import glob
import pandas as pd
import webbrowser
import psycopg2
import pandas as pd
import sys
import time
from datetime import datetime, timedelta
from obspy import UTCDateTime, read, Trace, Stream
import matplotlib
matplotlib.use('Agg')

#Obtenemos parametros enviados desde consola en node
imgPath = sys.argv[1]
filePath = sys.argv[2]
#imgPath = '/home/ubuntu/Downloads/tempData/prueba1.png'
#filePath = '/home/ubuntu/Downloads/tempData/prueba1.txt'

#abrimos archivo txt y leemos las rutas de los miniseed
txt = ''
with open(filePath,'r') as f:
    txt = f.read()
miniseeds = txt.split('\n')
#leemos los archivos miniseed para obtener los datos
st = read(miniseeds[0].replace('\r',''))
if(len(miniseeds) > 1):
    for i in range(1,len(miniseeds)):
        if len(miniseeds[i]) > 0:
            st += read(miniseeds[i].replace('\r',''))

#Realizamos un plot de 24hrs a partir de los datos de los mini seed
st.filter('bandpass', freqmin=0.1, freqmax=25, corners=2, zerophase=True)
st.plot(type='dayplot', outfile= imgPath)
#Imprimimos la ruta de la imagen en consola para ser leida por node
print(imgPath)
os.remove(filePath)