import React, { useState } from 'react';
import CarTripForm from './CarTripForm';
import Results from './Results';

const App = () => {
    const dummyData = {winnerString: 'You should Fly',
		       carTripString: 'Car emissions: 105Mtons',
		       flightString: 'Flight emissions: 85Mtons'};
  
    return (
	<div>
	    <div>
		<CarTripForm />
	    </div>
	    <div>
		<Results resultsData={dummyData}
		/>
	    </div>
	</div>
    );
}

export default App;
	    
