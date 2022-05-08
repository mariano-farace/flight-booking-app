import React, { useState } from "react";
//TODO: sacar estos props detodos lados y poner destructuring assigment
function Confirm(props) {
  function submit(event, props) {
    const flight = props.flight;
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
        return response.json();
      })
      .then((json) => {
        props.setConfirmation(json);
      })
      //TODO borrar este catch
      .catch((error) => {
        console.log("error: ", error);
      });
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
