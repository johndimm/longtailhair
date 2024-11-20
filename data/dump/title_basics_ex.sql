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
-- Name: title_basics_ex; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.title_basics_ex (
    tconst text,
    titletype text,
    primarytitle text,
    originaltitle text,
    isadult boolean,
    startyear integer,
    endyear integer,
    runtimeminutes integer,
    genres text,
    genres_array text[],
    averagerating double precision,
    numvotes integer,
    popularity double precision,
    actors_array text[],
    fulltext tsvector
);


ALTER TABLE public.title_basics_ex OWNER TO johndimm;

--
-- Name: idx_tbe_actors_array; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_actors_array ON public.title_basics_ex USING gin (actors_array);


--
-- Name: idx_tbe_fulltext; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_fulltext ON public.title_basics_ex USING gin (fulltext);


--
-- Name: idx_tbe_genres_array; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_genres_array ON public.title_basics_ex USING gin (genres_array);


--
-- Name: idx_tbe_pop; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_pop ON public.title_basics_ex USING btree (popularity);


--
-- Name: idx_tbe_tconst; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_tconst ON public.title_basics_ex USING btree (tconst);


--
-- Name: idx_tbe_titletype; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_titletype ON public.title_basics_ex USING btree (titletype);


--
-- Name: idx_tbe_year; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_tbe_year ON public.title_basics_ex USING btree (startyear);


--
-- PostgreSQL database dump complete
--

