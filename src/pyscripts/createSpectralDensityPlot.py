from obspy import read
from obspy.signal import PPSD
from obspy.io.xseed import Parser

imgPath = '/home/litedev/Downloads/tempFolder/pruebaDensidadEspectral.png'
filePath = '/home/litedev/Downloads/tempFolder/densidadEspectral.txt'


st = read("https://examples.obspy.org/BW.KW1..EHZ.D.2011.037")
parser = Parser("https://examples.obspy.org/dataless.seed.BW_KW1")
ppsd = PPSD(st[0].stats, metadata=parser)
ppsd.add(st)

st = read("https://examples.obspy.org/BW.KW1..EHZ.D.2011.038")
ppsd.add(st)

ppsd.plot()
