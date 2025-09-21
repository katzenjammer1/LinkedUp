import React from 'react';
import Features from '../components/common/Features';
import Footer from '../components/common/footer';
import Group11 from '../assets/Group 11.png';
import Pitch from '../assets/Pitch.png';
const HomePage = () => {
    return (
        <div  style={{  width: '1440px', height: '900px', backgroundColor: '#134443', position: 'relative', justifyContent: 'center', alignContent: 'center'}}>
            <div className= 'Pitch' style= {{ height: '100px', width: '1440px', textDecorationColor: '#FFFFFF', textAlign: 'center'}}>
                <h1><span style={{color: '#F67E04'}}>New Friends</span> are just around the corner</h1>
                <p>Choose your hobbies & free time, we’ll match you with people nearby to hang out with.</p>
                <button style= {{background: '#F67E04'}}>
                    Get Started
                </button>
             </div>
            <div className="positioned-image">
         <img src={Group11} alt="Group Image" height={800} width={1490}/>
</div>

        </div>
    )
};
export default HomePage;