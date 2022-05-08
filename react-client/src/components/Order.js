import React, { useState } from "react";

function Order(props) {
  console.log("Aca tendria que estar el vuelo props", props);
  const [traveler, setTraveler] = useState("");
  const [fname, setFname] = useState("Harryette");
  const [lname, setLname] = useState("Mullen");
  const [dob, setDob] = useState("1990-01-01");

  function makeTraveler(event) {
    event.preventDefault();
    setTraveler({ fname: fname, lname: lname, dob: dob });
  }

  function submit(event, props) {
    const dataForBookingFlight = {
      flight: props.confirmation.data.flightOffers,
      traveler: traveler,
    };
    event.preventDefault();
    fetch("http://localhost:5000/flight-booking", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForBookingFlight),
    })
      .then((response) => response.json())
      .then((json) => {
        props.setOrder(json);
      });
  }

  return (
    <div>
      <form onSubmit={(e) => makeTraveler(e)}>
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          onChange={(e) => setDob(e.target.value)}
          id="dob"
          name="dob"
          required
        />
        <br></br>
        <label>First Name: </label>
        <input
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        ></input>
        <br></br>
        <label>Last Name: </label>
        <input
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
        ></input>
        <br></br>
        <input type="submit" value="Submit Traveler Info" />
      </form>
      {traveler && (
        <form onSubmit={(e) => submit(e, props)}>
          <input type="submit" value="Book Flight" />
        </form>
      )}
      {props.order && (
        <div>
          <div>Flight Booked! Here are the details:</div>
          <div>{JSON.stringify(props.order)}</div>
        </div>
      )}
    </div>
  );
}

export default Order;
