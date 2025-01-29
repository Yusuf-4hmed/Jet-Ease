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

// convert both departure and arrival times to utc:

const zoneChange = () => {
    const zoneChangeValues = {
        "fromTimeZone": arrivalSearchBox.value,
        "dateTime": "2021-03-14 21:30:00",
        "toTimeZone": departureSearchBox.value,
        "dstAmbiguity": ""
      }


    fetch("https://timeapi.io/api/conversion/converttimezone", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(zoneChangeValues)
}).then(res => res.json()).then(data => console.log(data))
}


