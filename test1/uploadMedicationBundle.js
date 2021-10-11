const baseUrl = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    // 'Authorization': `Bearer ${token}`
    
});




function PostData() {
    //MedicationRequest
    let authoredOn = document.getElementById('authoredOn').value;

    let medication = document.getElementById('medication').value;

    let doseQuantityValue = Number.parseFloat(document.getElementById('doseQuantityValue').value);
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

    //MedicationDispense
    let quantity = Number.parseInt(document.getElementById('quantity').value);
    let daysSupplyValue = Number.parseFloat(document.getElementById('daysSupplyValue').value);
    let daysSupplyUnit = document.getElementById('daysSupplyUnit').value;
    let dosageInstructionPeriod = Number.parseInt(document.getElementById('dosageInstructionPeriod').value);
    let dosageInstructionfrequency = Number.parseInt(document.getElementById('dosageInstructionfrequency').value);

    let routeDisplay = document.getElementById('routeDisplay');
    let routeDisplayValue = routeDisplay.options[routeDisplay.selectedIndex].value;

    //MedicationAdministration
    let effectivePeriodStart = document.getElementById('effectivePeriodStart').value;
    let effectivePeriodStartmoment = moment(effectivePeriodStart).format();


    let code = "";
    switch(routeDisplayValue){
        case "Topical route":
            code = "6064005";
            break;
        case "Oral use":
            code = "26643006";
            break;
        case "Intravenous use":
            code = "47625008";
            break;
        case "Intramuscular use":
            code = "78421000";
            break;
        case "Ophthalmic use":
            code = "54485002";
            break;
        case "Oromucosal use":
            code = "372473007";
            break;
    }



    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";

    let fhirData = {

        resourceType: "Bundle",
        id: "bundle-transaction",
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
        type: "transaction",
        entry: [
        {
            fullUrl: "https://hapi.fhir.tw/fhir/MedicationRequest/EMS-mdr",
            resource: {
                resourceType: "MedicationRequest",
                status: get_status,
                intent: "order",
                category: [{
                    "coding": [{
                        "code": "inpatient",
                        "display": "Inpatient"
                    }]
                }],
                medicationReference: {
                    reference: "Medication/"+medication
                },
                subject: {
                    reference: "Patient/"+patientID
                },
                encounter: {
                    reference: "Encounter/"+encounterID
                },
                authoredOn: authoredOn,
                dosageInstruction: [
                    {
                    sequence: 1,
                    timing: {
                        repeat: {
                            frequency: dosageInstructionfrequency,
                            period: dosageInstructionPeriod,
                            periodUnit: "d"                        
                        }
                    },
                    doseAndRate: [  
                        {
                        type: {
                            coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                                code: "ordered",
                                display: "Ordered"
                            }
                            ]
                        },
                        doseQuantity: {
                            value: doseQuantityValue,
                            unit: unit,
                            system: "http://unitsofmeasure.org",
                            code: unit
                        }
                        }

                        
                    ]
                    }
                ]
            },
            request: {
                method: "POST",
                url: "MedicationRequest/EMS-mdr"
            }
        },
        {
            fullUrl: "https://hapi.fhir.tw/fhir/MedicationDispense/EMS-mdd",
            resource: {
                resourceType: "MedicationDispense",

                status: "completed",
                medicationReference: {
                    reference: "Medication/"+medication
                },
                subject: {
                    reference: "Patient/"+patientID
                },
                context: {
                    reference: "Encounter/"+encounterID
                },
                authorizingPrescription: [
                    {
                    reference: "MedicationRequest/EMS-mdr"
                    }
                ],
                quantity: {
                    value: quantity,
                    system: "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                    code: "TAB"
                },
                daysSupply: {
                    value: daysSupplyValue,
                    unit: daysSupplyUnit,
                    system: "http://unitsofmeasure.org",
                    code: "d"
                },
                dosageInstruction: [
                    {
                    sequence: 1,
                    timing: {
                        repeat: {
                        frequency: dosageInstructionfrequency,
                        period: dosageInstructionPeriod,
                        periodUnit: "d"
                        }
                    },
                    route: {
                        coding: [
                        {
                            system: "http://snomed.info/sct",
                            code: code,
                            display: routeDisplayValue
                        }
                        ]
                    },
                    doseAndRate: [
                        {
                        type: {
                            coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                                code: "ordered",
                                display: "Ordered"
                            }
                            ]
                        },
                        doseQuantity: {
                            value: doseQuantityValue,
                            unit: unit,
                            system: "http://unitsofmeasure.org",
                            code: unit
                        }
                        }
                    ]
                    }
                ]
            },
            request: {
                method: "POST",
                url: "MedicationDispense/EMS-mdd"
            }
        },
        {
            fullUrl: "https://hapi.fhir.tw/fhir/MedicationAdministration/EMS-mda",
            resource: {

                resourceType: "MedicationAdministration",
        
                status: "completed",
                medicationReference: {
                    reference: "Medication/"+medication
                },
                subject: {
                    reference: "Patient/"+patientID
                },
                context: {
                    reference: "Encounter/"+encounterID
                },
                effectivePeriod: {
                    start: effectivePeriodStartmoment
                },
                reasonCode: [   
                {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/reason-medication-given",
                            code: "b",
                            display: "Given as Ordered"
                        }
                    ]
                }
                ],
                request: {
                    reference: "MedicationRequest/EMS-mdr"
                },
                dosage: {
                    dose: {
                        value: doseQuantityValue,
                        unit: unit,
                        system: "http://unitsofmeasure.org",
                        code: unit
                    }
                }
            },
            request: {
                method: "POST",
                url: "MedicationAdministration/EMS-mda"
            }
        }
        ]

    }

    console.log(JSON.stringify(fhirData));
    fetch(`${baseUrl}`,{
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


//https://hapi.fhir.tw/fhir/MedicationRequest/100708


//Bundle一起丟的
//https://hapi.fhir.tw/fhir/MedicationRequest/100754
//https://hapi.fhir.tw/fhir/MedicationDispense/100755
//https://hapi.fhir.tw/fhir/MedicationAdministration/100756


//https://hapi.fhir.tw/fhir/MedicationAdministration?request=100754   找出特定Request所關聯的用藥管理的
//https://hapi.fhir.tw/fhir/MedicationDispense?prescription=100754    找出特定Request所關聯的配藥資訊