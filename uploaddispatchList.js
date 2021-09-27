const baseUrl = "https://api.dev.sita.tech/api"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    'Authorization': `Bearer ${token}`
    
});


function PostData(){
    //Patient
    let getfamily = document.getElementById('family').value;
    let getgiven = document.getElementById('given').value
    
    let identifier = document.getElementById('identifier').value;
    let telecom = document.getElementById('telecom').value;
    //取得性別資訊
    let items = document.getElementsByName("gender");
    let get_gender = "";
    for(let i = 0; i < items.length;i++){
        if(items[i].checked){
            get_gender = items[i].value;
        }
    }
    let birth = document.getElementById('birthDate').value;
    let address = document.getElementById('address').value;


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


    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";


    let fhirData = {
        resourceType: "Bundle",
        meta: {
        tag : [{
            system: "https://api.dev.sita.tech/api/",
            code: tagid
            }]
        },
        type: "collection",
        entry: [
        {
            fullUrl: "https://hapi.fhir.tw/fhir/Patient/100288",
            resource: {
                resourceType: "Patient",
                identifier: [{
                    use: "usual",
                    value: identifier,
                    type: {
                        "text": "身份證字號"
                    }
                }],
                name: [{
                    use: "official",
                    text: getfamily+getgiven,
                    family: getfamily,
                    given: [
                        getgiven
                    ]
                }],
                gender: get_gender,
                birthDate: birth,
                address: [{
                    use: "home",
                    text: address,
                    country: "TW"
                }],
                telecom: [{
                        system: "phone",
                        value: telecom,
                        use: "mobile"
                }],
                active: true
            }
        },
        {
            fullUrl: "https://hapi.fhir.tw/fhir/Encounter",
            resource: {
                resourceType : "Encounter",
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
                }
                
            }
        }
        ]
    }


    alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Bundle`,{
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


