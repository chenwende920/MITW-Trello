

function getEncounter(id) {
    
    let detailContent = $('#detailContent');
    
    detailContent.html("");

    fetch(`${baseUrl}/Encounter/${id}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json())
    .then(function (json) {
        console.log(json);
        console.log("時間: "+moment().format());
        console.log("--------");

        try{
            console.log(json.statusHistory[0].period.start);
            console.log(moment(json.statusHistory[0].period.start).format('YYYY-MM-DD'));
        }
        catch{
            console.log("沒有資料");

        }
        

        let ArrivedStartValue = (moment(json.statusHistory[0].period.start).format('YYYY-MM-DDTHH:mm'));
        let ArrivedEndValue = (moment(json.statusHistory[0].period.end).format('YYYY-MM-DDTHH:mm'));
        let InprogressStartValue = (moment(json.statusHistory[1].period.start).format('YYYY-MM-DDTHH:mm'));
        let InprogressEndValue = (moment(json.statusHistory[1].period.end).format('YYYY-MM-DDTHH:mm'));
        let OnleaveStartValue = (moment(json.statusHistory[2].period.start).format('YYYY-MM-DDTHH:mm'));
        let OnleaveEndValue = (moment(json.statusHistory[2].period.end).format('YYYY-MM-DDTHH:mm'));

        console.log("--------");
        console.log(json);
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
                <input type="text" class="form-control" id="hospitalization" value="${(json.hospitalization.admitSource.coding)?(json.hospitalization.admitSource.coding[0].display):""}" >
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
        <a onclick="listEncounterWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);

    })
    .catch(err => console.log(err));
}



//搜尋查看詳細病患內容
function searchEncounter() {

    let searchId = document.getElementById('searchId').value;
    let detailContent = $('#detailContent');

    detailContent.html("");

    if( searchId == ""){
        alert("Please enter");
    };

    fetch(`${baseUrl}/Encounter/${searchId}`,{
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {
        
        let ArrivedStartValue = (moment(json.statusHistory[0].period.start).format('YYYY-MM-DDTHH:mm'));
        let ArrivedEndValue = (moment(json.statusHistory[0].period.end).format('YYYY-MM-DDTHH:mm'));
        let InprogressStartValue = (moment(json.statusHistory[1].period.start).format('YYYY-MM-DDTHH:mm'));
        let InprogressEndValue = (moment(json.statusHistory[1].period.end).format('YYYY-MM-DDTHH:mm'));
        let OnleaveStartValue = (moment(json.statusHistory[2].period.start).format('YYYY-MM-DDTHH:mm'));
        let OnleaveEndValue = (moment(json.statusHistory[2].period.end).format('YYYY-MM-DDTHH:mm'));

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
                <input type="text" class="form-control" id="hospitalization" value="${(json.hospitalization.admitSource.coding)?(json.hospitalization.admitSource.coding[0].display):""}" >
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
        <a onclick="listEncounterWithEdit(${json.id})" class="btn btn-primary">更新內容</a>
        `);


    })
    .catch(err => console.log(err));

}





