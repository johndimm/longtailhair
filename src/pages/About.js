import styles from "@/styles/About.module.css"

const About = () => {
    const credits = [
        {
            img: '/imdb.jpg',
            link: 'https://developer.imdb.com/non-commercial-datasets/',
            text: <div>
                The starting point is the free non-commercial data dump from IMDB.  I wanted a fast way to get not just the list of actors and crew on a single movie but also the previous and next movie each of them made.  That would require many requests from an API.   This datadump from IMDB lets me create a postgres database and a user-defined function that returns the local neighborhood of the collaboration graph in one gulp.
            </div>
        },
        {
            img: '/tmdb.png',
            link: 'https://developer.themoviedb.org/reference/intro/getting-started',
            text: <div>
                For plot summaries, links to posters, and links to trailers.  Unfortunately these posters are mostly new creations rather than the actual posters from the time the movie was released.  They are simpler and easier to see as small images on a TV.  For the "real" posters, I used OMDB.
            </div>
        },
        {
            img: '/amazon-rds.png',
            link: 'https://aws.amazon.com/rds/postgresql/',
            text: <div>
                Amazon provides free postgres hosting for a year.  The 1G tiny server was too slow for this data so I upgraded to a small with 2 Gig.
            </div>
        },
        {
            img: '/vercel.jpg',
            link: 'https://vercel.com/john-dimms-projects',
            text: <div>
                I use vercel to host all my react/nextjs apps.
            </div>
        },
        {
            img: '/omdb.png',
            link: 'https://www.omdbapi.com/',
            text: <div>
                OMDB has original posters, much more interesting than the simplified posters on TMDB.
            </div>
        },
        {
            img: '/github.jpg',
            link: 'https://github.com/johndimm/longtailhair/blob/main/README.md',
            text: <div>
                The code is all here, including the scripts to massage the IMDB data dump.
            </div>
        }
    ]
    const pages = [
        {
            img: '/demo/top-movies.png',
            link: '/',
            text: <div>These are the best movies of all time, according to IMDB users, not critics.  You will probably disagree with the rankings, but they are useful for picking out the movies most people have seen and liked.  Everything is virtually here in this infinite scroll.
                <p><i>I clicked on Pulp Fiction...</i></p>
            </div>
        },
        {
            img: '/demo/pulp-fiction.png',
            link: '/?tconst=tt0110912',
            text: <div>
                In the non-existent Universal Streaming Service I would now be watching the movie.  Instead, I get this page dedicated to the movie.  It lists the cast and crew and all available trailers.  The left column shows the movies made by the same people before, and the right column shows the ones made after. This one shows that John Travolta was making movies about talking dogs before Pulp Fiction revived his career.

                <p><i>I clicked on Quentin Tarantino...</i></p>
            </div>
        },
        {
            img: '/demo/quentin-tarantino.png',
            link: '/?nconst=nm0000233&titletype=movie',
            text: <div>This page lists all his films, as writer, directory, character, or self, in order of popularity


                <p><i>I clicked on "light"...</i></p>

            </div>
        },
        {
            img: '/demo/light-theme.png',
            text: <div>Switching to the light theme.  The dark theme shows only posters.  The light theme shrinks the poster and adds information:  the top four actors, and links to select the date, genres, or go to IMDB for more.

                <p><i>I clicked on the genres Comedy, Drama in one of the movies...</i></p>
            </div>
        },
        {
            img: '/demo/comedy,drama.png',
            link: '/?genres=Comedy,Drama&titletype=movie',
            text: <div>These are the top movies over all time that have both Comedy and Drama in their genres list.
                <p><i>I manipulated the date picker...</i></p>
            </div>
        },
        {
            img: '/demo/comedy,drama-60s.png',
            link: '/?genres=Comedy,Drama&yearstart=1955&yearend=1970&titletype=movie',
            text: 'Looking for movies that might be new to me, I set the year range to the sixties.  All great films, and more as you keep scrolling.'
        }

    ]

    const html = pages.map((page, idx) => {
        return <table key={idx}>
            <tbody><tr>
                <td><a href={page.link}><img src={page.img} /></a></td>
                <td><div className={styles.demo_text} >{page.text}</div></td>
            </tr>
            </tbody></table>
    })

    const htmlCredits = credits.map((page, idx) => {
        return <table key={idx} className={styles.credits}>
            <tbody><tr>
                <td><a href={page.link}><img src={page.img} /></a></td>
                <td><div className={styles.demo_text} >{page.text}</div></td>
            </tr>
            </tbody></table>
    })


    return (
        <div className={styles.demo}>

            <div className={styles.link_to_app}>
                <a href="/">&lt; &lt; back to the app</a>
            </div>

            <h1 className={styles.page_title}><a target='_blank' href='https://longtailhair.vercel.app/'>Long Tail with Collaborations</a></h1>

            <div className={styles.intro}>
                <p>
                    Do you have trouble finding anything you really want to watch on Amazon Prime or Netflix?  Imagine if you will a distant future where there is a <i>Truly Universal Steaming Service</i> that has everything ever made. Sounds crazy but there is a precendent -- Spotify has more or less every audio recording ever made.  The app simulates such a service, up to the point of actually playing the movie.
                </p>

                <p>
                    I used the non-commercial data dump from IMDB as base and added posters, plot summaries, and trailers from The Movie Database and the Open Movie Database.  There are over a million tv and movie titles.
                </p>
                <p>
                    <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/9v4YJd33IIk?si=4v0WJpIfzQSkTnD7" 
                    title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                        mozallowfullscreen="mozallowfullscreen"
                        msallowfullscreen="msallowfullscreen"
                        oallowfullscreen="oallowfullscreen"
                        webkitallowfullscreen="webkitallowfullscreen"></iframe>
                </p>


            </div>
            <h1>Credits</h1>
            <div width="100%">
                {htmlCredits}
            </div>

            <h1 style={{ clear: "both" }}>Tour</h1>
            {html}
        </div>
    )
}

export default About