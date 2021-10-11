import obspy
from obspy.core.inventory import Inventory, Network, Station, Channel, Site
from obspy.clients.nrl import NRL

# SourceName: "Net_Sta_Loc_Chan_Qual"
# GI_e1ms1I_01_BDF_D
inv = Inventory(
    # We'll add networks later.
    networks=[],
    # The source should be the id whoever create the file.
    source="ObsPy-Tutorial")

net = Network(
    # This is the network code according to the SEED standard.
    code="GI",
    # A list of stations. We'll add one later.
    stations=[],
    description="Estacion INCYT.",
    # Start-and end dates are optional.
    start_date=obspy.UTCDateTime(2021, 10, 1))

sta = Station(
    # This is the station code according to the SEED standard.
    code="e1ms1I",
    latitude=1.0,
    longitude=2.0,
    elevation=345.0,
    creation_date=obspy.UTCDateTime(2021, 10, 1),
    site=Site(name="First station"))

cha = Channel(
    # This is the channel code according to the SEED standard.
    code="BDF",
    # This is the location code according to the SEED standard.
    location_code="01",
    # Note that these coordinates can differ from the station coordinates.
    latitude=1.0,
    longitude=2.0,
    elevation=345.0,
    depth=10.0,
    azimuth=0.0,
    dip=-90.0,
    sample_rate=55)


nrl = NRL()

response = nrl.get_response( # doctest: +SKIP
    sensor_keys=['Streckeisen', 'STS-1', '360 seconds'],
    datalogger_keys=['REF TEK', 'RT 130 & 130-SMA', '1', '200'])


# Now tie it all together.
cha.response = response
sta.channels.append(cha)
net.stations.append(sta)
inv.networks.append(net)

# station inventory
inv.write("/home/ubuntu/Downloads/tempData/station.xml", format="stationxml", validate=True)