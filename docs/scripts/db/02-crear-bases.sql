-- ============================================================
-- Script 02: Crear bases de datos del sistema FELCN
-- Ejecutar como: sudo -u postgres psql -f 02-crear-bases.sql
-- ============================================================

-- Base principal: autenticación, usuarios, estructura
SELECT 'CREATE DATABASE felcn_auth_v3'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'felcn_auth_v3') \gexec

-- Asignación de casos
SELECT 'CREATE DATABASE a_felcn_asignacion_caso'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'a_felcn_asignacion_caso') \gexec

-- Sistema de Inteligencia I
SELECT 'CREATE DATABASE a_felcn_sii'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'a_felcn_sii') \gexec

-- Sistema de Inteligencia III
SELECT 'CREATE DATABASE felcn_siii'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'felcn_siii') \gexec

-- Registro de sospechosos
SELECT 'CREATE DATABASE a_felcn_sospechoso'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'a_felcn_sospechoso') \gexec

-- Verificar bases creadas
\l felcn_auth_v3 a_felcn_asignacion_caso a_felcn_sii felcn_siii a_felcn_sospechoso
