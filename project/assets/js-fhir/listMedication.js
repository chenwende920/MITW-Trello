
function listMedication(){

    let content = $('#content');
    let detailContent = $('#detailContent');
    detailContent.hide();

    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");

    // 抓資料
    fetch(`${baseUrl}/Bundle?_count=150`, {
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {
        content.empty();
        let MedicationList = json.entry;
        console.log(MedicationList)

        let list = MedicationList.filter( Medication => Medication.resource.entry[0].resource.resourceType == "Medication")
        console.log(list.length)
        console.log(list)


        content.append(`
        <div class="form-group row">
            <label class="label label-default" style="font-size:40px; position: relative; top: -5px; left: 16px;">搜尋</label>
            <div class="col-xs-2">
                <div class="input-group" >
                <input type="text" class="form-control" placeholder="Search"" id="search">
                    <div class="input-group-btn">
                        <button class="form-control" type="submit" onclick="searchMedication()" style="width: 50px">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`)
        content.append(`<div class="col-md-12" id="content2"></div>`)


        content.append(`<p>共找到 ${(list.length)?(list.length):""} 筆資料</p>`)        
            
        // 建立表格
        content.append(`
        <h3>藥物清單</h3>
        <table class="table table-striped">
            <thead class="thead">
                <tr class="table-dark">
                    <th>med_name</th>
                    <th>code</th>
                    <th>status</th>
                    <th>manufacturer</th>
                    <th>查看</th>
                </tr>
            </thead>
            <tbody id="MedicationTableBody"> </tbody>
        </table>`);

        list.map( entry => {
            $('#MedicationTableBody').append(`
            <tr>
                <td>${(entry.resource.entry[0].resource.code.coding)?(entry.resource.entry[0].resource.code.coding[0].display):""}</td>
                <td>${(entry.resource.entry[0].resource.code.text)?(entry.resource.entry[0].resource.code.text):""}</td>
                <td>${(entry.resource.entry[0].resource.status)?(entry.resource.entry[0].resource.status):""}</td>
                <td>${(entry.resource.entry[0].resource.contained)?(entry.resource.entry[0].resource.contained[0].name):""}</td>
                <td><button class="btn btn-info btn-sm" onclick="getInformation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示下一頁資料
        // if(json.link.length > 0 && json.link[1].relation === 'next'){
        //     content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        // }
    });
};

const listMedicationWithUrl = (url) => {
    let content = $('#content');
    
    // 清空畫面並顯示 Loading 訊息
    content.empty();
    content.append("<p> Loading... </p>");
    

    // 抓資料
    fetch(`${url}/Bundle`)
    .then(res => res.json())
    .then(json => {
        content.empty();
        let MedicationList = json.entry;
        let list = MedicationList.filter( Medication => Medication.resource.entry[0].resource.resourceType == "Medication")

        // 顯示資料筆數
        content.append(`<p>共找到 ${json.total} 筆資料</p>`)
            
        // 建立表格
        content.append(`<table class="table table-hover">
            <thead>
                <tr>
                    <th>med_name</th>
                    <th>code</th>
                    <th>status</th>
                    <th>manufacturer</th>
                    <th>查看</th>
                </tr>
            </thead>
            <tbody id="MedicationTableBody"> </tbody>
        </table>`);

        list.map( entry => {
            $('#MedicationTableBody').append(`
            <tr>
                <td>${entry.resource.entry[0].resource.id}</td>
                <td>${(entry.resource.entry[0].resource.code)?(entry.resource.entry[0].resource.code.coding[0].code):""}</td>
                <td>${(entry.resource.entry[0].resource.status)?(entry.resource.entry[0].resource.status):""}</td>
                <td>${(entry.resource.entry[0].resource.contained)?(entry.resource.entry[0].resource.contained[0].name):""}</td>
                <td><button class="btn btn-info btn-sm" onclick="getInformation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示上一頁資料
        if(json.link.length === 2 && json.link[1].relation === 'previous'){ // 最末頁
            content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">上一頁</a>`);
        } else if (json.link.length === 3 && json.link[2].relation === 'previous'){
            content.append(`<a onclick="listMedicationWithUrl('${json.link[2].url}')" class="btn btn-primary">上一頁</a>`);
        }

        // 顯示下一頁資料
        if(json.link.length > 1 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }
    });
}







const searchMedication = () => {
    
    let content2 = $('#content2');

    content2.empty();
    content2.append("<p> Loading... </p>");

    fetch(`${baseUrl}/Bundle?_count=150`, {
        method: 'GET',
        headers: baseheader
    })
    .then(res => res.json())
    .then(json => {
        content2.empty();
        let MedicationList = json.entry;

        let list = MedicationList.filter(
            Medication => Medication.resource.entry[0].resource.resourceType == "Medication" & Medication.resource.entry[0].resource.id == $('#search').val())

        content2.append(`<p>共找到 ${(list.length)?(list.length):""} 筆資料</p>`)
        console.log(list)
            
        // 建立表格
        content2.append(`
        <h3>藥物清單</h3>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>med_name</th>
                    <th>code</th>
                    <th>status</th>
                    <th>manufacturer</th>
                    <th>查看</th>
                </tr>
            </thead>
            <tbody id="MedicationTableBody"> </tbody>
        </table>`);

        list.map( entry => {
            $('#MedicationTableBody').append(`
            <tr>
                <td>${(entry.resource.entry[0].resource.code.coding)?(entry.resource.entry[0].resource.code.coding[0].display):""}</td>
                <td>${(entry.resource.entry[0].resource.code.text)?(entry.resource.entry[0].resource.code.text):""}</td>
                <td>${(entry.resource.entry[0].resource.status)?(entry.resource.entry[0].resource.status):""}</td>
                <td>${(entry.resource.entry[0].resource.contained)?(entry.resource.entry[0].resource.contained[0].name):""}</td>
                <td><button class="btn btn-info btn-sm" onclick="getInformation(${entry.resource.id})">查看</button></td>
            </tr>
            `)
        });

        // 顯示下一頁資料
        // if(json.link.length > 0 && json.link[1].relation === 'next'){
        //     content2.append(`<a onclick="listMedicationWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        // }
    });
}