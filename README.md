[![Build Status](https://app.travis-ci.com/Saknet/SensorObservationBackend.svg?branch=main)](https://app.travis-ci.com/Saknet/SensorObservationBackend)

# SensorObservationBackend
NodeJS backend for retrieving and timeserializing Helsinki SmartCity sensor observation data. CesiumJS frontend tha can be used with this backend is found here https://github.com/Saknet/SensorObservationFrontend

# Usage

Install node modules: 

```
npm install
```

This backend requires running PostgreSQL database management system, configuration details should be setup to .env file. For testing purposes this repository includes dockerized PostgreSQL database. The application also contains dockerized Redis caching service. To start everything:

```
docker-compose up -d --build
```
# UML

Component diagram of the infrastucture and sequence diagram of timeseries creation can be found in [UML](https://github.com/Saknet/SensorObservationBackend/tree/main/UML) subdirectory

# Data model
The schema the database is using is based on the [SensorThings API](https://developers.sensorup.com/docs/#sensorthingsAPISensing) data model. 
SQL scripts needed to create tables, fill tables with test data and generate more test data when the process is running can be found in [sql](https://github.com/Saknet/SensorObservationBackend/tree/main/sql) subdirectory

# Geospatial based matching of CityGML feature and SensorThings featureofinterest
NOTE! This functionality is still at experimental stage containing many errors and bugs. NOTE!

One of the options is to query observations with latitude-longitute coordinates. For this to function the coordinates must be first written to the tileset the frontend is using. This can be done with [Feature Manipulation Engine](https://www.safe.com/fme/), workspaces for FME can be found in [FME](https://github.com/Saknet/SensorObservationBackend/tree/main/FME) subdirectory
