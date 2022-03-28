
CREATE EXTENSION postgis_raster;
-- Enable Topology∂∂
CREATE EXTENSION postgis_sfcgal;
-- rule based standardizer
CREATE EXTENSION address_standardizer;
-- example rule data set
CREATE EXTENSION address_standardizer_data_us;

ALTER EXTENSION postgis UPDATE;
ALTER EXTENSION postgis_topology UPDATE;
ALTER EXTENSION postgis_tiger_geocoder UPDATE;

/* Create Tables */

CREATE TABLE IF NOT EXISTS datastream (
	id bigserial NOT NULL,
	name text,
	description text,
	observationtype text,
	unitofmeasurement text NOT NULL,
	observedarea text,
	phenomenontime_begin timestamp,
	phenomenontime_end timestamp,
	resulttime_begin timestamp,
	resulttime_end timestamp,
	sensor_id bigint,
	thing_id bigint,
	observedproperty_id bigint,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS featureofinterest (
	id bigserial NOT NULL,
    name text,
	description text,
    encodingtype text,
    feature geometry NOT NULL,
    properties jsonb,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS historicallocation  (
	id bigserial NOT NULL,
	time timestamp,
	location_id bigint,
	thing_id bigint,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS location (
	id bigserial NOT NULL,
    name text,
	description text,
    encodingtype text,
    location jsonb,
    properties jsonb,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS observation (
	id bigserial NOT NULL,
	phenomenontime_begin timestamp NOT NULL,
	phenomenontime_end timestamp,
	resulttime timestamp,
	result text NOT NULL,
	resultquality jsonb,
	validtime_begin timestamp,
	validtime_end timestamp,
	parameters text,
	datastream_id bigint NOT NULL,
	featureofinterest_id bigint NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS observedproperty (
	id bigserial NOT NULL,
    name text,
    definition text,
	description text,
    properties jsonb,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sensor (
	id bigserial NOT NULL,
    name text,
	description text,
    encodingtype text,  
    metadata jsonb,
    properties jsonb,  
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS thing (
	id bigserial NOT NULL,
    name text,
	description text,
    properties jsonb,  
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS thingstolocation (
	id bigserial NOT NULL,
    thing_id bigint NOT NULL,
	location_id bigint NOT NULL,
    PRIMARY KEY (id)
);
