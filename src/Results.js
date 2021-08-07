import React from 'react';

const Results = ({ resultsData }) => {
    return (
	<div>
	    <div>{resultsData.winnerString}</div>
	    <div>
		<ul>
		    <li>Car Trip Footprint: {resultsData.carTripString}</li>
		    <li>Flight Footprint: {resultsData.flightString}</li>
		</ul>
	    </div>
	</div>
    )
}

export default Results;
