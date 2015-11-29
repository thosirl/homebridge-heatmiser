var Service = require("../api").homebridge.hap.Service;
var Characteristic = require("../api").homebridge.hap.Characteristic;
var heatmiser = require("/usr/lib/heatmiser/heatmiser");
var request = require("request");

module.exports = {
  accessory: HeatmiserNetmonitor
}

function HeatmiserNetmonitor(log, config) {
  this.log = log;
  this.ip_address  = config["ip_address"];
  this.network_address = config["network_address"];
  this.pin = config["pin"];
}

HeatmiserNetmonitor.prototype = {

  ctof: function(c){
    return c * 1.8000 + 32.00;
  },

  ftoc: function(f){
    return (f-32.0) / 1.8;
  },

  getCurrentHeatingCoolingState: function(callback) {
    this.log("getCurrentHeatingCoolingState");

    //Characteristic.CurrentHeatingCoolingState.OFF = 0;
    //Characteristic.CurrentHeatingCoolingState.HEAT = 1;
    //Characteristic.CurrentHeatingCoolingState.COOL = 2;

    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);

    hm.getInfo(this.network_address);

    hm.on('success', function(data) {
        this.log('getTargetTemperature succeeded!');
	var m = data.dcb.heating_on;
       	var mode;

       	if( m == "cool" ){
       	   	mode = Characteristic.CurrentHeatingCoolingState.COOL;
       	}else if( m == true ){
       		mode = Characteristic.CurrentHeatingCoolingState.HEAT;
        }else{
       		mode = Characteristic.CurrentHeatingCoolingState.OFF;
       	}
       	callback(null, mode);

    }.bind(this));
    hm.on('error', function(e){
	callback(e);
    }.bind(this));
  },

  setTargetHeatingCoolingState: function(targetHeatingCoolingState, callback){
    //Do something

    callback(null,"Auto");//No error
  },

  getTargetHeatingCoolingState: function(callback){
    this.log("getTargetHeatingCoolingState");

    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);

    hm.getInfo(this.network_address)

    hm.on('success', function(data) {
        this.log('getTargetHeatingCoolingState succeeded!');
        var m = data.dcb.heating_on;
        var mode;

        if( m == "cool" ){
          mode = Characteristic.CurrentHeatingCoolingState.COOL;
        }else if( m == true ){
          mode = Characteristic.CurrentHeatingCoolingState.HEAT;
        }else{
          mode = Characteristic.CurrentHeatingCoolingState.OFF;
        }

        callback(null, mode);
    }.bind(this));
    hm.on('error', function(e){
        callback(e);
    }.bind(this));

  },

  getCurrentTemperature: function(callback) {
    this.log("getCurrentTemperature");

    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);

    hm.getInfo(this.network_address);

    hm.on('success', function(data) {
        this.log('getCurrentTemperature succeeded!');

	var c = data.dcb.remote_air_temp

        callback(null, c);
    }.bind(this));
    hm.on('error', function(e){
        callback(e);
    }.bind(this));
  },

  getTargetTemperature: function(callback) {
    this.log("getTargetTemperature");

    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);

    hm.getInfo(this.network_address);
    hm.on('success', function(data) {
        this.log('getTargetTemperature succeeded!');
        var target_temp = data.dcb.set_room_temp

        callback(null, target_temp);
    }.bind(this));
    hm.on('error', function(e){
        callback(e);
    }.bind(this));

  },

  setTargetTemperature: function(targetTemperature, callback){
    this.log("setTargetTemperature");
    this.log(targetTemperature);
    var dcb1 = {
      heating: {
        target: targetTemperature
        }
      }

    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);
    hm.write_device(this.network_address,dcb1);
    hm.on('success', function(data){
	callback(null);
    }.bind(this));
    hm.on('error', function(e){
        callback(e);
    }.bind(this));
  },

  getTemperatureDisplayUnits: function(callback) {
    this.log("getTemperatureDisplayUnits");
    var hm = new heatmiser.Netmonitor(this.ip_address, this.pin);
    hm.getInfo(this.network_address);

    hm.on('success', function(data) {
        this.log('setTemperatureDisplayUnits succeeded!');
        var units = data.dcb.temp_format

        callback(null, units);
    }.bind(this));
    hm.on('error', function(e){
        callback(e);
    }.bind(this));
  },

  setTemperatureDisplayUnits: function(displayUnits, callback){
    this.log("setTemperatureDisplayUnits");
    this.log(displayUnits);
    callback(null );

  },

  getName: function(callback) {
    this.log("getName");

    callback(null, this.name);
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Heatmiser")
      .setCharacteristic(Characteristic.Model, "Heatmiser Netmonitor")
      .setCharacteristic(Characteristic.SerialNumber, "HMNMHB-1");

    var thermostatService = new Service.Thermostat();

    thermostatService.getCharacteristic( Characteristic.CurrentHeatingCoolingState ).on( 'get', this.getCurrentHeatingCoolingState.bind(this) );

    thermostatService.getCharacteristic( Characteristic.TargetHeatingCoolingState ).on( 'set', this.setTargetHeatingCoolingState.bind(this) );
    thermostatService.getCharacteristic( Characteristic.TargetHeatingCoolingState ).on( 'get', this.getTargetHeatingCoolingState.bind(this) );

    thermostatService.getCharacteristic( Characteristic.CurrentTemperature ).on( 'get', this.getCurrentTemperature.bind(this) );

    thermostatService.getCharacteristic( Characteristic.TargetTemperature ).on( 'set', this.setTargetTemperature.bind(this) );
    thermostatService.getCharacteristic( Characteristic.TargetTemperature ).on( 'get', this.getTargetTemperature.bind(this) );

    thermostatService.getCharacteristic( Characteristic.TemperatureDisplayUnits ).on( 'set', this.setTemperatureDisplayUnits.bind(this) );
    thermostatService.getCharacteristic( Characteristic.TemperatureDisplayUnits ).on( 'get', this.getTemperatureDisplayUnits.bind(this) );

    //thermostatService.getCharacteristic( new Characteristic.Name() ).on( 'get', this.getName.bind(this) );


    return [informationService, thermostatService];
  }
};
