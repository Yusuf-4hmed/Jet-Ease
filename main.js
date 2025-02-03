
// fetching data for the departure and arrival search results
let availableKeywords;

fetch("https://timeapi.io/api/timezone/availabletimezones")
.then(res => res.json())
.then(data => {
    availableKeywords = data;
}).catch(error => console.log('ERROR'))

// DEPARTURE SEARCH AND RESULTS

// recieves the departure search and results DOM elements
const departureSearchBox = document.getElementById("departure-country-search")
const departureResultsBox = document.getElementById("departure-results-box")
// when a keypress is lifted up the function will run
departureSearchBox.onkeyup = () => {
    // result is the actual keywords that show up in the results box
    // input is what the user inputs into the search box
    let result = [];
    let input = departureSearchBox.value;
    // essentialy this if statement checks if the searchbox has value,
    // if it does it filters the fetched data from before (availableKeywords)
    // to only return the keywords that matcch the input
    if (input.length){
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().replace("_", " ").includes(input.toLowerCase());
        });
        console.log(result)
}
display(result) //this is how we display the keywords that match the users input in the
// results box 
}

// this is the function that is called above
// essentialy returns an array of the result items but with a <li> element around it
// and then adds them to the innerHTML of the results box
const display = (result) => {
    const content = result.map(item => {
        return "<li onclick=selectInput(this)>" + item + "</li>"
    })

    departureResultsBox.innerHTML = `<ul>${content.join('')}</ul>`
}

// in the previous function with the .map() i created <li> elements with the onclick="selectInput(this)"
// essentialy when you select an item it adds it to the search box
const selectInput = (item) => {
     departureSearchBox.value = item.textContent;
     departureResultsBox.innerHTML = ``
}

// ARRIVAL SEARCH AND RESULTS
// basically the same thing as above just for arrival :)
const arrivalSearchBox = document.getElementById("arrival-country-search")
const arrivalResultsBox = document.getElementById("arrival-results-box")

arrivalSearchBox.onkeyup = () => {
    let result = [];
    let input = arrivalSearchBox.value;
    if (input.length){
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().replace("_", " ").includes(input.toLowerCase());
        });
        console.log(result)
}
displayArrival(result)
}

const displayArrival = (result) => {
    const content = result.map(item => {
        return "<li onclick=selectInputArrival(this)>" + item + "</li>"
    })

    arrivalResultsBox.innerHTML = `<ul>${content.join('')}</ul>`
}

const selectInputArrival = (item) => {
     arrivalSearchBox.value = item.textContent;
     arrivalResultsBox.innerHTML = ``
}

// CALCULATE TRAVEL TIME
// converts arrival time to the departure countries timezone:

// recieves the arrival time Hours and Minutes DOM elements
const arrivalTimeHH = document.getElementById("arrival-time-hh")
const arrivalTimeMM = document.getElementById("arrival-time-mm")

// the first step to calculate travel time is to convert the arrival
// countries timeZone to the departure countries timezone
const zoneChange = () => {

// receives all input elements in the DOM
const mainFormContainer = document.getElementById("main-information-form-container")
const allInputs = mainFormContainer.querySelectorAll("input");
// sets default value of allInputsHaveValue to true
let allInputsHaveValue = true;
// if one input elements does not have a value then allInputsHaveValue is false
allInputs.forEach((input) => {
    if (!input.value) {
        allInputsHaveValue = false;
    }
});
// receieves the error-msg text <p></p> element
const errorMsg = document.getElementById("error-msg");
// sets a new variable with an empty string
let arrivalTimeConverted = " ";

// once its established that all the input elements have a value i will
// begin to convert the arrival time to the timezone of the departure time country
if (allInputsHaveValue){
    // receives the departure departure time Hours and Minutes DOM Elements
    // and sets a variable joinging the Hours and Minutes (HH::MM)
    const departureTimeHH = document.getElementById("departure-time-hh");
    const departureTimeMM = document.getElementById("departure-time-mm");
    let departureTime = `${departureTimeHH.value}:${departureTimeMM.value}`;

    // now fortunately the API im using has a post method that converts one timezone
    // into another so I use this

    // sets a variable method with an object format the API accepts (i read the API doc)
    // it uses template literals
    // it converts the "fromTimeZone"'s timeZone into the "toTimeZone"'s timeZone
    // "dateTime" is the time you want to convert from. i feel like i should change the 2021 part
    // but it doesnt really affect the user experience :/
   const zoneChangeValues = {
        "fromTimeZone": arrivalSearchBox.value,
        "dateTime": `2021-03-14 ${arrivalTimeHH.value}:${arrivalTimeMM.value}:00`,
        "toTimeZone": departureSearchBox.value,
        "dstAmbiguity": ""
      }

    //   with this fetch method it basically sends the zoneChangeValues variable via a POST method
    //  then it receives it converted and puts it in a variable called arrivalTimeConverted
    fetch("https://timeapi.io/api/conversion/converttimezone", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(zoneChangeValues)
}).then(res => res.json()).then(data => {
    arrivalTimeConverted = `${data.conversionResult.hour}:${data.conversionResult.minute}`;
    // console logs the arrival time in the same time zone as the departure 
    console.log("arrival time in departure times timezone " + arrivalTimeConverted);
    // it then calculates how long your are traveling, the name calculateFlightDuration wasnt the best
    // choice of words tbh
    calculateFlightDuration(departureTime, arrivalTimeConverted);
    timeDifference();
}) 
    console.log("departure time " + departureTime);
// removes the error text as the function has gone through as intended
    errorMsg.innerText = ``


// now that the arrival time has been matched to the time zone of the departure time
// i can now find the difference between the two and I will have the total travel time
const calculateFlightDuration = (departureTime, arrivalTimeConverted) => {
    // seperate the departure and arrival times into their hours and minutes
    const [depHours, depMinutes] = departureTime.trim().split(":").map(Number);
    const [arrHours, arrMinutes] = arrivalTimeConverted.trim().split(":").map(Number);
    // then i want to convert the how many minutes make up the
    // departure time and arrival time
    const depTotalMinutes = depHours * 60 + depMinutes;
    const arrTotalMinutes = arrHours * 60 + arrMinutes;
    // now i want to adjust for a next day possibility and find calculate
    // the difference
    const totalMinutesDifference =
        arrTotalMinutes >= depTotalMinutes ?
            arrTotalMinutes - depTotalMinutes:
            arrTotalMinutes + 1440 - depTotalMinutes;
            // 1440 is 24 hours btw
    
    
    // now i need to convert the difference in minutes back to hours and minutes
    const diffHours = Math.floor(totalMinutesDifference / 60);
    const diffMinutes = totalMinutesDifference % 60;

    // now i want to show the result on screen
    const travelTime = document.getElementById("travel-time-text");
    travelTime.innerText =`${diffHours} hours and ${diffMinutes} minutes`
    
    // show tool container
    toolsContainer.style.opacity = "1"
}

} else {
    errorMsg.innerText = `Please fill out all fields`
    
    
}

}

const toolsContainer = document.getElementById("tools-container")
const confirmBtn = document.getElementById("confirm-button")

// FIND TIME DIFFERENCE

const timeDifference = () => {

    const [depPartOne, depPartTwo] = departureSearchBox.value.split("/");
    const [arrPartOne, arrPartTwo] = arrivalSearchBox.value.split("/");

    let depTimeLive;
    fetch(`https://timeapi.io/api/time/current/zone?timeZone=${depPartOne}%2F${depPartTwo}`)
    .then(res => res.json())
    .then(data => {
        depTimeLive = data.time;
        console.log(depTimeLive)
    })
    let timeDifference;
    let arrTimeLive;
    const hourDifference = document.getElementById("hour-difference");
    fetch(`https://timeapi.io/api/time/current/zone?timeZone=${arrPartOne}%2F${arrPartTwo}`)
    .then(res => res.json())
    .then(data => {
        arrTimeLive = data.time;
        console.log(arrTimeLive)
        timeDifference = parseInt(arrTimeLive) - parseInt(depTimeLive);
        if (timeDifference > 0){
            hourDifference.innerText = `${arrPartTwo} is ${timeDifference} hours ahead from ${depPartTwo}!`;
        } else {
            hourDifference.innerText = `${arrPartTwo} is ${timeDifference} behind ahead from ${depPartTwo}!`;
        }
    })
}
