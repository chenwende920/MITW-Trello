
function listPatientWithEdit(id) {

    let detailContent = $('#detailContent');

    let namefamily = document.getElementById('namefamily').value;

    let namegiven = document.getElementById('namegiven').value;
    let identifier = document.getElementById('identifier').value;
    let telecom = document.getElementById('telecom').value;
    let gender = document.getElementById('gender').value;
    let birthDate = document.getElementById('birthDate').value;
    let address = document.getElementById('address').value;

    let tagid = "001c936a-17b0-4fc6-927d-fb33a6865542";
    

    let fhirUpdateData = {
        resourceType: "Patient",
        id: id.toString(),
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
            text: namefamily+namegiven,
            family: namefamily,
            given: [
                namegiven
            ]
        }],
        gender: gender,
        birthDate: birthDate,
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


    alert(JSON.stringify(fhirUpdateData));

    fetch(`${baseUrl}/Patient/${id}`,{
        method: 'PUT',
        headers: baseheader,
        body: JSON.stringify(fhirUpdateData),
    })
    .then(resource => resource.json())
    .then(function(json) {

        console.log(json);
        alert("更改成功");
    })
    .catch(err => console.log(err))



}