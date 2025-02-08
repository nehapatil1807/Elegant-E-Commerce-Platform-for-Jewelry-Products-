import React from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";  
import { womens_rings } from "../Data/womens_rings";
import { womens_earrings } from "../Data/womens_earrings";
import { womens_pendants } from "../Data/womens_pendants";
import { womens_neckles } from "../Data/womens_neckles"; 
import { mens_rings } from "../Data/Mens_rings";
import { mens_bracelet } from "../Data/Mens_bracelet";


const Homepage = () => {
  return (
    <div className="">
      <HomeCarousel images={homeCarouselData} />

      <div className="space-y-10 py-20">
        <HomeProductSection data={womens_rings} section={"Women's Rings"} />
        <HomeProductSection data={mens_rings} section={"Men's Rings"} />
        <HomeProductSection data={womens_earrings} section={"Women's Earrings"} />
        <HomeProductSection data={womens_pendants} section={"Women's Pendants"} />
        <HomeProductSection data={mens_bracelet} section={"Men's Bracelet"} />
        <HomeProductSection data={womens_neckles} section={"Women's Neckles"} /> 
      </div>
    </div>
  );
};

export default Homepage;
