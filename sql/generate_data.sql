INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (7200::int) + 1)), floor(random() * (100::int) + 21), floor(random() * (200::int) + 1), floor(random() * (35::int) + 1) 
FROM generate_series(1, 2500); 

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (7200::int) + 1)), floor(random() * (999::int) + 30), floor(random() * (600::int) + 201), floor(random() * (35::int) + 1) 
FROM generate_series(1, 10000);

INSERT INTO observation(phenomenontime_begin, result, datastream_id, featureofinterest_id)
SELECT to_timestamp( cast(extract(epoch from current_timestamp) as integer) - floor(random() * (7200::int) + 1)), floor(random() * (30::int) + 1), floor(random() * (600::int) + 801), floor(random() * (35::int) + 1) 
FROM generate_series(1, 10000); 