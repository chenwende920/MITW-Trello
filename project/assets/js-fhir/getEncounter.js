
function getEncounter(id) {

    let detailContent = $('#detailContent');

    detailContent.html("");
    detailContent.show();

    fetch(`${baseUrl}/Encounter/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);
        

        try{
            var ArrivedStartValue = (moment((json.statusHistory[0])?(json.statusHistory[0].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var ArrivedEndValue = (moment((json.statusHistory[0])?(json.statusHistory[0].period.end):"").format('YYYY-MM-DDTHH:mm'));
            var InprogressStartValue = (moment((json.statusHistory[0])?(json.statusHistory[1].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var InprogressEndValue = (moment((json.statusHistory[0])?(json.statusHistory[1].period.end):"").format('YYYY-MM-DDTHH:mm'));
            var OnleaveStartValue = (moment((json.statusHistory[0])?(json.statusHistory[2].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var OnleaveEndValue = (moment((json.statusHistory[0])?(json.statusHistory[2].period.end):"").format('YYYY-MM-DDTHH:mm'));

            var hospitalization = (json.hospitalization.admitSource.coding)?(json.hospitalization.admitSource.coding[0].display):"";
        }
        catch{
            var ArrivedStartValue = "";
            var ArrivedEndValue = "";
            var InprogressStartValue = "";
            var InprogressEndValue = "";
            var OnleaveStartValue = "";
            var OnleaveEndValue = "";

            var hospitalization = "";
        }

        var foundPatientId = json.subject.reference;
        var foundPatientIdarray = foundPatientId.split('/');


        detailContent.append(`
        <h4>派遣案件</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">派遣單狀態：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="status" value="${json.status}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">填寫時間：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="writeperiod" value="${json.period.start}">
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">出勤時間：</label>
        <div class="col-sm-8">
            <input type="datetime-local" class="form-control" id="statusHistoryArrivedStart" value="${ArrivedStartValue}" >
        </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">到達現場時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryArrivedEnd" value="${ArrivedEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">離開現場時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" id="statusHistoryInprogressStart"  class="form-control" value="${InprogressStartValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">送達醫院時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryInprogressEnd" value="${InprogressEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">離開醫院時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryOnleaveStart" value="${OnleaveStartValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">返隊待命時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryOnleaveEnd" value="${OnleaveEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">發生地點：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="accidentLocation" value="${(json.location)?(json.location[0].location.display):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">送往地點：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="hospitalization" value="${hospitalization}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">病患ID：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="patientID" value="${(json.subject)?(json.subject.reference):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">派遣單位ID：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="organizationID" value="${(json.serviceProvider)?(json.serviceProvider.reference):""}" >
            </div>
        </div>
        <div class="row align-items-end">
            <div class="col"><button onclick="putEncounter(${json.id})" class="btn btn-primary">更新內容</button></div>
            <div class="col"><button onclick="getPatient(${foundPatientIdarray[1]})" class="btn btn-outline-primary">病患資料</button></div>
            <div class="col"><button onclick="uploadObservation(${json.id})" class="btn btn-outline-primary">生理量測</button></div>
            <div class="col"><button onclick="uploadMedicationBundle(${json.id})" class="btn btn-outline-primary">用藥資料</button></div>
        </div>    

        <div id="extraData" class="pt-3">
        
        </div>
        `);


    })
    .catch(err => console.log(err));

}



//搜尋查看詳細病患內容
function searchEncounter() {

    let searchId = document.getElementById('searchId').value;
    let detailContent = $('#detailContent');

    detailContent.html("");
    detailContent.show();

    if( searchId == ""){
        alert("Please enter");
    };

    fetch(`${baseUrl}/Encounter/${searchId}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {
        
        try{
            var ArrivedStartValue = (moment((json.statusHistory[0])?(json.statusHistory[0].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var ArrivedEndValue = (moment((json.statusHistory[0])?(json.statusHistory[0].period.end):"").format('YYYY-MM-DDTHH:mm'));
            var InprogressStartValue = (moment((json.statusHistory[0])?(json.statusHistory[1].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var InprogressEndValue = (moment((json.statusHistory[0])?(json.statusHistory[1].period.end):"").format('YYYY-MM-DDTHH:mm'));
            var OnleaveStartValue = (moment((json.statusHistory[0])?(json.statusHistory[2].period.start):"").format('YYYY-MM-DDTHH:mm'));
            var OnleaveEndValue = (moment((json.statusHistory[0])?(json.statusHistory[2].period.end):"").format('YYYY-MM-DDTHH:mm'));

            var hospitalization = (json.hospitalization.admitSource.coding)?(json.hospitalization.admitSource.coding[0].display):"";
        }
        catch{
            var ArrivedStartValue = "";
            var ArrivedEndValue = "";
            var InprogressStartValue = "";
            var InprogressEndValue = "";
            var OnleaveStartValue = "";
            var OnleaveEndValue = "";

            var hospitalization = "";
        }

        var foundPatientId = json.subject.reference;
        var foundPatientIdarray = foundPatientId.split('/');

        detailContent.append(`
        <h4>派遣案件</h4>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">派遣單狀態：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="status" value="${json.status}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">填寫時間：</label>
            <div class="col-sm-8">
                <input type="date" class="form-control" id="writeperiod" value="${json.period.start}">
            </div>
        </div>
        <div class="form-group row p-2">
        <label class="col-sm-4 col-form-label">出勤時間：</label>
        <div class="col-sm-8">
            <input type="datetime-local" class="form-control" id="statusHistoryArrivedStart" value="${ArrivedStartValue}" >
        </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">到達現場時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryArrivedEnd" value="${ArrivedEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">離開現場時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" id="statusHistoryInprogressStart"  class="form-control" value="${InprogressStartValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">送達醫院時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryInprogressEnd" value="${InprogressEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">離開醫院時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryOnleaveStart" value="${OnleaveStartValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">返隊待命時間：</label>
            <div class="col-sm-8">
                <input type="datetime-local" class="form-control" id="statusHistoryOnleaveEnd" value="${OnleaveEndValue}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">發生地點：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="accidentLocation" value="${(json.location)?(json.location[0].location.display):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">送往地點：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="hospitalization" value="${hospitalization}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">病患ID：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="patientID" value="${(json.subject)?(json.subject.reference):""}" >
            </div>
        </div>
        <div class="form-group row p-2">
            <label class="col-sm-4 col-form-label">派遣單位ID：</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="organizationID" value="${(json.serviceProvider)?(json.serviceProvider.reference):""}" >
            </div>
        </div>
        <div class="row align-items-end">
            <div class="col"><button onclick="putEncounter(${json.id})" class="btn btn-primary">更新內容</button></div>
            <div class="col"><button onclick="getPatient(${foundPatientIdarray[1]})" class="btn btn-outline-primary">病患資料</button></div>
            <div class="col"><button onclick="uploadObservation(${json.id})" class="btn btn-outline-primary">生理量測</button></div>
            <div class="col"><button onclick="uploadMedicationBundle(${json.id})" class="btn btn-outline-primary">用藥資料</button></div>
        </div>

        <div id="extraData" class="pt-3">
        
        </div>
        
        `);


    })
    .catch(err => console.log(err));

}


