// Variables

var baseUrl = "http://localhost:8080";
var fallbackRoute = "dashboard.html";

// Read URL parameters

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

/**
 * -----------------------------------------------------------------------
 * UI Functions
 * -----------------------------------------------------------------------
 */

/**
 * Display Errors in Page
 * @param {Array} errorArray Errors
 */
function displayErrors(errorArray) {
    let errors = '';
    $.each(errorArray, function (key, error) {
        errors = errors + '<li>' + error + '</li>';
    });
    let printStr = '<div class="alert alert-danger alert-dismissible mt-3 fade show errorMessage" role="alert"><strong>Error!</strong> Operation failed. Please check the errors and retry.<ul>' + errors + '</ul><button type="button" class="close"data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('#title').after(printStr);
}

/**
 * -----------------------------------------------------------------------
 * Database Functions
 * -----------------------------------------------------------------------
 */

/**
 * Hospital CURD Functions & Helper Functions
 */

/**
 * Load Hospital List
 */
function loadHospitalList() {
    $.ajax({
        type: "GET",
        url: baseUrl + '/lists/hospitals',
        dataType: "json",
        success: function (data, status, xhr) {
            let hospitals = data.data;
            $.each(hospitals, function(key, hospital){
                let printStr = '<tr><td>' + hospital.name + '</td><td>' + hospital.director + '</td><td>' + hospital.geolocation_x + ',' + hospital.geolocation_y + '</td><td>' + hospital.district + '</td><td>' + hospital.patient_count + '</td><td><a href="edit-hospital.html?id=' + hospital.id + '" class="btn btn-outline-primary btn-sm">Edit</a></td></tr>';
                $('#hospitals-list tr:last').after(printStr); 
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert('Something went wrong! ' + errorMessage);
        }
    });
}

/**
 * Load details of Hospital
 * @param {number} id Hospital ID
 */
function editHospital(id){
    $.ajax({
        type: "GET",
        url: baseUrl + '/hospital?id=' + id,
        dataType: "json",
        success: function (data, status, xhr) {
            let hospital = data.data;
            $('#name').val(hospital.name);
            $('#district').val(hospital.district);
            $('#geolocation_x').val(hospital.geolocation_x);
            $('#geolocation_y').val(hospital.geolocation_y);
            $('#doctor').val(hospital.user_id).change();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert('Something went wrong! ' + errorMessage);
        }
    });
}

/**
 * Add new hospital
 * @param {form} form Form
 */
function addHospital(form) {
    $.ajax({
        type: "POST",
        url: baseUrl + '/hospital?' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Hospital added successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            toastr.error('Something went wrong! ' + errorMessage, 'Error')
        }
    });
}

/**
 * Update hospital
 * @param {number} id Hospital ID
 * @param {form} form Form
 */
function updateHospital(id, form){
    $.ajax({
        type: "PUT",
        url: baseUrl + '/hospital?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Hospital updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            toastr.error('Something went wrong! ' + errorMessage, 'Error')
        }
    });
}

/**
 * 
 * @param {number} id Hospital ID
 */
function deleteHospital(id) {
    $.ajax({
        type: "DELETE",
        url: baseUrl + '/hospital?id=' + id,
        success: function (data, status, xhr) {
            toastr.success('Hospital deleted successfully', 'Delete Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            toastr.error('Something went wrong! ' + errorMessage, 'Error')
        }
    });
}

/**
 * Load doctors to dropdown list
 */
function loadDoctorsToDropdown() {
    $.ajax({
        type: "GET",
        url: baseUrl + '/lists/doctors',
        dataType: "json",
        success: function (data, status, xhr) {
            $.each(data.data, function (key, doctor) {
                $('#doctor').append('<option value=' + doctor.id + '>' + doctor.name + '</option>');
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert('Something went wrong! ' + errorMessage);
        }
    });
}


/**
 * Patient CURD & Helper Functions
 */


/**
 * Profile
 */

/**
 * Load details of user
 * @param {number} id User ID
 */
function editProfile(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + '/user?id=' + id,
        dataType: "json",
        success: function (data, status, xhr) {
            let user = data.data;
            $('#name').val(user.name);
            $('#email').val(user.email);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert('Something went wrong! ' + errorMessage);
            window.location.replace(fallbackRoute);
        }
    });
}

/**
 * Update profile
 * @param {number} id User ID
 * @param {form} form Form
 */
function updateProfile(id, form) {
    $.ajax({
        type: "POST",
        url: baseUrl + '/user?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Profile updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            toastr.error('Something went wrong! ' + errorMessage, 'Error')
        }
    });
}

/**
 * Update password
 * @param {number} id User ID
 * @param {form} form Form
 */
function updatePassword(id, form) {
    $.ajax({
        type: "PUT",
        url: baseUrl + '/user?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Password updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.responseJSON != null){
                displayErrors(jqXhr.responseJSON.errors);
            }else{
                toastr.error('Something went wrong! ' + errorMessage, 'Error');
            }
        }
    });
}