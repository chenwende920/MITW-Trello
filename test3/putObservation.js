
function listObservationWithEdit(id){
    
    let detailContent = $('#detailContent');

    let issued = document.getElementById('issued').value;
    let codeDisplay = document.getElementById('codeDisplay').value;
    let value = Number.parseInt(document.getElementById('value').value);
    let unit = document.getElementById('unit').value;
    let patientID = document.getElementById('patientID').value;
    let encounterID = document.getElementById('encounterID').value;
    let status = document.getElementById('status').value;

    let code = "";
    switch(codeDisplay){
        case "Body temperature":
            code = "29463-7";
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





    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";

    let fhirUpdateData = {
        resourceType:"Observation",
        id: id.toString(),
        meta: {
            tag : [{
                system: "http://loinc.org",
                code: tagid
                }]
            },
        status: status,
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
                display: codeDisplay
            }
            ]
        },
        subject: {
            reference: patientID
        },
        encounter: {
            reference: encounterID
        },
        issued: issued+":00+10:00",  
          valueQuantity: {
            value: value,
            unit: unit,
            system: "http://unitsofmeasure.org",
        }
    }


    fetch(`${baseUrl}/Observation/${id}`,{
        method: 'PUT',
        headers: baseheader,
        body: JSON.stringify(fhirUpdateData),
    })
    .then(resource => resource.json())
    .then(function(json) {

        console.log(json);
        alert("更改成功");
        console.log(JSON.stringify(fhirUpdateData));
    })
    .catch(err => console.log(err))


}