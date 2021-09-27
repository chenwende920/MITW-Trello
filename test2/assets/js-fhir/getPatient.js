const getPatient = (id) => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Patient/${id}`)
    .then(res => res.json())
    .then(json => {
        content.empty();

        content.append(`
        <form>
        <h3>基本資料</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">姓名</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="name" value="${(json.name)?(json.name[0].text):""}" readonly> 
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">身分證字號</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="identifier" value="${(json.identifier)?(json.identifier[0].value):""}" readonly>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">性別</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="identifier" value="${json.gender}" readonly>
            </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">出生年月日</label>
            <div class="col-sm-10">
                <input type="date" class="form-control" id="birthDate"  value="${(json.birthDate) || ""}" readonly>
            </div>
        </div>
        <h3>聯絡資料（非必填）</h3>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">電話</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="telecom" value="${(json.telecom)?(json.telecom[0].value):""}" readonly>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">地址</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="address" value="${(json.address)?(json.address[0].value):""}" readonly>
            </div>
        </div>
        `);

        // 抓 Observation 資料
        fetch(`${baseUrl}/Observation?subject=${id}`)
        .then(res => res.json())
        .then(response => {
            let ObservationList = response.entry;
            
             // 建立表格
            content.append(`
            <h2>檢驗記錄</h2>
            <p>共找到 ${response.total} 筆資料</p>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>檢驗項目</th>
                        <th>檢驗值</th>
                        <th>查看</th>
                    </tr>
                </thead>
                <tbody id="ObservationTableBody"> </tbody>
            </table>`);

            ObservationList.map( entry => {
                $('#ObservationTableBody').append(`
                <tr>
                    <td>${entry.resource.id}</td>
                    <td>${(entry.resource.code)?(entry.resource.code.coding[0].display):""}</td>
                    <td>${entry.resource.valueQuantity.value} ${entry.resource.valueQuantity.unit}</td>
                    <td><button class="btn btn-info btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
                </tr>
                `);
            });

            // 顯示下一頁資料
            if(response.link.length > 1 && response.link[1].relation === 'next'){
                content.append(`<a onclick="listObservationInPatient('${response.link[1].url}')" class="btn btn-primary" id="nextPage">下一頁</a>`);
            }
        });
    });
};

const listObservationInPatient = (url) => {
    let table = $('#ObservationTableBody');

    // 清空表格
    table.empty();
    
     // 抓資料
    fetch(`${url}`)
    .then(res => res.json())
    .then(json => {
        let ObservationList = json.entry;

        ObservationList.map(entry => {
            $('#ObservationTableBody').append(`
                <tr>
                    <td>${entry.resource.id}</td>
                    <td>${(entry.resource.code)?(entry.resource.code.coding[0].display):""}</td>
                    <td>${entry.resource.valueQuantity.value} ${entry.resource.valueQuantity.unit}</td>
                    <td><button class="btn btn-info btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
                </tr>
                `);
        });

        // 清空按紐
        $('#nextPage').remove();
        $('#prevPage').remove();

        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listObservationInPatient('${json.link[1].url}')" class="btn btn-primary" id="prevPage">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listObservationInPatient('${json.link[2].url}')" class="btn btn-primary" id="prevPage">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listObservationInPatient('${json.link[1].url}')" class="btn btn-primary" id="nextPage">下一頁</a>`);
        }
    });
}