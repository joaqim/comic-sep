import { render } from 'react-dom'
import React, { useEffect, useState, Image, useRef} from 'react';
import { hot } from 'react-hot-loader';
import Img from 'react-image'
import ReactImageAppear from 'react-image-appear'
import './App.css';

//import axios from 'axios'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

//import { Swipeable, defineSwipe } from 'react-touch'

import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useGesture } from 'react-with-gesture'
//import './styles.css'

import tapOrClick from 'react-tap-or-click'
import { useSwipeable } from 'react-swipeable'

import comics_json_LOCAL from './comic.json'
//var comics_json_LOCAL = NaN

//import { fetchJSON } from './utils/comicUtils.js'

interface Number {
    pad: () => string;
    str: () => string;
}

function pad(val : number) {
    var s = String(val)
    const size = 3;
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

Number.prototype.pad = function() : string {
    var s = String(this);
    const size = 3;
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

Number.prototype.str = function() : string {
    return String(this)
}

const pages = [
    'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

let Viewpager = () => {
    const index = useRef(0)

    const [props, set] = useSprings(pages.length, i => ({ x: i * window.innerWidth, sc: 1, display: 'block' }))

    const bind = useGesture(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
        if (down && distance > window.innerWidth / 7)
            cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
        set(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0)
            const sc = down ? 1 - distance / window.innerWidth / 2 : 1
            return { x, sc, display: 'block' }
        })
    })

    return props.map(({ x, display, sc }, i) => (
            <animated.div {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
            <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
            </animated.div>
    ))
}

let App = () => {
	const index = useRef(0)

    const [props, set] = useSprings(pages.length, i => ({ x: i * window.innerWidth, sc: 1, display: 'block' }))
    const bind = useGesture(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
        if (down && distance > window.innerWidth / 7)
            cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
        set(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0)
            const sc = down ? 1 - distance / window.innerWidth / 2 : 1
            return { x, sc, display: 'block' }
        })
    })
   
    const api_root = "https://comic-editor.s3.eu-north-1.amazonaws.com"
    const comic_name = "One Piece - Digital Colored Comics"

    const [comics_json, setComicsJson] = useState(comics_json_LOCAL)
    const [comics_labels, setComicsLabels] = useState([])
    const [comic_data, setComicData] = useState([])
    const [comic_images, setComicImages] = useState([])

    const [chapter_nr, setChapterNr] = useState(512)
    const [chapter_name, setChapterName] = useState()
    const [page_nr, setPageNr] = useState(1)

    const [hq_enabled, setHQEnabled] = useState(false)
    const [has_hq, setHasHQ] = useState(false)

    const [pages_data, setPagesData] = useState([])

    useEffect(() => {fetchComics(comics_json)}, [comics_json]);
    useEffect(() => {getComicsLabels(comics_labels)}, [comics_json])
    //useEffect(() => {getComicImages(comic_images)}, [comics_json, chapter_nr])
    useEffect(() => {getComicData(comic_data)}, [comics_json, chapter_nr])

    const getComicData = () => {
        let comic_data = comics_json[comic_name]
    }

    /*
    const getComicImages = () => {
        let images = []
        images[0] = {index: 0, label: "Empty", source: null}
        setComicImages(images)
    }*/

    const getComicsLabels = () => {
        let labels = [];
        Object.entries(comics_json[comic_name]).forEach(function(chapter, index) {
            let title = chapter[1]['t']
            let count = chapter[1]['c']
            let hq =    (chapter[1]['h'] === "true") ? true : false

            labels[index] = { value: index, label: title, hq: hq }
        })
        setComicsLabels(labels)
        setPage(labels[chapter_nr])
    }

    const fetchComics = async () => {
        if(comics_json) return;
        try {
            const response = await fetch(encodeURI(`${api_root}/${comic_name}/comic.json`))
            let json = await response.json()
            let labels = []
            Object.keys(json).forEach(function(index) {labels[index] = json[index]})
            setComicsJson(json);
        } catch(error) {
            console.error(error)
        }
    };

    const handleClick = (event) => {

            console.log(event);
        if(event.type === "mouseclick") {
            alert(event)
        }
    }

    const setPage = (data) => {
        setPageNr(1)
        setChapterName(data.label)
        setHasHQ(data.hq)
    }

    /*
    return props.map(({ x, display, sc }, i) => (
            <animated.div {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
            <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
            </animated.div>
    ))
    */

    const handlers = useSwipeable({
        onSwipedLeft: () => alert(2),
        onSwipedRight: () => alert(1),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    return (
        <div>
        {comics_labels && false ? <Dropdown options={comics_labels} onChange={setPage} value={comics_labels[chapter_nr]} placeholder="Select an option" /> : null}
        {
            /*
              comic_images ? <Dropdown options={comic_images} onChange={_onSelect} value={comic_images[0]} placeholder="Select an option" /> : null
            */
        }
        {
            chapter_name ?
                <div id="imgbox" {...tapOrClick(handleClick)}>
                <ReactImageAppear id="center-fit" {...handlers} 
            src={encodeURI(`${api_root}/${comic_name}/${chapter_name}${has_hq && hq_enabled?"/hq/":"/"}${pad(page_nr)}.png`)} placeholder={encodeURI(`${api_root}/${comic_name}/${chapter_name}/${pad(page_nr)}.png`)} showLoader={false} animationDuration={'0'}/>

</div>
                        : null
        }
            <button onClick={alert}>Next</button>

        </div>
    )
}

                    //<animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
export default hot(module)(App);
