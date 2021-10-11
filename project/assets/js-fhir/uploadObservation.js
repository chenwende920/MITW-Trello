
//https://hapi.fhir.tw/fhir/Observation?encounter=100891  <=id  total=0

//顯示生理量測件數&建立生理量測資料
function uploadObservation(id){

    let extraData = $('#extraData');
    extraData.html("");

    fetch(`${baseUrl}/Observation?encounter=${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);

        let observationsBody = json.entry;

        if(json.total > 0){
            extraData.append(`
                <table class="table table-striped">
                <thead class="thead">
                <tr class="table-dark">
                    <th scope="col">ID</th>
                    <th scope="col">檢驗項目</th>
                    <th scope="col">填寫狀態</th>
                    <th scope="col">查詢</th>
                </tr>
                </thead>
                <tbody id="Observations"> </tbody>
                </table>

                <button onclick="addObservation(${id})" class="btn btn-primary">新增一筆</button>

    
            `);

            observationsBody.map( entry => {
                $('#Observations').append(`
                <tr>
                <td>${entry.resource.id}</td>
                <td>${entry.resource.code.coding[0].display}</td>
                <td>${entry.resource.status}</td>
                <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
                </tr>
                `)
            });

        }
        else{

            extraData.append(`
                

                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">檢驗報告生效日期：</label>
                    <div class="col-sm-8">
                        <input type="datetime-local" class="form-control" id="issued">
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">檢驗項目：</label>
                    <div class="col-sm-8">
                        <select class="form-select" id="codeDisplay">
                            <option selected>請選擇檢驗項目</option>
                            <option value="Body temperature">Body temperature</option>
                            <option value="Blood pressure">Blood pressure</option>
                            <option value="Heart rate">Heart rate</option>
                            <option value="Respiratory rate">Respiratory rate</option>
                            <option value="SpO2">SpO2</option>
                            <option value="Blood Glucose">Blood Glucose</option>

                        </select>
                    </div>
                </div>
                <div class="form-group row p-2">
                    <label class="col-sm-4 col-form-label">檢驗值/單位：</label>
                    <div class="col-sm-5">
                        <input type="text" class="form-control" id="value">
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
                    <label class="col-sm-4 col-form-label">生理量測填寫狀態：</label>
                    <div class="col-sm-8">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-registered" name="status" class="custom-control-input" value="registered">
                            <label class="custom-control-label" for="status-registered">掛號</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-preliminary" name="status" class="custom-control-input" value="preliminary">
                            <label class="custom-control-label" for="status-preliminary">初步</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-final" name="status" class="custom-control-input" value="final">
                            <label class="custom-control-label" for="status-final">完成</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="status-amended" name="status" class="custom-control-input" value="amended">
                            <label class="custom-control-label" for="status-amended">修正</label>
                        </div>
                    </div>
                </div>
                <button onclick="postObservation(${id})" class="btn btn-primary">新增內容</button>
            `);

        }

        
    })
    .catch(err => console.log(err));

}


//查看生理量測資料
function getObservation(id) {

    let extraData = $('#extraData');
    
    extraData.html("");

    fetch(`${baseUrl}/Observation/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);
        


        let issued = moment(json.issued).format('YYYY-MM-DDTHH:mm');
        

        extraData.append(`

        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">檢驗報告生效日期：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="issued" value="${issued}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">檢驗項目：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="codeDisplay" value="${json.code.coding[0].display}">
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">檢驗值/單位：</label>
        <div class="col-sm-5">
            <input type="text" class="form-control" id="value" value="${json.valueQuantity.value}">
        </div>
        <div class="col-sm-3">
            <input type="text" class="form-control" id="unit" value="${json.valueQuantity.unit}">
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
                <input type="text" class="form-control" id="statusobservation" value="${json.status}" />
            </div>
        </div>
        <button onclick="putObservation(${id})" class="btn btn-primary">更新內容</button>
        `);

    })
    .catch(err => console.log(err));

}

//新增生理量測資料
function postObservation(id){


    let issued = document.getElementById('issued').value;
    let issuedmoment = moment(issued).format();

    let codeDisplay = document.getElementById('codeDisplay');
    let codeDisplayValue = codeDisplay.options[codeDisplay.selectedIndex].value;

    let value = Number.parseFloat(document.getElementById('value').value);
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
            reference: patientID
        },
        encounter: {
            reference: "Encounter/"+id
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
        
        alert(JSON.stringify(json));
    })
    .catch(err => console.log(err));

}

//更新生理量測資料
function putObservation(id){


    let issued = document.getElementById('issued').value;
    let issuedmoment = moment(issued).format();

    let codeDisplay = document.getElementById('codeDisplay').value;

    let value = Number.parseFloat(document.getElementById('value').value);
    let unit = document.getElementById('unit').value;
    let patientID = document.getElementById('patientID').value;
    let encounterID = document.getElementById('encounterID').value;
    let statusobservation = document.getElementById('statusobservation').value;
    

    let code = "";
    switch(codeDisplay){
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
        status: statusobservation,
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
        issued: issuedmoment,  
          valueQuantity: {
            value: value,
            unit: unit,
            system: "http://unitsofmeasure.org",
        }
    }


    console.log(JSON.stringify(fhirUpdateData));

    fetch(`${baseUrl}/Observation/${id}`,{
        method: "PUT",
        body: JSON.stringify(fhirUpdateData),
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){

        console.log(json);
        alert("更改成功");
        console.log(JSON.stringify(fhirUpdateData));

    })
    .catch(err => console.log(err));


}


//新增一筆
function addObservation(id) {

    let extraData = $('#extraData');
    extraData.html("");

    extraData.append(`
                
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">檢驗報告生效日期：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="issued">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">檢驗項目：</label>
            <div class="col-sm-8">
                <select class="form-select" id="codeDisplay">
                    <option selected>請選擇檢驗項目</option>
                    <option value="Body temperature">Body temperature</option>
                    <option value="Blood pressure">Blood pressure</option>
                    <option value="Heart rate">Heart rate</option>
                    <option value="Respiratory rate">Respiratory rate</option>
                    <option value="SpO2">SpO2</option>
                    <option value="Blood Glucose">Blood Glucose</option>

                </select>
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">檢驗值/單位：</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" id="value">
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
            <label class="col-sm-4 col-form-label">生理量測填寫狀態：</label>
            <div class="col-sm-8">
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="status-registered" name="status" class="custom-control-input" value="registered">
                    <label class="custom-control-label" for="status-registered">掛號</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="status-preliminary" name="status" class="custom-control-input" value="preliminary">
                    <label class="custom-control-label" for="status-preliminary">初步</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="status-final" name="status" class="custom-control-input" value="final">
                    <label class="custom-control-label" for="status-final">完成</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="status-amended" name="status" class="custom-control-input" value="amended">
                    <label class="custom-control-label" for="status-amended">修正</label>
                </div>
            </div>
        </div>
        <button onclick="postObservation(${id})" class="btn btn-primary">新增內容</button>
    `);
}