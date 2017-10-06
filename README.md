## Twilio
This part is done on my personal account using free trial. Hosted frog aws server. It listen to port 8080, configured within Twilio online console.

## FlightAware
- use 'FlightAware' API to retrieve information: https://flightaware.com/commercial/flightxml/v3/apiref.rvt, free account, 5 requests per minute limit
- use 'flight-designator' library to parse airline code
- use 'airports.json' for airport ICO name lookup
- use 'airlines.json' for airline ICO name lookup, the data is not complete, not in use
- use 'Moment' for date formating

## Next Steps
- Check detailed flight status for delays and cancels
- Add error check on user input
- Create User input flows
