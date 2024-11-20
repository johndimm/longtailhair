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
-- Name: name_basics_ex; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.name_basics_ex (
    nconst text,
    primaryname text,
    birthyear integer,
    deathyear integer,
    primaryprofession text,
    knownfortitles text
);


ALTER TABLE public.name_basics_ex OWNER TO johndimm;

--
-- Name: idx_nbe_nconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_nbe_nconst ON public.name_basics_ex USING btree (nconst);


--
-- PostgreSQL database dump complete
--

