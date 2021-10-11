const baseUrl = "https://hapi.fhir.tw/fhir"; //https://hapi.fhir.tw/fhir //http://hapi.fhir.org/baseR4 //https://api.dev.sita.tech/api/
const token = "001c936a-17b0-4fc6-927d-fb33a6865542";

const baseheader = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/fhir+json;charset=utf-8',
    // 'Authorization': `Bearer ${token}`
    
});


function PostData(){
    //Patient
    let getfamily = document.getElementById('family').value;
    let getgiven = document.getElementById('given').value
    
    let identifier = document.getElementById('identifier').value;
    let telecom = document.getElementById('telecom').value;
    //取得性別資訊
    let items = document.getElementsByName("gender");
    let get_gender = "";
    for(let i = 0; i < items.length;i++){
        if(items[i].checked){
            get_gender = items[i].value;
        }
    }
    let birth = document.getElementById('birthDate').value;
    let address = document.getElementById('address').value;


    

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";


    let fhirData = {
        resourceType: "Patient",
        meta: {
        tag : [{
            system: "http://loinc.org",
            code: tagid
            }]
        },
         
        identifier: [{
            use: "usual",
            value: identifier,
            type: {
                "text": "身份證字號"
            }
        }],
        name: [{
            use: "official",
            text: getfamily+getgiven,
            family: getfamily,
            given: [
                getgiven
            ]
        }],
        gender: get_gender,
        birthDate: birth,
        address: [{
            use: "home",
            text: address,
            country: "TW"
        }],
        telecom: [{
            system: "phone",
            value: telecom,
            use: "mobile"
        }],
        active: true
        
        
    }


    alert(JSON.stringify(fhirData));
    fetch(`${baseUrl}/Patient`,{
        method: "POST",
        body: JSON.stringify(fhirData),
        headers: baseheader
    })
    .then(response => response.json())
    .then(function(json){
        const resultData = document.getElementById("resultData");
        resultData.textContent = JSON.stringify(json);

    })


}



//https://hapi.fhir.tw/fhir/Patient/100320
//https://hapi.fhir.tw/fhir/Patient/100424