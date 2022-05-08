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
  console.log("parameter: ", parameter);
  // Which cities or airports start with the parameter variable
  amadeus.referenceData.locations
    .get({
      keyword: parameter,
      subType: Amadeus.location.any,
    })
    .then(function (response) {
      console.log("response.data: ", response.data);
      res.send(response.result);
    })
    .catch(function (response) {
      res.send(response);
    });
});

//Search flights between two locations and desired travel dates: Amadeus Flight Offers Search API
app.get(`/flight-search`, (req, res) => {
  //TODO clean this code
  console.log("req.query: ", req.query);
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;
  const dateOfReturn = req.query.returnDate;
  console.log("dateOfReturn: ", dateOfReturn);
  const adults = req.query.adults;
  console.log("typeof adults", typeof adults);
  // Find the cheapest flights
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: parseInt(adults),
      max: "10",
    })
    .then(function (response) {
      console.log("los vuelos que devuelve:::", response.result);

      res.send(response.result);
    })
    .catch(function (response) {
      console.log("hay error:::", response);

      res.send(response);
    });
});

//Confirming a flight: Amadeus Flight Offers Price API.
app.post(`/flight-confirmation`, (req, res) => {
  const flight = req.body;
  console.log("flightMariano: ", flight);
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
      console.log("response: ", response);

      res.send(response.result);
    })
    .catch(function (response) {
      console.log("error: ", response);
      res.send(response);
    });
});

//Book the flight: Amadeus Flight Create Orders API

app.post(`/flight-booking`, (req, res) => {
  // Book a flight
  const flight = req.body.flight;
  const name = req.body.name;

  amadeus.booking.flightOrders
    .post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: "1982-01-16",
              name: {
                firstName: name.first,
                lastName: name.last,
              },
              gender: "MALE",
              contact: {
                emailAddress: "jorge.gonzales833@telefonica.es",
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
      res.send(response);
    });
});

app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
