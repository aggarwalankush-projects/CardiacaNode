var patient = {
    lastname: "P1",
    mrn: "1234"
};

var ca_data = [
    {
        cpr_time: "00:00:00",
        cpr: "CPR1",
        monitoring: {
            M11: "VM11",
            M12: "VM12"
        },
        intervention: {
            I11: "VI11",
            I12: "VI12"
        },
        bolus: {
            B11: "VB11",
            B12: "VB12"
        }
    },
    {
        cpr_time: "00:00:02",
        cpr: "CPR2",
        monitoring: {
            M21: "VM21",
            M22: "VM22"
        },
        intervention: {
            I21: "VI21",
            I22: "VI22"
        },
        bolus: {
            B21: "VB21",
            B22: "VB22"
        }
    }
];

var patientInfo={
    patient:patient,
    ca_data:ca_data
};



var dateToSearch= new Date();
var patientDetails={
    patientId: patient.mrn,
    date:dateToSearch.getTime()
};



//document.getElementById('patient').innerHTML = JSON.stringify(patient, null, 2);
document.getElementById('patientInfo').innerHTML = JSON.stringify(patientInfo, null, 2);
document.getElementById('patientDetails').innerHTML = JSON.stringify(patientDetails, null, 2);

//$("#patientForm").submit(function (e) {
//    e.preventDefault();
//    $.ajax({
//        type: "POST",
//        url: $(this).attr('action'),
//        data: JSON.stringify(patient),
//        contentType: 'application/json',
//        success: function (data) {
//            document.getElementById('patientResponse').innerText = data;
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            console.log(jqXHR);
//            console.log(textStatus);
//            console.log(errorThrown);
//        }
//    });
//});

$("#patientInfoForm").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: JSON.stringify(patientInfo),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('patientInfoResponse').innerText = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
});

$("#patientDetailsForm").submit(function (e) {
    e.preventDefault();
    document.getElementById("infoButton").disabled = true;
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: JSON.stringify(patientDetails),
        contentType: 'application/json',
        success: function (data) {
            $('#myframe').contents().find('html').html(data);
            document.getElementById("infoButton").disabled = false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
});

