const baseUrl = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    // 'Authorization': `Bearer ${token}`
    
});


function PostData(){
    //Encounter
    let writeperiod = document.getElementById('writeperiod').value
    let statusHistoryArrivedStart = document.getElementById('statusHistoryArrivedStart').value;
    let statusHistoryArrivedEnd = document.getElementById('statusHistoryArrivedEnd').value;
    let statusHistoryInprogressStart = document.getElementById('statusHistoryInprogressStart').value;
    let statusHistoryInprogressEnd = document.getElementById('statusHistoryInprogressEnd').value;
    let statusHistoryOnleaveStart = document.getElementById('statusHistoryOnleaveStart').value;
    let statusHistoryOnleaveEnd = document = document.getElementById('statusHistoryOnleaveEnd').value;
    let accidentLocation = document.getElementById('accidentLocation').value;
    let hospitalization = document.getElementById('hospitalization').value;

    let patientId = document.getElementById('patientID').value;


    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";


    let fhirData = {
        resourceType: "Encounter",
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
        status: "planned",
        class: {
            code: "AMB",
            display: "ambulatory"
            }, 
        period: {
            start: writeperiod  
        },
        statusHistory: [
            {
                status: "arrived",
                period: {
                start: statusHistoryArrivedStart+":00+10:00",   
                end: statusHistoryArrivedEnd+":00+10:00" 
                }
            },
            {
                status: "in-progress",  
                period: {
                start: statusHistoryInprogressStart+":00+10:00",  
                end: statusHistoryInprogressEnd+":00+10:00"
                }
            },
            {
                status: "onleave",
                period: {
                start: statusHistoryOnleaveStart+":00+10:00",  
                end: statusHistoryOnleaveEnd+":00+10:00"
                }
            }
        ],
        location: [
            {
                location: {
                    display: accidentLocation
                },
                status: "active"
                }
        ],
        hospitalization: {
            admitSource: {
                coding: [
                {
                    code: "emd",
                    display: hospitalization
                }
                ]
            }
        },

        subject: {
            reference: "Patient/"+patientId
        }
    }


    alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Encounter`,{
        method: "POST",
        body: JSON.stringify(fhirData),
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        const resultData = document.getElementById("resultData");
        resultData.textContent = JSON.stringify(json);

    })

}


//https://hapi.fhir.tw/fhir/Encounter/100321
