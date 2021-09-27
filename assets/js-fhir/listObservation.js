const listObservation = () => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Observation`)
    .then(res => res.json())
    .then(json => {
        content.empty();
        let ObservationList = json.entry;
            
        // 建立表格
        content.append(`<table class="table table-hover">
            <thead>
                <tr>
                    <th>id</th>
                    <th>病人 ID</th>
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
                <td>${(entry.resource.subject)?(entry.resource.subject.reference):""}</td>
                <td>${(entry.resource.code)?(entry.resource.code.coding[0].display):""}</td>
                <td>${entry.resource.valueQuantity.value} ${entry.resource.valueQuantity.unit}</td>
                <td><button class="btn btn-info btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示下一頁資料
        if(json.link.length > 0 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }
    });
};

const listObservationWithUrl = (url) => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${url}`)
    .then(res => res.json())
    .then(json => {
        content.empty();
        let patientList = json.entry;

        // 顯示資料筆數
        content.append(`<p>共找到 ${json.total} 筆資料</p>`)
            
        // 建立表格
        content.append(`<table class="table table-hover">
            <thead>
                <tr>
                    <th>id</th>
                    <th>身分證字號</th>
                    <th>性別</th>
                    <th>出生年月日</th>
                    <th>查看</th>
                </tr>
            </thead>
            <tbody id="ObservationTableBody"> </tbody>
        </table>`);

        patientList.map( entry => {
            $('#ObservationTableBody').append(`
            <tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.subject)?(entry.resource.subject.reference):""}</td>
                <td>${(entry.resource.code)?(entry.resource.code.coding[0].display):""}</td>
                <td>${entry.resource.valueQuantity.value} ${entry.resource.valueQuantity.unit}</td>
                <td><button class="btn btn-info btn-sm" onclick="getObservation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listObservationWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listObservationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }
    });
}