import React from 'react';
import Features from '../components/common/Features';
import Footer from '../components/common/footer';
import Group11 from '../assets/Group 11.png';
import Pitch from '../assets/Pitch.png';
const HomePage = () => {
    return (
        <div  style={{  width: '1440px', height: '900px', backgroundColor: '#134443', position: 'relative'}}>
             <div className = 'overlay-image'>
            <img src={Pitch} alt = "Pitch" height = {500} width = {1400} />
        </div>
            <div className="positioned-image">
         <img src={Group11} alt="Group Image" height={800} width={1440}/>
</div>

        </div>
    )
};
export default HomePage;