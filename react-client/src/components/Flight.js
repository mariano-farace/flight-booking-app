import React, { useState } from "react";
import FlightSelect from "./FlightSelect";

function Flight(props) {
  const [passengers, setPassengers] = useState("1");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightOptions, setFlightOptions] = useState([]);

  function submit(event, props) {
    event.preventDefault();
    var returnDateParam = returnDate ? "&returnDate=" + returnDate : "";
    console.log("returnDateParam", returnDateParam);
    //TODO Make this readable
    fetch(
      `http://localhost:5000/flight-search?originCode=${props.origin}&destinationCode=${props.destination}&dateOfDeparture=${departDate}&adults=${passengers}&${returnDateParam}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json: ", json);
        const flightResults = json.data;
        console.log("flightResults: ", flightResults);
        setFlightOptions(flightResults);
      });
  }

  return (
    <div>
      <form onSubmit={(e) => submit(e, props)}>
        <label htmlFor="passengers">Passengers:</label>
        <input
          onChange={(e) => setPassengers(e.target.value)}
          type="number"
          name="passengers"
          min="1"
          max="5"
          required
        />
        <br></br>
        <label htmlFor="departure">Depart Date:</label>
        <input
          type="date"
          onChange={(e) => setDepartDate(e.target.value)}
          id="departure"
          name="departure"
          required
        />
        <br></br>
        <label htmlFor="return">Return Date:</label>
        <input
          type="date"
          onChange={(e) => setReturnDate(e.target.value)}
          id="return"
          name="return"
        />
        <br></br>
        <input type="submit" />
      </form>
      <FlightSelect flightOptions={flightOptions} setFlight={props.setFlight} />
    </div>
  );
}

export default Flight;
