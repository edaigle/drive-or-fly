import React, { useState, useRef } from 'react';
import CarTripForm from './CarTripForm';
import Results from './Results';

// NEED TO HIDE THE KEY! Env at worst, next at best
const BING_API_KEY = "AuzTDonR86zRuINp3Lc4zhCcp3g9nT26fP-j_EmiJGw9nCfwpQdxE_nCdpjC3xS1" //HIDE!!

const App = () => {
    const [distance, setDistance] = useState(0.0)
    const [carEmission, setCarEmission] = useState(0.0)

    const dummyData = {winnerString: 'You should Fly',
		       carTripString: 'Car emissions: 105Mtons',
		       flightString: 'Flight emissions: 85Mtons'};

    const callTripDistanceAPI = async (startCity, destCity) => {
	const request = await fetch("https://dev.virtualearth.net/REST/V1/Routes/Driving?" +
				    new URLSearchParams({"o": "xml",
							 "wp.0": startCity,
							 "wp.1": destCity,
							 "key": BING_API_KEY}));
	return await request.text();
    }

    const callCO2PerMileAPI = async (carID) => {
	const response = await fetch("https://fueleconomy.gov/ws/rest/vehicle/" + carID);
	return await response.text();
    }

    const calculateCarTripEmissionInKG = (d, gramsPerKM) => {
	return Math.round((gramsPerKM * d)/1000);
    }

    const updateCarTripInfo = async (startCity, destCity, carID) => {
	const distanceResponse = await callTripDistanceAPI(startCity, destCity);
	const distanceXML = new DOMParser().parseFromString(distanceResponse, "application/xml");
	const dist = Number(distanceXML.getElementsByTagName("TravelDistance")[0].innerHTML); 

	const CO2Response = await callCO2PerMileAPI(carID);
	const CO2XML = new DOMParser().parseFromString(CO2Response, "application/xml");
	const gramsCO2PerMile = Number(CO2XML.getElementsByTagName("co2TailpipeGpm")[0].innerHTML);
	
	setDistance(dist);
	setCarEmission(calculateCarTripEmissionInKG(dist, gramsCO2PerMile));
    }
		

    const handleTripSubmit = (startCity, destCity, carID) => {
	updateCarTripInfo(startCity, destCity, carID);
    };
  
    return (
	<div>
	    <div>
		<CarTripForm submitCB={handleTripSubmit}/>
	    </div>
	    <div>
		<Results resultsData={dummyData}
		/>
	    </div>
	    <div>
		{distance} KM
	    </div>
	    <div>
		{carEmission} KG
	    </div>
	</div>
    );

    
}

export default App;
	    
