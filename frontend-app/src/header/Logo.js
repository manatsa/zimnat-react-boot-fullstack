import {AnimateKeyframes} from "react-simple-animate";
import {useState} from "react";

const logo=require("../assets/logo2.png");
const Logo=({width,height})=>{

    const [animateLogo, setAnimateLogo]=useState(true)
    const [animateText, setAnimateText]=useState(true)

    /** funtion to time the animations and sequence them one after another. */
    setTimeout(()=>{
        setAnimateText(!animateText);
        setAnimateLogo(!animateLogo);
    },10000)

    /** The main return part of the function */
    return <div>

        {/* the keyframes animation configuration for the logo image*/}
        <AnimateKeyframes
            play
            pause={!animateLogo}
            iterationCount="infinite"
            direction="alternate"
            duration={10}
            delay={10}
            keyframes={[
                'transform: rotateX(0) rotateY(0) rotateZ(0)',
                'transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg)',
            ]}
        >
            {/* the keyframes animation configuration for the logo image*/}
            <img src={logo} width={width} height={height} alt="app-logo" />
        </AnimateKeyframes>

        {/* the keyframes animation configuration for the header text*/}
        <AnimateKeyframes
            play
            pause={!animateText}
            iterationCount="infinite"
            direction="alternate"
            easing="easeOutElastic"
            duration={10}
            delay={0}
            keyframes={[
                { 0: 'opacity: 0' }, // 0%
                { 30: 'opacity: 0.5' }, // 50%
                { 60: 'opacity: 1' }, // 100%
                { 100: 'opacity: 1' }
            ]}
        >
            <span>Company (Pvt)Ltd.</span>
        </AnimateKeyframes>

    </div>
}

/** Expose the function to outside world */
export default  Logo
