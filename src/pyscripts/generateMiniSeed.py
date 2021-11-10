from __future__ import print_function
import os
import numpy as np
import glob
import urllib.request
import pandas as pd
import webbrowser
from pandas.core.base import SelectionMixin
import psycopg2
import pandas as pd
import sys
from datetime import date, datetime, timedelta
from obspy import UTCDateTime, read, Trace, Stream
import os
import uuid

# IMPORTANTE: brindar permisos al ejecutable de ascii2miniseed para que genere los archivos.

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - inicia programa\n')

# params from system
inicio = sys.argv[1]
fin = sys.argv[2]
tabla = sys.argv[3]
datafolder = sys.argv[4]
ascii2miniseedfolder = sys.argv[5]
tempFolder = sys.argv[6]

# inicio = '2021-09-24 00:00:00'
# fin = '2021-09-24 00:12:00'
# tabla = 'polls_ise1_infra'
# datafolder = '/home/litedev/Downloads/obspydata3/'
# ascii2miniseedfolder = '/home/litedev/Documents/virtualenv/ascii2mseed/ascii2mseed'
# tempFolder = '/home/litedev/Downloads/tempFolder/'
#query para obtener datos de las estaciones
def getData():
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
    tmp_df = pd.DataFrame()
    try:
        Q = f'''
                SELECT
                    fecha_sistema,
                    cast(infrasonido_1 as int) infrasonido_1,
                    cast(infrasonido_2 as int) infrasonido_2,
                    cast(infrasonido_3 as int) infrasonido_3,
                    cast(infrasonido_4 as int) infrasonido_4
                FROM {tabla}
                WHERE fecha_sistema >= '{inicio}'
                AND fecha_sistema < '{fin}'
                ORDER BY fecha_sistema ASC
            '''
        # Q = f'''
        #         SELECT
        #             fecha_sistema,
        #             cast(infrasonido_1 as int) infrasonido_1,
        #             cast(infrasonido_2 as int) infrasonido_2,
        #             cast(infrasonido_3 as int) infrasonido_3,
        #             cast(infrasonido_4 as int) infrasonido_4
        #         FROM polls_ise1_infra
        #         WHERE fecha_sistema >= '2021-09-24 00:00:00'
        #         AND fecha_sistema < '2021-09-24 00:12:00'
        #         UNION
        #         SELECT
        #             fecha_sistema,
        #             cast(infrasonido_1 as int) infrasonido_1,
        #             cast(infrasonido_2 as int) infrasonido_2,
        #             cast(infrasonido_3 as int) infrasonido_3,
        #             cast(infrasonido_4 as int) infrasonido_4
        #         FROM polls_ise1_infra
        #         WHERE fecha_sistema >= '2021-09-24 00:12:30'
        #         AND fecha_sistema < '2021-09-24 00:22:00'
        #         UNION
        #         SELECT
        #             fecha_sistema,
        #             cast(infrasonido_1 as int) infrasonido_1,
        #             cast(infrasonido_2 as int) infrasonido_2,
        #             cast(infrasonido_3 as int) infrasonido_3,
        #             cast(infrasonido_4 as int) infrasonido_4
        #         FROM polls_ise1_infra
        #         WHERE fecha_sistema >= '2021-09-24 00:23:30'
        #         AND fecha_sistema < '2021-09-24 00:25:00'
        #         ORDER BY fecha_sistema ASC
        #     '''
        cursor.execute(Q)# where estado = 0
        tmp_df = pd.DataFrame(cursor.fetchall())
        print(tmp_df)
    except:
        print('ha ocurrido una excepcion Purge 1')
        print("Unexpected error:", sys.exc_info()[0])
        raise

    con.commit()
    con.close()
    return tmp_df

df = getData()
# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - termina query\n')

class Grupo:
    def __init__(self) -> None:
        self.rutas_txt = ['','','','']
        self.rutas_ms = ['','','','']
        self.fecha_inicio = datetime.now()
        self.fecha_final = datetime.now()
        self.sensor = [[],[],[],[]]
        self.cuenta = 0
    
    def addRow(self,mediciones):
        for i in range(0,4):
            self.sensor[i].append(mediciones[i])
        self.cuenta += 1
    
    def getSPS(self):
        return 55
        diferencia = self.fecha_final - self.fecha_inicio
        promedio = self.cuenta / diferencia.total_seconds()
        return int(round(promedio))

    def getStamp(self):
        fecha = self.fecha_inicio.strftime("%Y-%m-%d")
        hora = self.fecha_inicio.strftime("%H:%M:%S.%f")
        return fecha + 'T' + hora

grupos = []
grupoActual = Grupo()

init = datetime.now()
ultimaFecha = init

# diferencia de tiempo entre datos para identificar gaps en las gráficas. 
for index, r in df.iterrows():
    fechaActual = r.values[0]
    mediciones = [r[1], r[2], r[3], r[4]]

    if ultimaFecha == init:
        grupoActual.fecha_inicio = fechaActual
        grupoActual.addRow(mediciones)
    else:
        diferencia1 = fechaActual - grupoActual.fecha_inicio
        diferencia2 = fechaActual - ultimaFecha
        diffMax = 600 # 10 minutos
        corteMax = 60 # 1 minuto

        sobreLimite = diferencia1.total_seconds() > diffMax
        hayCorte = diferencia2.total_seconds() > corteMax

        if (hayCorte or sobreLimite):
            grupoActual.fecha_final = ultimaFecha
            grupos.append(grupoActual)
            grupoActual = Grupo()
            grupoActual.fecha_inicio = fechaActual
        
        grupoActual.addRow(mediciones)
    
    ultimaFecha = fechaActual

if grupoActual.cuenta > 0:
    grupoActual.fecha_final = ultimaFecha
    grupos.append(grupoActual)
    grupoActual = 0

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - termina agrupacion\n')
df = 0

#generación de encabezados de archivos txt y las columnas. Se agrega diferentes tabulaciones.
estacion = tabla.split('_')[1]
for g in grupos:
    now = datetime.now()
    nowstr = now.strftime("%Y%m%d_%H%M%S")
    for i in range(0,4):
        sen = i + 1
        g.rutas_txt[i] = datafolder + nowstr + '_' + estacion + '_' + 'mseed' + str(sen) + '.txt'
        g.rutas_ms[i] = datafolder + nowstr + '_GI_' + estacion + 'I_0' + str(sen) + '_BDF_D_' + g.getStamp() + '.mseed'
        header = 'TIMESERIES GI_' + estacion + 'I_0' + str(sen) +'_BDF_D, '+str(g.cuenta) + ' samples, ' + str(g.getSPS()) + ' sps, ' + g.getStamp() +', SLIST, INTEGER, Counts\r\n'
        textFile = open(g.rutas_txt[i], "w")
        textFile.write(header)
        textFile.close()
    
    count = 0
    for j in range(0, g.cuenta):
        v_tab = ''
        if count % 6 == 0:
            v_tab = '      '
        else:
            v_tab = '        '
        
        for i in range(4):
            textFile = open(g.rutas_txt[i], "a")
            valor = g.sensor[i][j]
            text = v_tab + str(valor)
            textFile.write(text)
            textFile.close()
    
        if count % 6 == 5:
            for i in range(4):
                textFile = open(g.rutas_txt[i], "a")
                textFile.write('\r\n')
                textFile.close()
        
        count += 1

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - termina archivos txt\n')

# asignación de id de archivo 
uniqueId = uuid.uuid4().hex + '_' + datetime.now().strftime("%Y%d%m%H%M%S")
randFileName = tempFolder + uniqueId + '.txt'

# IMPORTANTE: brindar permisos al ejecutable de ascii2miniseed para que genere los archivos.
# generación de archivos miniseed
for g in grupos:
    for i in range(4):
        os.system('sudo ' + ascii2miniseedfolder + ' ' + g.rutas_txt[i] + ' -o ' + g.rutas_ms[i])
        allInfo = g.rutas_ms[i] + '\t'
        allInfo += g.fecha_inicio.strftime("%Y-%m-%d %H:%M:%S.%f") + '\t'
        allInfo += g.fecha_final.strftime("%Y-%m-%d %H:%M:%S.%f") + '\t'
        allInfo += g.fecha_inicio.strftime("%Y%m%d_%H%M%S") + '_' +estacion + '_s' + str(i+1) + '\t'
        allInfo += estacion + '\t'
        allInfo += str(i+1) + '\t'
        allInfo += g.rutas_txt[i]

        with open(randFileName, 'a') as tempFile:
            tempFile.write(allInfo + '\n')

# se imprime nombre de archivo que será respuesta para el API
print(randFileName)

# print('\n ' + datetime.now().strftime("%Y-%d-%m %H:%M:%S") + ' - termina archivos mseed\n')

# print('end of script')
