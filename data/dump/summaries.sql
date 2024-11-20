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
-- Name: summaries; Type: TABLE; Schema: public; Owner: johndimm
--

CREATE TABLE public.summaries (
    id integer NOT NULL,
    wiki_id text,
    tconst text,
    title text,
    plot_summary text,
    plot text
);


ALTER TABLE public.summaries OWNER TO johndimm;

--
-- Name: summaries_id_seq; Type: SEQUENCE; Schema: public; Owner: johndimm
--

ALTER TABLE public.summaries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.summaries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: summaries summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: johndimm
--

ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT summaries_pkey PRIMARY KEY (id);


--
-- Name: idx_summaries; Type: INDEX; Schema: public; Owner: johndimm
--

CREATE INDEX idx_summaries ON public.summaries USING btree (tconst);


--
-- PostgreSQL database dump complete
--

