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
-- Name: posters; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.posters (
    tconst text,
    url text
);


ALTER TABLE public.posters OWNER TO johndimm;

--
-- Name: idx_posters; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_posters ON public.posters USING btree (tconst);


--
-- PostgreSQL database dump complete
--

