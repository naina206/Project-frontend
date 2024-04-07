// Function to fetch data from ThingSpeak API
// function fetchData(apiKey, results, containerId) {
//     fetch(`https://api.thingspeak.com/channels/2443974/feeds.json?api_key=${apiKey}&results=${results}`)
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById(containerId);
//             container.innerHTML = ''; // Clear previous data

//             if (data.feeds && data.feeds.length > 0) {
//                 data.feeds.forEach(feed => {
//                     const timestamp = new Date(feed.created_at).toLocaleString();
//                     const value = parseFloat(feed.field1);

//                     const dataElement = document.createElement('div');
//                     dataElement.innerHTML = `<strong>Timestamp:</strong> ${timestamp}<br><strong>Air Quality:</strong> ${value}`;
//                     container.appendChild(dataElement);
//                 });
//             } else {
//                 container.textContent = 'No data available.';
//             }
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }


function fetchData(apiKey, results, containerId) {
    const fieldIds = [1, 2, 3, 4, 5, 6, 7, 8,]; // Specify the field IDs you want to read

    const fieldQueries = fieldIds.map(fieldId => `field${fieldId}`);
    const fieldsQuery = fieldQueries.join(',');

    fetch(`https://api.thingspeak.com/channels/2443974/feeds.json?api_key=${apiKey}&results=${results}&${fieldsQuery}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById(containerId);
            container.innerHTML = ''; // Clear previous data

            if (data.feeds && data.feeds.length > 0) {
                data.feeds.forEach(feed => {
                    const timestamp = new Date(feed.created_at).toLocaleString();
                    let dataElement = document.createElement('div');


                    const co2Risk = calculateRisk(parseFloat(feed['field1']), 'CO2');
                    const methaneRisk = calculateRisk(parseFloat(feed['field2']), 'Methane');
                    const no2Risk = calculateRisk(parseFloat(feed['field3']), 'NO2');
                    const coRisk = calculateRisk(parseFloat(feed['field4']), 'CO');
                    const so2Risk = calculateRisk(parseFloat(feed['field5']), 'SO2');
                    const ozoneRisk = calculateRisk(parseFloat(feed['field8']), 'Ozone');

                    // fieldIds.forEach(fieldId => {
                    //     const value = parseFloat(feed[`field${fieldId}`]);
                    //     dataElement.innerHTML += `<strong>Field ${fieldId}:</strong> ${value}<br>`;
                    // });

                    dataElement.innerHTML += `<strong>Timestamp:</strong> ${timestamp}<br>`;

                    var value = parseFloat(feed[`field1`]);
                    dataElement.innerHTML += `<strong> CO2 cocentration :</strong> ${value}ppm<br>`;
                    displayRiskDetails(dataElement, 'CO2', co2Risk);

                    var value = parseFloat(feed[`field2`]);
                    dataElement.innerHTML += `<br><strong> Methane :</strong> ${value}ppm <br>`;
                    displayRiskDetails(dataElement, 'Methane', methaneRisk);

                    var value = parseFloat(feed[`field3`]);
                    dataElement.innerHTML += `<br><strong> NO2 :</strong> ${value}ppm <br>`;
                    displayRiskDetails(dataElement, 'NO2', no2Risk);

                    var value = parseFloat(feed[`field4`]);
                    dataElement.innerHTML += `<br><strong> CO :</strong> ${value}ppm <br>`;
                    displayRiskDetails(dataElement, 'CO', coRisk);

                    var value = parseFloat(feed[`field5`]);
                    dataElement.innerHTML += `<br><strong> SO2 :</strong> ${value}ppm <br>`;
                    displayRiskDetails(dataElement, 'SO2', so2Risk);

                    var value = parseFloat(feed[`field6`]);
                    dataElement.innerHTML += `<br><strong> Temperature :</strong> ${value}°C<br>`;
                    var value = parseFloat(feed[`field7`]);
                    dataElement.innerHTML += `<br><strong> Humidity :</strong> ${value}%<br>`;
                    var value = parseFloat(feed[`field8`]);
                    dataElement.innerHTML += `<br><strong> Ozone :</strong> ${value}ppm <br>`;
                    displayRiskDetails(dataElement, 'Ozone', ozoneRisk);



                        


                    
                    container.appendChild(dataElement);
                });
            } else {
                container.textContent = 'No data available.';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Function to calculate risk level, color, and details based on gas concentration
function calculateRisk(value, gasName) {
    let riskLevel = 'Low';
    let color = 'green';
    let riskDetails = 'No significant risk.';

    if (gasName === 'CO' && value > 10) {
        riskLevel = 'High';
        color = 'red';
        riskDetails = 'High risk of carbon monoxide poisoning.';
    } else if (gasName === 'NO2' && value > 100) {
        riskLevel = 'High';
        color = 'red';
        riskDetails = 'High levels of nitrogen dioxide can cause respiratory problems.';
    } else if (gasName === 'SO2' && value > 20) {
        riskLevel = 'High';
        color = 'red';
        riskDetails = 'High concentrations of sulfur dioxide can irritate the respiratory system.';
    }
    // You can add more conditions to assess risk levels and details for other gases

    return { level: riskLevel, color, details: riskDetails };
}


// Function to display risk details in the output
function displayRiskDetails(container, gasName, riskData) {
    container.innerHTML += `<strong>${gasName} Risk:</strong> <span style="color: ${riskData.color}">${riskData.level}</span><br>`;
    container.innerHTML += `<strong>Risk Details:</strong> ${riskData.details}<br>`;
}




// Fetch data when the page loads
window.addEventListener('load', () => {
    fetchData('9W440UROYTM3K2OX', 1, 'dataContainer'); // Replace with your API key and container ID
});
