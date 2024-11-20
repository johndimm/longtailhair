--
-- PostgreSQL database dump
--

-- Dumped from database version 14.14 (Homebrew)
-- Dumped by pg_dump version 14.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tmdb; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.tmdb (
    tconst text,
    tmdb_id integer,
    poster_path text,
    backdrop_path text,
    overview text
);


ALTER TABLE public.tmdb OWNER TO johndimm;

--
-- Name: idx_tmdb; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE UNIQUE INDEX idx_tmdb ON public.tmdb USING btree (tconst);


--
-- PostgreSQL database dump complete
--

