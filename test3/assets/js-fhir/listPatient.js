const listPatient = () => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Patient`)
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
            <tbody id="patientTableBody"> </tbody>
        </table>`);

        patientList.map( entry => {
            $('#patientTableBody').append(`
            <tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.identifier)?entry.resource.identifier[0].value: ""}</td>
                <td>${entry.resource.gender}</td>
                <td>${entry.resource.birthDate}</td>
                <td><button class="btn btn-info btn-sm" onclick="getPatient(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示下一頁資料
        if(json.link.length > 0 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listPatientWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }
    });
};

const listPatientWithUrl = (url) => {
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
            <tbody id="patientTableBody"> </tbody>
        </table>`);

        patientList.map( entry => {
            $('#patientTableBody').append(`
            <tr>
                <td>${entry.resource.id}</td>
                <td>${(entry.resource.identifier)?entry.resource.identifier[0].value: ""}</td>
                <td>${entry.resource.gender}</td>
                <td>${entry.resource.birthDate}</td>
                <td><button class="btn btn-info btn-sm" onclick="getPatient(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listPatientWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listPatientWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listPatientWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }
    });
}