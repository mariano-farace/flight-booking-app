const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Amadeus = require("amadeus");
const { API_KEY, API_SECRET } = require("./config.js");
const { requestLogger } = require("./helpers.js");

const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

///////////////////////////////////////////

//TODO usar async await
//TODO Note that you’ve hard-coded the value of adults to 1 and set max to 7 to limit the number of flights returned.

const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});

app.use(requestLogger);

//City and airport search: Amadeus Airport & City Search API

app.get(`/city-and-airport-search/:parameter`, (req, res) => {
  const parameter = req.params.parameter;
  // Which cities or airports start with the parameter variable
  amadeus.referenceData.locations
    .get({
      keyword: parameter,
      subType: Amadeus.location.any,
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

//Search flights between two locations and desired travel dates: Amadeus Flight Offers Search API
app.get(`/flight-search`, (req, res) => {
  //TODO clean this code
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;
  const returnDate = req.query.returnDate;
  const adults = req.query.adults;

  // Find the cheapest flights
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: parseInt(adults),
      returnDate,
      max: "7",
      //TODO falta la fecha de vuelta!!
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

//Confirming a flight: Amadeus Flight Offers Price API.
app.post(`/flight-confirmation`, (req, res) => {
  const flight = req.body;
  // Confirm availability and price
  amadeus.shopping.flightOffers.pricing
    .post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    )
    .then(function (response) {
      const result = response.result;
      //TODO borrar
      // const ConfirmationResponseResult = JSON.stringify(result);
      // console.log("ConfirmationResponseResult", ConfirmationResponseResult);
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

//Book the flight: Amadeus Flight Create Orders API

app.post(`/flight-booking`, (req, res) => {
  // Book a flight
  console.log("req.body", req.body);

  const flight = req.body.flight;
  console.log("stringy:::::::::::", JSON.stringify(flight));
  const traveler = req.body.traveler;
  console.log("typeof flight", typeof flight);
  amadeus.booking.flightOrders
    .post(
      JSON.stringify({
        data: {
          type: "flight-order",
          //TODO sacar el array de flight, y sacar en el back el [0]
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: traveler.dob,
              name: {
                firstName: traveler.fname,
                lastName: traveler.lname,
              },
              gender: "MALE",
              contact: {
                emailAddress: "mariano_farace@hotmail.com",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "34",
                    number: "480080076",
                  },
                ],
              },
              documents: [
                {
                  documentType: "PASSPORT",
                  birthPlace: "Madrid",
                  issuanceLocation: "Madrid",
                  issuanceDate: "2015-04-14",
                  number: "00000000",
                  expiryDate: "2025-04-14",
                  issuanceCountry: "ES",
                  validityCountry: "ES",
                  nationality: "ES",
                  holder: true,
                },
              ],
            },
          ],
        },
      })
    )
    .then(function (response) {
      res.send(response.result);
    }) //TODO handle errors like missing data
    .catch(function (response) {
      console.log("ERROR!!!:", response);
      res.send(response);
    });
});

app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
