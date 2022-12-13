import {AnimateKeyframes} from "react-simple-animate";
import {useState} from "react";

const logo=require("../assets/logo2.png");
const Logo=({width,height})=>{

    const [animateLogo, setAnimateLogo]=useState(true)
    const [animateText, setAnimateText]=useState(true)

    setTimeout(()=>{
        setAnimateText(!animateText);
        setAnimateLogo(!animateLogo);
    },10000)
    return <div>
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
        <img src={logo} width={width} height={height} alt="app-logo" />
        </AnimateKeyframes>
        <AnimateKeyframes
            play
            pause={!animateText}
            iterationCount="infinite"
            direction="alternate"
            duration={10}
            delay={0}
            keyframes={[
                { 0: 'opacity: 0' }, // 0%
                { 50: 'opacity: 0.5' }, // 50%
                { 100: 'opacity: 1' } // 100%
            ]}
        >
            <span>Company</span>
        </AnimateKeyframes>

    </div>
}

export default  Logo
