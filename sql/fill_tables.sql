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

INSERT INTO datastream(unitofmeasurement)
SELECT 
  (
    CASE (RANDOM() * 5)::INT
      WHEN 0 THEN 'http://finto.fi/ucum/en/page/r418'
      WHEN 1 THEN 'http://finto.fi/ucum/en/page/r73'
      WHEN 2 THEN 'http://finto.fi/ucum/en/page/r63'
      WHEN 3 THEN 'http://finto.fi/ucum/en/page/r61'
      WHEN 4 THEN 'http://finto.fi/ucum/en/page/r59'
      WHEN 5 THEN 'http://finto.fi/ucum/en/page/r57'                  
    END
  )
FROM GENERATE_SERIES(1, 1000);

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (604800::int) + 1)), floor(random() * (100::int) + 1), floor(random() * (1000::int) + 1), floor(random() * (11::int) + 1) 
FROM generate_series(1, 100000);                           