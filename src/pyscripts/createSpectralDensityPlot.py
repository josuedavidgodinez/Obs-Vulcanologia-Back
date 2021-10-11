from obspy import read, read_inventory
from obspy.signal import PPSD
from obspy.io.xseed import Parser
import matplotlib
matplotlib.use('Agg')

st = read('/home/ubuntu/Downloads/obspydata/20211007_230104_GI_ise1I_02_BDF_D_2021-10-01T10:02:00.009000.mseed')
inv = read_inventory('/home/ubuntu/Downloads/tempData/station.xml')
ppsd = PPSD(st[0].stats, metadata=inv)
ppsd.add(st)

st = read('/home/ubuntu/Downloads/obspydata/20211007_230108_GI_ise1I_02_BDF_D_2021-10-01T10:12:00.012100.mseed')
ppsd.add(st)

st = read('/home/ubuntu/Downloads/obspydata/20211007_230112_GI_ise1I_02_BDF_D_2021-10-01T10:22:00.015200.mseed')
ppsd.add(st)

st = read('/home/ubuntu/Downloads/obspydata/20211007_230119_GI_ise1I_02_BDF_D_2021-10-01T10:32:00.024300.mseed')
ppsd.add(st)

st = read('/home/ubuntu/Downloads/obspydata/20211007_230126_GI_ise1I_02_BDF_D_2021-10-01T10:42:00.123200.mseed')
ppsd.add(st)

st = read('/home/ubuntu/Downloads/obspydata/20211007_230133_GI_ise1I_02_BDF_D_2021-10-01T10:52:00.136200.mseed')
ppsd.add(st)


ppsd.plot("/home/ubuntu/Downloads/obspydata/pruebaDensidadEspectral.png")
