\echo 'Delete and recreate puphub db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE puphub;
CREATE DATABASE puphub;
\connect puphub

\i puphub-schema.sql
\i puphub-seed.sql

