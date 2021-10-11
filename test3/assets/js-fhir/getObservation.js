const getObservation = (id) => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Observation/${id}`)
    .then(res => res.json())
    .then(json => {
        console.log(json);
        content.empty();
        content.append(`
        <form>
            <h3>患者資料</h3>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">病人 ID</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="subject" value="${(json.subject)?(json.subject.reference):""}" readonly> 
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">檢驗報告生效日期</label>
                <div class="col-sm-10">
                    <input type="datetime-local" class="form-control" id="effectiveDateTime" value="${(json.effectiveDateTime)?(json.effectiveDateTime):""}" readonly>
                </div>
            </div>
            <h3>檢驗資料</h3>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">檢驗項目</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="code" value="${(json.code)?(json.code.coding[0].display):""}" readonly>
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">檢驗值／單位</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="value" value="${(json.valueQuantity.value)?(json.valueQuantity.value):""}" readonly>
                </div>
                <div class="col-sm-2">
                    <input type="text" class="form-control" id="unit" value="${(json.valueQuantity.unit)?(json.valueQuantity.unit):""}" readonly>
                </div>
            </div>
            <h3>參考值</h3>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">最大</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="high" value="${(json.referenceRange[0].high.value)?(json.referenceRange[0].high.value + ' ' + json.referenceRange[0].high.unit):""}" readonly>
                </div>
                <label class="col-sm-2 col-form-label">最小</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="low" value="${(json.referenceRange[0].low.value)?(json.referenceRange[0].low.value + ' ' + json.referenceRange[0].low.unit):""}" readonly>
                </div>
            </div>

            <a onclick="uploadObservationForm()" class="btn btn-primary">送出</button>
        </form>
         `);
    });
}