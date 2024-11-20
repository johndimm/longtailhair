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
-- Name: careers; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.careers (
    tconst text,
    nconst text,
    ordering integer,
    category text,
    characters text,
    career_order bigint
);


ALTER TABLE public.careers OWNER TO johndimm;

--
-- Name: idx_careers_nconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_careers_nconst ON public.careers USING btree (nconst);


--
-- Name: idx_careers_tconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_careers_tconst ON public.careers USING btree (tconst);


--
-- PostgreSQL database dump complete
--

