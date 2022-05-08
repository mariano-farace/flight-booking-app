import React, { useState } from "react";
//TODO: sacar estos props detodos lados y poner destructuring assigment
function Confirm(props) {
  function submit(event, props) {
    console.log("Llama al flight confirmation");
    console.log("props.flight: ", props.flight);
    const flight = props.flight;
    console.log("flight: ", flight);
    event.preventDefault();
    fetch("http://localhost:5000/flight-confirmation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flight),
    })
      .then((response) => {
        console.log("response1: ", response);

        return response.json();
      })
      .then((json) => {
        console.log("json: ", json);
        props.setConfirmation(json);
      })
      //TODO borrar este catch
      .catch((error) => {
        console.log("error: ", error);
      });
    console.log("sale del flight confirmation");
  }

  return (
    <div>
      <form onSubmit={(e) => submit(e, props)}>
        <input type="submit" />
      </form>
      {props.order && (
        <div>
          Confirmation:<br></br>
          {props.order}
        </div>
      )}
    </div>
  );
}

export default Confirm;
