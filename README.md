# homebridge-heatmiser
Heatmiser integration with Homebridge

This is an Accessory plugin for Nick Farina's Homebridge implementation (https://github.com/nfarina/homebridge)

Based heavily on PiThermostat from Jeff McFadden (https://github.com/jeffmcfadden/homebridge-pi-thermostat-accessory)
Uses Carlos Sanchez Heatmiser Node library (https://github.com/carlossg/heatmiser-node), plus my own Netmonitor extension (https://github.com/thosirl/heatmiser-node)

I havent built this as a standalone plugin, so I just drop the .js files into homebridge-legacy-plugins/accessories directory.

Still quite experimental - with the Netmonitor implementation this should ideally move to a Platform instead of multiple individual Accessories.
Reading current mode, current temp, setting target temp, display units are all support, and getting/setting temperate via Siri works well. 

I have added a Heatmiser Wifi accessory here, but I only have Netmonitor so have no way of testing this. A Neo Accessory is also pretty feasible here thanks to Carlos' work.

In terms of config this works per stat on Netmonitor

    {
      "accessory": "HeatmiserNetmonitor",
      "ip_address": "your_netmonitor_ip",
      "pin": your_pin,
      "network_address": 1, // Network Address of the Stat you want to talk to
      "name": "Kitchen Thermostat", // This name is for Siri / Homekit, doesnt need to match Heatmiser name
      "room": "Kitchen" // as above
    },

The Wifi accessory should be something like below:
    {
      "accessory": "HeatmiserWifi",
      "ip_address": "your_netmonitor_ip",
      "pin": your_pin,
      "name": "Kitchen Thermostat",
      "room": "Kitchen"
    },
