

function getMedication(id) {
    let detailContent = $('#detailContent');
    
    detailContent.html("");

    fetch(`${baseUrl}/MedicationRequest/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);
        


        let issued = moment(json.issued).format('YYYY-MM-DDTHH:mm');

        detailContent.append(`
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



        <a onclick="listObservationWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);

    })
    .catch(err => console.log(err));




    fetch(`${baseUrl}/MedicationDispense/?prescription=${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);
        


        let issued = moment(json.issued).format('YYYY-MM-DDTHH:mm');

        detailContent.append(`
        <h4>Request</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">用藥劑量：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="quantity" value="${json.authoredOn}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">用藥天數：</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" id="daysSupplyValue" value="${(json.daysSupply)?(json.daysSupply.value):""}">
            </div>
            <div class="col-sm-3">
                <input type="text" class="form-control" id="daysSupplyUnit" value="${(json.daysSupply)?(json.daysSupply.unit.value):""}">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">幾天幾次：</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" id="dosageInstructionPeriod" value="${(json.dosageInstruction[0])?(json.dosageInstruction[0].timing.repeat.period.value):""}">
            </div>
            <div class="col-sm-3">
                <input type="text" class="form-control" id="dosageInstructionfrequency" value="${(json.dosageInstruction[0])?(json.dosageInstruction[0].timing.repeat.frequency.value):""}">
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">用藥用法：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="routeDisplay" value="${(json.dosageInstruction[0])?(json.dosageInstruction[0].route.coding[0].display.value):""}" />
            </div>
        </div>


        `);

    })
    .catch(err => console.log(err));




}


//搜尋查看詳細病患內容
function searchMedication() {

    let searchId = document.getElementById('searchId').value;
    let detailContent = $('#detailContent');

    detailContent.html("");

    if( searchId == ""){
        alert("Please enter");
    };

    fetch(`${baseUrl}/Observation/${searchId}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {
        
        let issued = moment(json.issued).format('YYYY-MM-DDTHH:mm');
        detailContent.append(`
        <h4>派遣案件</h4>
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
                <input type="text" class="form-control" id="status" value="${json.status}" />
            </div>
        </div>
        <a onclick="listObservationWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);

    })
    .catch(err => console.log(err));

}



