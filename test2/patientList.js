const baseUrl = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    // 'Authorization': `Bearer ${token}`
    
});



function listPatients() {

    let content = $('#content');
    // let patients = $('#patients');

    content.html("");

    // let content = document.getElementById('content');
    // let patients = document.getElementById('patients');


    fetch(`${baseUrl}/Patient`,{
        method: 'GET',
        headers: baseheader
    })
    .then(response => response.json()) //解析成一個json物件
    .then(function(json){
        console.log(json); //顯示整個資料
        console.log(json.entry.length); //顯示資料數量


        for(let i=0; i<json.entry.length; i++) {
            // patients.append(patientId.textContent = json.entry[i].resource.id);

            console.log("病患ID: "+json.entry[i].resource.id);

            // console.log("病患名字: "+json.entry[i].resource.name[0].text);

            console.log("病患性別: "+json.entry[i].resource.gender);



            console.log(" ------------------------ ");

        }

        let id = json.entry.map(entry => entry.resource.id);
        let gender = json.entry.map(entry => entry.resource.gender);
        let identifier = json.entry.map(entry => (entry.resource.identifier )?entry.resource.identifier[0].value:"");
        let name = json.entry.map(entry => (entry.resource.name )?entry.resource.name[0].text:"");

        console.log("測試用的id: "+ id);
        console.log("測試用的gender: "+ gender);
        console.log("測試用的identifier: "+ identifier);
        console.log("測試用的name: "+ name);


        let patinetsBody = json.entry;

        // patinetsBody.map(entry => {
        //     patients.innerHTML =
        //         `<tr>
        //             <td>${entry.resource.id}</td>
        //             <td>${(entry.resource.identifier)?entry.resource.identifier[0].value:""}</td>
        //             <td>${entry.resource.name}</td>
        //             <td>${entry.resource.id}</td>
        //         </tr>`
            
        // });

        content.append(`<table class="table table-striped">
            <thead class="thead">
            <tr class="table-dark">
                <th scope="col">id</th>
                <th scope="col">身分證字號</th>
                <th scope="col">姓名</th>
                <th scope="col">查詢</th>
            </tr>
            </thead>
            <tbody id="patients"> </tbody>
        </table>`);


    

        patinetsBody.map(entry => {
            $('#patients').append(
                `<tr>
                    <td>${entry.resource.id}</td>
                    <td>${(entry.resource.identifier)?entry.resource.identifier[0].value:""}</td>
                    <td>${(entry.resource.name )?entry.resource.name[0].text:""}</td>
                    <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getPatient(${entry.resource.id})">查看</button></td>
               </tr>`
            )
        });
        console.log(json.link);


        // 顯示下一頁資料
        if(json.link.length > 0 && json.link[1].relation === 'next'){
            content.append(`<a onclick="listPatientWithUrl('${json.link[1].url}')" class="btn btn-primary">下一頁</a>`);
        }

    })
    .catch(err => console.log(err));

}

function listPatientWithUrl(url) {
    let content = $('#content');

    content.html("");

    fetch(`${url}`)
    .then(response => response.json())
    .then(function(json) {

        let patinetsBody = json.entry;

        console.log("資料數量為: "+json.total); //顯示資料數量
        console.log(json.link); //顯示資料search的方法


        content.append(`<table class="table table-striped">
        <thead class="thead">
        <tr class="table-dark">
            <th scope="col">id</th>
            <th scope="col">身分證字號</th>
            <th scope="col">姓名</th>
            <th scope="col">查詢</th>
        </tr>
        </thead>
        <tbody id="patients"> </tbody>
        </table>`);


        patinetsBody.map(entry => {
            $('#patients').append(
                `<tr>
                    <td>${entry.resource.id}</td>
                    <td>${(entry.resource.identifier)?entry.resource.identifier[0].value:""}</td>
                    <td>${(entry.resource.name )?entry.resource.name[0].text:""}</td>
                    <td><button class="btn btn-secondary rounded-pill btn-sm" onclick="getPatient(${entry.resource.id})">查看</button></td>
            </tr>`
            )
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

    })
}