import styles from "@/styles/Demo.module.css"

const Demo = () => {
    const pages = [
        {
            img: '/demo/top-movies.png',
            text: <div>These are the best movies of all time, according to imdb users, not critics.  You will probably disagree with the rankings, but they are useful for picking out the movies most people have seen and liked.  Everything is virtually here in this infinite scroll.
                <p><i>I clicked on Pulp Fiction...</i></p>
            </div>
        },
        {
            img: '/demo/pulp-fiction.png',
            text: <div>
                In the non-existent Universal Streaming Service I would now be watching the movie.  Instead, I get this page dedicated to the movie.  It lists the cast and crew and all available trailers.  The left column shows the movies made by the same people before, and the right column shows the ones made after. This one shows that John Travolta was making movies about talking dogs before Pulp Fiction revived his career.
            
                <p><i>I clicked on Quentin Tarantino...</i></p>
            </div>
        },
        {
            img: '/demo/quentin-tarantino.png',
            text: <div>This page lists all his films, as writer, directory, character, or self, in order of popularity

   
            <p><i>I clicked on "light"...</i></p>

            </div>
        },
        {
            img: '/demo/light-theme.png',
            text: <div>Switching to the light theme.  The dark theme shows only posters.  The light theme shrinks the poster and adds information:  the top four actors, and links to select the date, genres, or go to imdb for more.
            
            <p><i>I clicked on the genres Comedy, Drama in one of the movies...</i></p>
            </div>
        },
        {
            img: '/demo/comedy,drama.png',
            text: <div>These are the top movies over all time that have both Comedy and Drama in their genres list.
               <p><i>I manipulated the date picker...</i></p>
            </div>
        },
        {
            img: '/demo/comedy,drama-60s.png',
            text: 'Looking for movies that might be new to me, I set the year range to the sixties.  All great films, and more as you keep scrolling.'
        }

    ]

    const html = pages.map((page, idx) => {
        return <table key={idx}>
            <tbody><tr>
                <td><img src={page.img} /></td>
                <td><div className={styles.demo_text} >{page.text}</div></td>
            </tr>
            </tbody></table>
    })

    return (
        <div className={styles.demo}>
            <h1 className={styles.page_title}><a target='_blank' href='https://longtailhair.vercel.app/'>Long Tail</a> Demo</h1>
            <div className={styles.intro}>
                <p>
                    

            I wrote this app because I have trouble finding anything I really want to watch on Amazon Prime or Netflix.  Imagine if you will a distant future where there is a <i>Truly Universal Steaming Service</i> that has everything ever made. Sounds crazy but there is a precendent -- Spotify has every audio recording ever made.  The app simulates such a service, up to the point of actually playing the movie.
            </p>

            <p>
            I used the non-commercial data dump from imdb as base and added posters, plot summaries, and trailers from The Movie Database.  There are over a million tv and movie titles.
            </p>

            </div>
            {html}
        </div>
    )
}

export default Demo