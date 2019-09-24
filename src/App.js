import { render } from 'react-dom'
import React, { useEffect, useState, useRef} from 'react';
import { hot } from 'react-hot-loader';
import Img from 'react-image'
import ReactImageAppear from 'react-image-appear'
import './App.css';

//import axios from 'axios'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

//import { Swipeable, defineSwipe } from 'react-touch'

import clamp from 'lodash-es/clamp' // Not used
import { useSprings, animated } from 'react-spring' // Not used
import { useGesture } from 'react-with-gesture' // Not used
//import './styles.css'

import tapOrClick from 'react-tap-or-click' // Not used
import { useSwipeable } from 'react-swipeable' // Not used

import Drawer from 'react-motion-drawer'

import EventComponent from './EventComponent.js'

import comics_json_LOCAL from './comics.json'

//var comics_json_LOCAL = null

//import { fetchJSON } from './utils/comicUtils.js'

function pad(val) {
    var s = String(val)
    const size = 3;
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
/*
interface Number {
    pad: () => string;
    str: () => string;
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
*/

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

    //const [comics_json, setComicsJson] = useState(comics_json_LOCAL ? comics_json_LOCAL : null)
    const [comics_json, setComicsJson] = useState()

    const [comics_labels, setComicsLabels] = useState([])
    const [comic_data, setComicData] = useState([])
    const [comic_images, setComicImages] = useState([])

    const [chapter_nr, setChapterNr] = useState(523)
    const [chapter_name, setChapterName] = useState()
    const [page_nr, setPageNr] = useState(1)
    const [page_count, setPageCount] = useState(0)
    const [source_arr, setSourceArr] = useState([])

    const [hq_enabled, setHQEnabled] = useState(true)
    const [has_hq, setHasHQ] = useState(false)
    const [preload_images, setPreloadImages] = useState(false)

    const [pages_data, setPagesData] = useState([])
    const [swiped, setSwiped] = useState(false)
    const [is_drawer_open, setIsDrawerOpen] = useState(false)

    useEffect(() => {fetchComics(comics_json)}, [comics_json]);
    //useEffect(() => {getComicsLabels(comics_labels)}, [comics_json, comic_name])
    //useEffect(() => {getComicData(comic_data)}, [comics_json, chapter_nr])


    const getComicData = () => {
        //if(isNaN(comics_json)) return;
        //let comic_data = comics_json[comic_name]
    }

    const getComicImages = (new_chapter) => {
	if(! preload_images) return;
	for(var i=1;i <= new_chapter.count;i++) {
		new Image().src = encodeURI(`${api_root}/${comic_name}/${new_chapter.label}/${new_chapter.hq && hq_enabled?"hq/":"/"}${pad(i)}.png`)
		//new Image().src = encodeURI(`${api_root}/${comic_name}/${new_chapter.label}/${pad(i)}.png`)
	}
    }

    const getComicsLabels = (json) => {
        //if(isNaN(json)) return;
        let labels = [];
        Object.entries(json[comic_name]).forEach(function(chapter, index) {
            let title = chapter[1]['t']
            let hq    = chapter[1]['h']
            let count = chapter[1]['c']
            labels[index] = { value: index, label: title, hq: hq , count: count}
        })
        setComicsLabels(labels)
	changeChapter(labels, chapter_nr, 1)
	getComicImages(labels[chapter_nr]);
        //setPage(labels[chapter_nr], 1)
	//setPageCount(count)
    }

    const fetchComics = async () => {
	if(comics_json) return;
        try {
            const response = await fetch(encodeURI(`${api_root}/comics.json`))
            let json = await response.json()
            let labels = []
            Object.keys(json).forEach(function(index) {labels[index] = json[index]})
            setComicsJson(json);
	    getComicsLabels(json)
        } catch(error) {
            console.error(error)
        }
    };

    const handleClick = (event) => {
	//console.log(event);
        if(event.type === "mouseclick") {
            alert(event)
        }
    }

    const setPage = (data, nr) => {
	console.log(data)
        setPageNr(nr)
        setSourceArr(encodeURI(`${api_root}/${comic_name}/${data.label}${data.hq && hq_enabled?"/hq/":"/"}${pad(nr)}.png`))
    }

    const changeChapter = (labels, new_chapter_nr, new_page_nr) => {

        setChapterName(labels[new_chapter_nr].label)
        setChapterNr(new_chapter_nr)
        setHasHQ(labels[new_chapter_nr].hq)

	setPage(labels[new_chapter_nr], new_page_nr)
    }

    const prevChapter = () => {
	    changeChapter(comics_labels, chapter_nr-1, comics_labels[chapter_nr-1].count-1)
    }
    const nextChapter = () => {
	    getComicImages(comics_labels[chapter_nr-1]);
	    changeChapter(comics_labels, chapter_nr-1, 1)
    }


    const nextPage = () => {
	console.log("Next Page")
	if(page_nr+1 >= comics_labels[chapter_nr].count) {
		nextChapter();
		//changeChapter(comics_labels, chapter_nr+1, 1)
	} else {
		setPage(comics_labels[chapter_nr], page_nr+1)
	}
    }
    const prevPage = () => {
	console.log("Prev Page")
	if (page_nr-1 <= 0) {
		prevChapter();
		//changeChapter(comics_labels, chapter_nr-1, comics_labels[chapter_nr-1].count-1)
	} else {
		setPage(comics_labels[chapter_nr], page_nr-1)
	}
    }
    const onTap = (touch) => {
	//console.log(touch.clientX)
	const sideMargin = window.innerWidth / 6;
	if(touch.clientX < sideMargin) {
		nextPage();
	} else
	if(touch.clientX > window.innerWidth - sideMargin) {
		prevPage();
	}
    }

    /*
    return props.map(({ x, display, sc }, i) => (
            <animated.div {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
            <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
            </animated.div>
    ))
    */

    const handlers = useSwipeable({
        onSwipedLeft: () => console.warn("Alternative swipe Left"),
        onSwipedRight: () => console.warn("Alternative swipe Right"),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    const listChange = (e) => {
	console.log(e.)
	}

    return (
        <>
        {comics_labels && false ? <Dropdown options={comics_labels} onChange={setPage} value={comics_labels[chapter_nr]} placeholder="Select an option" /> : null}
        {
              //comic_images ? <Dropdown options={comic_images} onChange={setPage} value={comic_images[page_nr]} placeholder="Select an option" /> : null
        }
	<Drawer open={is_drawer_open} onChange={setIsDrawerOpen}>
	<ul>
	{ comics_labels ? comics_labels.map(function(label) {
		//return <li>i</li>
    		//const changeChapter = (labels, new_chapter_nr, new_page_nr) => {
		//return (<li key={label.value} onClick={console.log}>{label.value}</li>)
		return (<li key={label.value} data-id={"Test"} onClick={listChange.bind(this)}>{label.value}</li>)
	}) : null}
	</ul>
	</Drawer>
        {
            chapter_name ?
		<EventComponent onSwiped={setSwiped} onSwipedLeft={nextPage} onSwipedRight={prevPage} onTap={onTap}>
                <div id="img-box" {...tapOrClick(handleClick)}>

{ false ?
<>
	<b>{`${swiped?'Swiped':'Not Swiped'}`}</b>
	<b>{`${page_nr}`}</b>
</>
: null}
	{window.scrollTo(0, 0)}
		{false ?
                <ReactImageAppear id="img-background" {...handlers}
            src={encodeURI(`${api_root}/${comic_name}/${chapter_name}${has_hq && hq_enabled?"/hq/":"/"}${pad(page_nr)}.png?${new Date().getTime()}`)} placeholder={encodeURI(`${api_root}/${comic_name}/${chapter_name}/${pad(page_nr)}.png`)} showLoader={false} animationDuration={'0'}/>
:
                true ? <img
		 id="img-background"
		 alt=""
		//src={source_arr} // source_arr
		src={"https://via.placeholder.com/480x640"}
		{...handlers} showLoader={false} animationDuration={'0'}/> : null
}
</div>
</EventComponent>
                        : null
        }
            { false ? <button onClick={nextPage}>Next</button> : null}

        </>
    )
}

                    //<animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
export default hot(module)(App);
