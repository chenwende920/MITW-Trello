
function uploadMedicationBundle(id) {

    let extraData = $('#extraData');
    extraData.html("");

    fetch(`${baseUrl}/MedicationRequest?encounter=${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);

        let medicationsBody = json.entry;

        if(json.total > 0){
            extraData.append(`
                <table class="table table-striped">
                <thead class="thead">
                <tr class="table-dark">
                    <th scope="col">ID</th>
                    <th scope="col">紀錄時間</th>
                    <th scope="col">藥品項目</th>
                    <th scope="col">查詢</th>
                </tr>
                </thead>
                <tbody id="Medications"> </tbody>
                </table>

                <button onclick="addMedicationBundle(${id})" class="btn btn-primary">新增一筆</button>

            `);

            medicationsBody.map( entry => {
                $('#Medications').append(`
                <tr>
                <td>${entry.resource.id}</td>
                <td>${entry.resource.authoredOn}</td>
                <td>${entry.resource.medicationReference.reference}</td>
                <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getMedication(${entry.resource.id})">查看</button></td>
                </tr>
                `)
            });

        }
        else{

            extraData.append(`
                <h4>Request</h4>
                <div class="form-group row p-2">
                <label class="col-sm-4 col-form-label">用藥紀錄管理日期：</label>
                <div class="col-sm-8">
                    <input type="date" class="form-control" id="authoredOn">
                </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">藥品項目：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="medication">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">藥品劑量：</label>
                    <div class="col-sm-5">
                        <input type="text" class="form-control" id="doseQuantityValue">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="unit" placeholder="mg/dl">
                    </div>
                </div>
                
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">病患ID：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="patientID">
                    </div>
                    
                </div>
                

                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">查核狀態：</label>
                    <div class="col-sm-8">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-draft" name="status" class="custom-control-input" value="draft">
                            <label class="custom-control-label" for="status-draft">初稿</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-active" name="status" class="custom-control-input" value="active">
                            <label class="custom-control-label" for="status-active">尚未完成</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-completed" name="status" class="custom-control-input" value="completed">
                            <label class="custom-control-label" for="status-completed">完成</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-cancelled" name="status" class="custom-control-input" value="cancelled">
                            <label class="custom-control-label" for="status-cancelled">取消</label>
                        </div>
                    </div>
                </div>
                <h4>Dispense</h4>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥劑量：</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="quantity">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥天數：</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="daysSupplyValue" placeholder="天數">
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="daysSupplyUnit" placeholder="D/W/M">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">幾天幾次：</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="dosageInstructionPeriod" placeholder="天數">
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="dosageInstructionfrequency" placeholder="次數">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥用法：</label>
                        <div class="col-sm-8">
                            <select class="form-select" id="routeDisplay">
                                <option selected>請選擇用藥用法</option>
                                <option value="Topical route">Topical route</option>
                                <option value="Oral use">Oral use</option>
                                <option value="Intravenous use">Intravenous use</option>
                                <option value="Intramuscular use">Intramuscular use</option>
                                <option value="Ophthalmic use">Ophthalmic use</option>
                                <option value="Oromucosal use">Oromucosal use</option>

                            </select>
                        </div>
                    </div>

                    <h4>Administration</h4>
                    
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">調劑日期：</label>
                        <div class="col-sm-8">
                            <input type="datetime-local" class="form-control" id="effectivePeriodStart">
                        </div>
                    </div>
                    <button onclick="postMedicationBundle(${id})" class="btn btn-primary">新增內容</button>


            `);
        }


    })
    .catch(err => console.log(err));

}



//查看用藥紀錄
function getMedication(id){

    let extraData = $('#extraData');

    extraData.html("");

    fetch(`${baseUrl}/MedicationRequest/${id}`,{
            method: 'GET',
            headers: baseheader
        })
        .then(response => response.json())
        .then(function (json) {
            console.log(json);
        
        

            extraData.append(`

                <h4>Request</h4>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">用藥紀錄管理日期：</label>
                    <div class="col-sm-8">
                        <input type="date" class="form-control" id="authoredOn" value="${json.authoredOn}" >
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">藥品項目：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="medication" value="${(json.medicationReference)?(json.medicationReference.reference):""}">
                    </div>
                </div>
                <div class="form-group row p-2">
                <label class="col-sm-4 col-form-label">藥品劑量：</label>
                <div class="col-sm-5">
                <input type="text" class="form-control" id="doseQuantityValue" value="${(json.dosageInstruction[0])?(json.dosageInstruction[0].doseAndRate[0].doseQuantity.value):""}">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="unit" value="${(json.dosageInstruction[0])?(json.dosageInstruction[0].doseAndRate[0].doseQuantity.unit):""}">
                    </div>
                </div>
                </div>
        
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">病患ID：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="patientID" value="${(json.subject)?(json.subject.reference):""}" >
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">派遣單ID：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="encounterID" value="${(json.encounter)?(json.encounter.reference):""}" >
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">生理量測填寫狀態：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="status" value="${json.status}" />
                    </div>
                </div>
        
            `);

        })
        .catch(err => console.log(err));



        //抓取配藥
        fetch(`${baseUrl}/MedicationDispense?prescription=${id}`,{
            method: 'GET',
            headers: baseheader
        })
        .then(response => response.json())
        .then(function (json) {
            console.log(json);        

            extraData.append(`

                <h4>Dispense</h4>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">用藥劑量：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="quantity" value="${(json.entry[0].resource.quantity)?(json.entry[0].resource.quantity.value):""}"/>
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">用藥天數：</label>
                    <div class="col-sm-5">
                        <input type="text" class="form-control" id="daysSupplyValue" placeholder="天數" value="${(json.entry[0].resource.daysSupply)?(json.entry[0].resource.daysSupply.value):""}">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="daysSupplyUnit" placeholder="D/W/M" value="${(json.entry[0].resource.daysSupply)?(json.entry[0].resource.daysSupply.unit):""}">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">幾天幾次：</label>
                    <div class="col-sm-5">
                        <input type="text" class="form-control" id="dosageInstructionPeriod" placeholder="天數" value="${(json.entry[0].resource.dosageInstruction[0])?(json.entry[0].resource.dosageInstruction[0].timing.repeat.period):""}">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="dosageInstructionfrequency" placeholder="次數" value="${(json.entry[0].resource.dosageInstruction[0])?(json.entry[0].resource.dosageInstruction[0].timing.repeat.frequency):""}">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">用藥用法：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="routeDisplay" value="${(json.entry[0].resource.dosageInstruction[0])?(json.entry[0].resource.dosageInstruction[0].route.coding[0].display):""}">
                    </div>
                </div>
                
            `);


            //抓取用藥管理
            fetch(`${baseUrl}/MedicationAdministration?request=${id}`,{
                method: 'GET',
                headers: baseheader
            })
            .then(response => response.json())
            .then(function (json) {
                console.log(json);
            
                let effectivePeriod = moment(json.entry[0].resource.effectivePeriod.start).format('YYYY-MM-DDTHH:mm');
            
    
                extraData.append(`
    
                    <h4>Administration</h4>
                            
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">調劑日期：</label>
                        <div class="col-sm-8">
                            <input type="datetime-local" class="form-control" id="effectivePeriodStart" value="${effectivePeriod}">
                        </div>
                    </div>
                    <button onclick="putMedicationBundle(${id})" class="btn btn-primary">更新內容</button>
    
                `);
    
            })
            .catch(err => console.log(err));
    

        })
        .catch(err => console.log(err));


}



function postMedicationBundle(encounterID) {
    //MedicationRequest
    let authoredOn = document.getElementById('authoredOn').value;

    let medication = document.getElementById('medication').value;

    let doseQuantityValue = Number.parseFloat(document.getElementById('doseQuantityValue').value);
    let unit = document.getElementById('unit').value;

    let patientID = document.getElementById('patientID').value;
    // let encounterID = document.getElementById('encounterID').value;
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
                    reference: patientID
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
                    reference: patientID
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
                    reference: patientID
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

        alert(JSON.stringify(json));
        console.log(JSON.stringify(json));
    })
}



function putMedicationBundle(id) {



}



function addMedicationBundle(id) {

    let extraData = $('#extraData');
    extraData.html("");


    extraData.append(`
                <h4>Request</h4>
                <div class="form-group row p-2">
                <label class="col-sm-4 col-form-label">用藥紀錄管理日期：</label>
                <div class="col-sm-8">
                    <input type="date" class="form-control" id="authoredOn">
                </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">藥品項目：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="medication">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">藥品劑量：</label>
                    <div class="col-sm-5">
                        <input type="text" class="form-control" id="doseQuantityValue">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="unit" placeholder="mg/dl">
                    </div>
                </div>
                
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">病患ID：</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="patientID">
                    </div>
                    
                </div>
                

                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">查核狀態：</label>
                    <div class="col-sm-8">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-draft" name="status" class="custom-control-input" value="draft">
                            <label class="custom-control-label" for="status-draft">初稿</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-active" name="status" class="custom-control-input" value="active">
                            <label class="custom-control-label" for="status-active">尚未完成</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-completed" name="status" class="custom-control-input" value="completed">
                            <label class="custom-control-label" for="status-completed">完成</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-cancelled" name="status" class="custom-control-input" value="cancelled">
                            <label class="custom-control-label" for="status-cancelled">取消</label>
                        </div>
                    </div>
                </div>
                <h4>Dispense</h4>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥劑量：</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="quantity">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥天數：</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="daysSupplyValue" placeholder="天數">
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="daysSupplyUnit" placeholder="D/W/M">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">幾天幾次：</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="dosageInstructionPeriod" placeholder="天數">
                        </div>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" id="dosageInstructionfrequency" placeholder="次數">
                        </div>
                    </div>
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">用藥用法：</label>
                        <div class="col-sm-8">
                            <select class="form-select" id="routeDisplay">
                                <option selected>請選擇用藥用法</option>
                                <option value="Topical route">Topical route</option>
                                <option value="Oral use">Oral use</option>
                                <option value="Intravenous use">Intravenous use</option>
                                <option value="Intramuscular use">Intramuscular use</option>
                                <option value="Ophthalmic use">Ophthalmic use</option>
                                <option value="Oromucosal use">Oromucosal use</option>

                            </select>
                        </div>
                    </div>

                    <h4>Administration</h4>
                    
                    <div class="form-group row p-2">
                        <label class="col-sm-4 col-form-label">調劑日期：</label>
                        <div class="col-sm-8">
                            <input type="datetime-local" class="form-control" id="effectivePeriodStart">
                        </div>
                    </div>
                    <button onclick="postMedicationBundle(${id})" class="btn btn-primary">新增內容</button>


            `);

}