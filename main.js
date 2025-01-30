let availableKeywords;

fetch("https://timeapi.io/api/timezone/availabletimezones")
.then(res => res.json())
.then(data => {
    availableKeywords = data
    console.log(availableKeywords)
})

// DEPARTURE SEARCH AND RESULTS

const departureSearchBox = document.getElementById("departure-country-search")
const departureResultsBox = document.getElementById("departure-results-box")

departureSearchBox.onkeyup = () => {
    let result = [];
    let input = departureSearchBox.value;
    if (input.length){
        result = availableKeywords.filter((keyword) => {
            return keyword.toLowerCase().replace("_", " ").includes(input.toLowerCase());
        });
        console.log(result)
}
display(result)
}

const display = (result) => {
    const content = result.map(item => {
        return "<li onclick=selectInput(this)>" + item + "</li>"
    })

    departureResultsBox.innerHTML = `<ul>${content.join('')}</ul>`
}

const selectInput = (item) => {
     departureSearchBox.value = item.textContent;
     departureResultsBox.innerHTML = ``
}

// ARRIVAL SEARCH AND RESULTS

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

const arrivalTimeHH = document.getElementById("arrival-time-hh")
const arrivalTimeMM = document.getElementById("arrival-time-mm")

const zoneChange = () => {

const allInputs = document.querySelectorAll("input");
let allInputsHaveValue = true;

allInputs.forEach((input) => {
    if (!input.value) {
        allInputsHaveValue = false;
    }
});

const errorMsg = document.getElementById("error-msg");
let arrivalTimeConverted = " ";


if (allInputsHaveValue){
    const departureTimeHH = document.getElementById("departure-time-hh");
    const departureTimeMM = document.getElementById("departure-time-mm");
    let departureTime = `${departureTimeHH.value}:${departureTimeMM.value}`;


   const zoneChangeValues = {
        "fromTimeZone": arrivalSearchBox.value,
        "dateTime": `2021-03-14 ${arrivalTimeHH.value}:${arrivalTimeMM.value}:00`,
        "toTimeZone": departureSearchBox.value,
        "dstAmbiguity": ""
      }


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
    
    calculateFlightDuration(departureTime, arrivalTimeConverted);
}) 
    console.log("departure time " + departureTime);

    errorMsg.innerText = ``
    // FINDNIG THE DIFFERENCE BETWEEN THE ARRIVAL TIME(same timezone and departure)
// AND THE DEPARTURE TIME


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
    
    
    // now i need to convert the difference in minutes back to hours and minutes
    const diffHours = Math.floor(totalMinutesDifference / 60);
    const diffMinutes = totalMinutesDifference % 60;

    // now i want to show the result on screen
    const travelTime = document.getElementById("travel-time-text");
    travelTime.innerText =`${diffHours} hours and ${diffMinutes} minutes`
}

} else {
    errorMsg.innerText = `Please fill out all fields`
}

}



