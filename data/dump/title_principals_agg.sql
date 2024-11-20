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
-- Name: title_principals_agg; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.title_principals_agg (
    tconst text,
    nconst text,
    ordering integer,
    category text,
    characters text
);


ALTER TABLE public.title_principals_agg OWNER TO johndimm;

--
-- Name: idx_tpa_nconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tpa_nconst ON public.title_principals_agg USING btree (nconst);


--
-- Name: idx_tpa_tconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tpa_tconst ON public.title_principals_agg USING btree (tconst);


--
-- PostgreSQL database dump complete
--

