const baseUrl = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    // 'Authorization': `Bearer ${token}`
    
});




function PostData() {
    //Observation
    let issued = document.getElementById('issued').value;
    let issuedmoment = moment(issued).format();

    let codeDisplay = document.getElementById('codeDisplay');
    let codeDisplayValue = codeDisplay.options[codeDisplay.selectedIndex].value;

    let value = Number.parseFloat(document.getElementById('value').value);
    let unit = document.getElementById('unit').value;
    let patientID = document.getElementById('patientID').value;
    let encounterID = document.getElementById('encounterID').value;
    let items = document.getElementsByName("status");
    let get_status = "";
    for(let i=0; i<items.length;i++){
        if(items[i].checked){
            get_status = items[i].value;
        }
    }

    let code = "";
    switch(codeDisplayValue){
        case "Body temperature":
            code = "8310-5";
            break;
        case "Blood pressure":
            code = "85354-9";
            break;
        case "Heart rate":
            code = "8867-4";
            break;
        case "Respiratory rate":
            code = "9279-1";
            break;
        case "SpO2":
            code = "2708-6";
            break;
        case "Blood Glucose":
            code = "15074-8";
            break;
    }


    console.log("value: " + value);

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";

    let fhirData = {

        resourceType:"Observation",
        meta: {
            tag : [{
                system: "http://loinc.org",
                code: tagid
                }]
            },
        status: get_status,
        category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "vital-signs",
                  display: "Vital Signs"
                }
              ]
            }
        ],
        code: {
            coding: [ 
            {
                system: "http://loinc.org",
                code: code,
                display: codeDisplayValue
            }
            ]
        },
        subject: {
            reference: "Patient/"+patientID
        },
        encounter: {
            reference: "Encounter/"+encounterID
        },
        issued: issuedmoment,  
          valueQuantity: {
            value: value,
            unit: unit,
            system: "http://unitsofmeasure.org",
        }

    }

    console.log(JSON.stringify(fhirData));
    // alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Observation`,{
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


//https://hapi.fhir.tw/fhir/Observation/100470
//https://hapi.fhir.tw/fhir/Observation/100473 
//https://hapi.fhir.tw/fhir/Observation/100474
//https://hapi.fhir.tw/fhir/Observation/100475
//https://hapi.fhir.tw/fhir/Observation/100476
//https://hapi.fhir.tw/fhir/Observation/100477


//https://hapi.fhir.tw/fhir/Observation/100665   //有新增選項和代碼
//https://hapi.fhir.tw/fhir/Observation/100666   //有新增選項和代碼
//https://hapi.fhir.tw/fhir/Observation/100667   //有新增選項和代碼
//https://hapi.fhir.tw/fhir/Observation/100668   //有新增選項和代碼