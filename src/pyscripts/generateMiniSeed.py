from __future__ import print_function
import os
import numpy as np
import glob
import urllib.request
import pandas as pd
import webbrowser
import psycopg2
import pandas as pd
import sys
from datetime import datetime, timedelta
from obspy import UTCDateTime, read, Trace, Stream
import os

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - inicia programa\n')

# params from system
inicio = sys.argv[1] 
fin = sys.argv[2] 
tabla = sys.argv[3]
datafolder = sys.argv[4]
ascii2miniseedfolder = sys.argv[5]

# print(sys.argv)

try:
    con = psycopg2.connect(user = "postgres",
                           password = "proyectos2021",
                           host = "url-dev.cwgwwcfc4cw4.us-east-1.rds.amazonaws.com",
                           port = "5432",
                           database = "incyt")
    cursor = con.cursor()
except (Exception, psycopg2.Error) as error :
    print("Error while connection to PostgreSQL",error)
    raise

try:
    Q = f'''
            SELECT * from public.f_consulta_monitor_vulc('{inicio}', '{fin}', {tabla})
        '''
    print(Q)
    cursor.execute(Q)# where estado = 0
    columns = cursor.description
    df = pd.DataFrame(cursor.fetchall())
    print(df)
except:
    print('ha ocurrido una excepcion Purge 1')
    print("Unexpected error:", sys.exc_info()[0])
    raise

con.commit()
con.close()
print('conn closed')
# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - termina query\n')

now = datetime.now()
nowstr = now.strftime("%Y%m%d_%H%M%S")
txtfiles = [
    datafolder + nowstr + 'mseed1.txt',
    datafolder + nowstr + 'mseed2.txt',
    datafolder + nowstr + 'mseed3.txt',
    datafolder + nowstr + 'mseed4.txt',
]
msfiles = []
rowCount = len(df.index)

count = 0
for index, r in df.iterrows():
    v_tab = ''
    if count == 0:
        dt1 = r.values[9]
        headDate = dt1[0:10]
        headTime = dt1[11:23]
        for i in range(4):
            sen = i + 1
            msfiles.append(datafolder + nowstr + '_GI_ISE2I_0' + str(sen) +'_BDF_D_' + headDate +'T'+ headTime + '.mseed')
            header = 'TIMESERIES GI_ISE2I_0' + str(sen) +'_BDF_D, '+str(rowCount) + ' samples, 55 sps, ' + headDate +'T'+ headTime +', SLIST, INTEGER, Counts\r\n'
            textFile = open(txtfiles[i], "w")
            textFile.write(header)
            textFile.close()
    
    if count % 6 == 0:
        v_tab = '      '
    else:
        v_tab = '        '
    
    for i in range(4):
        textFile = open(txtfiles[i], "a")
        c = i + 1
        t = v_tab + str(r.values[c])
        textFile.write(t)
        textFile.close()
        
    
    if count % 6 == 5:
        for i in range(4):
            textFile = open(txtfiles[i], "a")
            textFile.write('\r\n')
            textFile.close()
    
    count += 1

    if count % 10000 == 0:
        print(datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - ' + 'rows: ' + str(count))

# print(str(df.index))
# print(str(count))

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - inicia escribir miniseed\n')
for i in range(4):
    # print(txtfiles[i])
    os.system('sudo ' + ascii2miniseedfolder + ' ' + txtfiles[i] + ' -o ' + msfiles[i])

for i in range(4):
    print(txtfiles[i] + '\t' + msfiles[i])

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - fin de programa\n')
