INSERT INTO featureofinterest (name, description, feature) 
VALUES('lumo', 'redi tower 3', '{ "gmlid": "BID_3593141b-e49f-4aac-aa8b-ff663df696b5", "ratu": "68654" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('majakka', 'redi tower 1', '{ "gmlid": "BID_4f77b0c3-812f-470b-b305-7c4807e2934f", "ratu": "68654" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('loisto', 'redi tower 2', '{ "gmlid": "BID_8ca5150a-fd1c-4047-a038-4d39e8a81fe1", "ratu": "68654" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('58302', 'apartment building', '{ "gmlid": "BID_6f2f9ec4-bbdc-4da6-a41a-2c54ff7ee150", "ratu": "58302" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('58145', 'apartment building', '{ "gmlid": "BID_0a3a6049-77d6-4c9e-8486-c3469fe49cc7", "ratu": "58145" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('60684', 'apartment building', '{ "gmlid": "BID_d3ce9c37-e52e-44c4-a1fe-5b5e23e23ffb", "ratu": "60684" }');

INSERT INTO featureofinterest(name, description, feature) 
VALUES('60683', 'apartment building', '{ "gmlid": "BID_aaf93473-8f29-4ff0-8571-a40875316561", "ratu": "60683" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('61059', 'school', '{ "gmlid": "BID_13923f39-b605-4f81-9173-c14c21630685", "ratu": "61059" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('61059', 'daycare', '{ "gmlid": "BID_0f7ae73a-0cd8-4fb8-8f79-fb3caa6c79af", "ratu": "61059" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('63640', 'health center', '{ "gmlid": "BID_3224c543-6e8e-4e0d-a828-ca0742564036", "ratu": "63640" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('59766', 'redi', '{ "gmlid": "BID_d6f03f71-d260-4525-9073-dc0cde28575e", "ratu": "59766" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'office, under construction', '{ "gmlid": "BID_699d39fa-9ee2-446c-a019-4b1efb67b42a", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'redi shopping center', '{ "gmlid": "BID_49a3253a-ffbe-49a7-a7bd-a6fdc0fd7f6e", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_6e5c165d-9eb9-4b3d-9a4b-76958e13b4df", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_d1ebc713-dbbb-4e42-95d4-4b00e70dc67f", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_45df470a-9e9f-4bb4-82b0-d7b2874f97a6", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_f76c9ab3-beb9-4be5-894b-0099d8b4303c", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_0b3e6442-6beb-4d51-9da5-2f92c5264482", "ratu": "n/a" }');

INSERT INTO featureofinterest (name, description, feature) 
VALUES('n/a', 'apartment building', '{ "gmlid": "BID_e89fde40-8ae2-4f20-a409-62b129b13f72", "ratu": "n/a" }');


INSERT INTO datastream(unitofmeasurement)
SELECT 'http://finto.fi/ucum/en/page/r418'
FROM GENERATE_SERIES(1, 200);

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (604800::int) + 1)), floor(random() * (100::int) + 21), floor(random() * (200::int) + 1), floor(random() * (19::int) + 1) 
FROM generate_series(1, 50000); 

INSERT INTO datastream(unitofmeasurement)
SELECT 
  (
    CASE (RANDOM() * 2)::INT
      WHEN 0 THEN 'http://finto.fi/ucum/en/page/r63'
      WHEN 1 THEN 'http://finto.fi/ucum/en/page/r59'
      WHEN 2 THEN 'http://finto.fi/ucum/en/page/r57'                  
    END
  )
FROM GENERATE_SERIES(1, 600);

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (604800::int) + 1)), floor(random() * (999::int) + 30), floor(random() * (600::int) + 201), floor(random() * (19::int) + 1) 
FROM generate_series(1, 200000);

INSERT INTO datastream(unitofmeasurement)
SELECT 
  (
    CASE (RANDOM() * 2)::INT
      WHEN 0 THEN 'http://finto.fi/ucum/en/page/r73'
      WHEN 1 THEN 'http://finto.fi/ucum/en/page/r61'
      WHEN 2 THEN 'http://finto.fi/mesh/en/page/D052638'                  
    END
  )
FROM GENERATE_SERIES(1, 600);

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (604800::int) + 1)), floor(random() * (30::int) + 1), floor(random() * (600::int) + 801), floor(random() * (19::int) + 1) 
FROM generate_series(1, 200000); 