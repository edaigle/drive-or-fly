import React, { useState, useEffect } from 'react'; // useRef?

const CarTripForm = ({ submitCB }) => {
    const [yearsList, setYearsList] = useState('');
    const [makesList, setMakesList] = useState('');
    const [modelsList, setModelsList] = useState('');
    const [IDsList, setIDsList] = useState(''); 
    
    const [cities, setCities] = useState({start: '',
					  end: ''});
    const [carYear, setCarYear] = useState('');
    const [carMake, setCarMake] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carID, setCarID] = useState('');
		    
    const getYears = async () => {
	fetch("https://www.fueleconomy.gov/ws/rest/vehicle/menu/year")
	    .then((response) => {
		response.text()
		    .then( (str) => {
			let responseDoc = new DOMParser().parseFromString(str, "application/xml");
			let years = responseDoc.getElementsByTagName("value");
			let options = [<option>Select a model year</option>];
			for (var i = 0; i < years.length; i++) {
			    options.push(<option key={years[i].innerHTML} value={years[i].innerHTML}>
					     {years[i].innerHTML}
					 </option>);
			}
			setYearsList(options);
		    });
	    });
    }
    
    // Refactor these for DRY...
    const getMakesForYear = async ( year ) => {
	fetch("https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=" + year)
	    .then((response) => {
		response.text()
		    .then( (str) => {
			let responseDoc = new DOMParser().parseFromString(str, "application/xml");
			let makes = responseDoc.getElementsByTagName("value");
			let options = [<option>Select a make</option>];
			for (var i = 0; i < makes.length; i++) {
			    options.push(<option key={makes[i].innerHTML} value={makes[i].innerHTML}>
					     {makes[i].innerHTML}
					 </option>);
			}
			setMakesList(options);
		    });
	    });
    }

    // Refactor these for DRY...
    const getModels = async ( year, make ) => { // Just use state.carYear directly?
	fetch("https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=" + year + "&make=" + make) // TODO: proper parsing
	    .then((response) => {
		response.text()
		    .then( (str) => {
			let responseDoc = new DOMParser().parseFromString(str, "application/xml");
			let models = responseDoc.getElementsByTagName("value");
			let options = [<option>Select a model</option>];
			for (var i = 0; i < models.length; i++) {
			    options.push(<option key={models[i].innerHTML} value={models[i].innerHTML}>
					     {models[i].innerHTML}
					 </option>);
			}
			setModelsList(options);
		    });
	    });
    }

    // Refactor these for DRY...
    const getTrims = async ( model ) => { // Just use state.carYear directly?
	fetch("https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=" + carYear + "&make=" + encodeURIComponent(carMake) + "&model=" + encodeURIComponent(model)) // TODO: proper parsing, why do some states work...
	    .then((response) => {
		response.text()
		    .then( (str) => {
			let responseDoc = new DOMParser().parseFromString(str, "application/xml");
			let names = responseDoc.getElementsByTagName("text");
			let ids = responseDoc.getElementsByTagName("value");
			let options = [<option>Select a configuration</option>]; // modify state so these all show at once?
			for (var i = 0; i < names.length; i++) {
			    options.push(<option key={names[i].innerHTML} value={ids[i].innerHTML}>
					     {names[i].innerHTML}
					 </option>);
			}
			setIDsList(options);
		    });
	    });
    }

    const handleCityChange = (event) => {
	const {name, value} = event.target;
	setCities({
	    ...cities,
	    [name]: value
	});
    }
    
    const handleYearChange = (event) => {
	const {name, value} = event.target;
	setCarYear(value);
	setCarMake('');
	setCarModel('');
	setCarID('');
	getMakesForYear(value); // some sort of nextFunc dict by name?
    };

    const handleMakeChange = (event) => {
	const {name, value} = event.target;
	setCarMake(value);
	setCarModel('');
	setCarID('');
	getModels(carYear, value); 
    };

    const handleModelChange = (event) => {
	const {name, value} = event.target;
	setCarModel(value);
	setCarID('');
	getTrims( value );
    };

    const handleTrimChange = (event) => {
	const {name, value} = event.target;
	setCarID(value);
    };

    const handleSubmit = (event) => {
	event.preventDefault();
	submitCB(cities.start, cities.end, carID);
    };

    useEffect(() => {
	getYears()
    }, []);
    
    return (
	<form onSubmit={handleSubmit}>
	    <label>
		Start City:
		<input type="text" name="start" value={cities.start} onChange={handleCityChange} />
	    </label>
	    <label>
		Destination City:
		<input type="text" name="end" value={cities.end} onChange={handleCityChange} />
	    </label>
	    <label>
		Car Model Year:
		<select name="carYear" value={carYear} onChange={handleYearChange}>
		    { yearsList }
		</select>
	    </label>
	    <label>
		Car Make:
		<select name="carMake" value={carMake} onChange={handleMakeChange}>
		    { makesList }
		</select>
	    </label>
	    <label>
		Car Model:
		<select name="carModel" value={carModel} onChange={handleModelChange}>
		    { modelsList }
		</select>
	    </label>
	    <label>
		Car Trim:
		<select name="carID" value={carID} onChange={handleTrimChange}>
		    { IDsList }
		</select>
	    </label>
	    <input type="submit" value="Calculate" />
	</form>
    );
}

export default CarTripForm;
