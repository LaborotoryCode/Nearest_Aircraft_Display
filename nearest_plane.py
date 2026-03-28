#!/usr/bin/python3
import json
import math
import os
from FlightRadar24 import FlightRadar24API

MY_LAT = #Insert here
MY_LON = #Insert here
RADIUS_KM = 50

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def main():
    fr = FlightRadar24API()

    bounds = fr.get_bounds_by_point(MY_LAT, MY_LON, RADIUS_KM * 1000)
    flights = fr.get_flights(bounds=bounds)

    if not flights:
        print("No flights found.")
        return

    nearest = min(flights, key=lambda f: haversine(MY_LAT, MY_LON, f.latitude, f.longitude))
    distance = haversine(MY_LAT, MY_LON, nearest.latitude, nearest.longitude)

    flight_info = {
        "callsign": nearest.callsign or "",
        "aircraft": nearest.aircraft_code or "",
        "origin": nearest.origin_airport_iata or "",
        "destination": nearest.destination_airport_iata or "",
        "altitude_ft": nearest.altitude,
        "speed_knots": nearest.ground_speed,
        "distance_km": round(distance, 2),
    }

    print(f"Nearest: {flight_info['callsign']}")
    print(f"Route: {flight_info['origin']} -> {flight_info['destination']}")
    print(f"Aircraft: {flight_info['aircraft']}")
    print(f"Alt: {flight_info['altitude_ft']}ft  Speed: {flight_info['speed_knots']}kts")
    print(f"Distance: {flight_info['distance_km']}km")

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'latest_flight.json')
    with open(out, 'w') as f:
        json.dump(flight_info, f, indent=2)
    print(f"Saved to {out}")

if __name__ == "__main__":
    main()