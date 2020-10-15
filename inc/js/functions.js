// Variables

var apiUrl = "http://localhost:8080";
var baseUrl = "http://localhost/ncms"
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
 * @param {Array} jqXhr Ajax Response
 * @param {boolean} redirect Redirect After Error
 */

function ajaxErrorHandle(jqXhr, redirect = false) {
    if (jqXhr.responseJSON != null) {
        let errors = '';
        $.each(jqXhr.responseJSON.errors, function (key, error) {
            errors = errors + '<li>' + error + '</li>';
        });
        let printStr = '<div class="alert alert-danger alert-dismissible mt-3 fade show errorMessage" role="alert"><strong>Error!</strong> Operation failed. Please check the errors and retry.<ul>' + errors + '</ul><button type="button" class="close"data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#title').after(printStr);
    } else {
        toastr.error('Something went wrong!', 'Error');
    }

    if (redirect){
        window.location.replace(fallbackRoute);
    }
}

/**
 * -----------------------------------------------------------------------
 * Authentication & Role Check
 * -----------------------------------------------------------------------
 */

/**
 * Middleware for login check
 */
$(function () {
    let id = Cookies.get('userId');
    let role = Cookies.get('role');

    if (!id || !role){
        Cookies.remove('userId');
        Cookies.remove('role');
        window.location.replace('index.html');
    }
});

/**
 * Middleware for role based access
 */
$(function () {
    let role = Cookies.get('role');
    let path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    
    let mohUrls = [
        'users.html',
        'add-user.html',
        'edit-user.html',
        'hospitals.html',
        'add-hospital.html',
        'edit-hospital.html',
        'profile.html',
        'patients.html',
    ];

    let doctorUrls = [
        'profile.html',
        'patients.html',
    ];

    let patientUrls = [
        
    ];

    // Patient
    if (role == 0){
        if (jQuery.inArray(path, patientUrls) === -1) {
            window.location.replace('index.html');
        }
    }

    // MoH
    if (role == 1){
        if (jQuery.inArray(path, mohUrls) === -1){
            window.location.replace('index.html');
        }
    }

    // Doctor
    if (role == 2) {
        if (jQuery.inArray(path, doctorUrls) === -1) {
            window.location.replace('index.html');
        }
    }
});

/**
 * -----------------------------------------------------------------------
 * Database Functions
 * -----------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------
 * Hospital CURD Functions & Helper Functions
 * -----------------------------------------------------------------------
 */

/**
 * Load Hospital List
 */
function loadHospitalList() {
    $.ajax({
        type: "GET",
        url: apiUrl + '/lists/hospitals',
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
        url: apiUrl + '/hospital?id=' + id,
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
        url: apiUrl + '/hospital?' + form.serialize(),
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
        url: apiUrl + '/hospital?id=' + id + '&' + form.serialize(),
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
        url: apiUrl + '/hospital?id=' + id,
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
        url: apiUrl + '/lists/doctors',
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
 * -----------------------------------------------------------------------
 * Patient CURD & Helper Functions
 * -----------------------------------------------------------------------
 */

/**
 * Load Patient List
 */
function loadPatientList(hospital, status) {
    $.ajax({
        type: "GET",
        url: apiUrl + '/lists/patients?hospital=' + hospital + '&status=' + status,
        dataType: "json",
        success: function (data, status, xhr) {
            let patients = data.data;
            $("#patients-list > tbody").html("");
            $.each(patients, function (key, patient) {
                let printStr = '<tr><td>' + patient.name + '</td><td>' + patient.contact_number + '</td><td>' + patient.geolocation_x + ',' + patient.geolocation_y + '</td><td>' + patient.district + '</td><td>' + ((patient.decease_level == null) ? 'N/A' : patient.decease_level) + '</td><td>' + ((patient.hospital == null) ? 'In Queue' : patient.hospital) + '</td><td><a href="edit-patient.html?id=' + patient.id + '" class="btn btn-outline-primary btn-sm">Edit</a></td></tr>';
                $('#patients-list > tbody').append(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Load hospital of the doctor
 * @param {number} id User ID
 */
function loadHospitalOfDoctorToDropdown(id) {
    $.ajax({
        type: "GET",
        url: apiUrl + '/user?id=' + id,
        dataType: "json",
        success: function (data, status, xhr) {
            let user = data.data;
            $('#hospital').append('<option value=' + hospital.id + '>My Hospital</option>');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr, true);
        }
    });
}

/**
 * -----------------------------------------------------------------------
 * User Management CURD & Helper Functions
 * -----------------------------------------------------------------------
 */

/**
 * Load Users List
 */
function loadUsersList() {
    let id = Cookies.get('userId');
    $.ajax({
        type: "GET",
        url: apiUrl + '/lists/users',
        dataType: "json",
        success: function (data, status, xhr) {
            let users = data.data;
            $.each(users, function (key, user) {
                let printStr = '';
                if (id == user.id){
                    printStr = '<tr><td>' + user.name + '</td><td>' + user.email + '</td><td>' + ((user.hospital == null) ? '-' : user.hospital) + '</td><td>' + ((user.role == 1) ? 'MOH' : 'Doctor') + '</td><td><a href="profile.html" class="btn btn-outline-primary btn-sm">View Profile</a></td></tr>';
                }else{
                    printStr = '<tr><td>' + user.name + '</td><td>' + user.email + '</td><td>' + ((user.hospital == null) ? '-' : user.hospital) + '</td><td>' + ((user.role == 1) ? 'MOH' : 'Doctor') + '</td><td><a href="edit-user.html?id=' + user.id + '" class="btn btn-outline-primary btn-sm">Edit</a></td></tr>';
                }
                $('#users-list tr:last').after(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Add new user
 * @param {form} form Form
 */
function addUser(form) {
    $.ajax({
        type: "POST",
        url: apiUrl + '/register?' + form.serialize(),
        success: function (data, status, xhr) {
            form.trigger("reset");
            toastr.success('User added successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Load details of User
 * @param {number} id Hospital ID
 */
function editUser(id) {
    $.ajax({
        type: "GET",
        url: apiUrl + '/user?id=' + id,
        dataType: "json",
        success: function (data, status, xhr) {
            let user = data.data;
            $('#name').val(user.name);
            $('#email').val(user.email);
            $('#role').val(user.role).change();
            $('#hospital').val(user.hospitalId).change();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr, true);
        }
    });
}

/**
 * Update user details
 * @param {number} id User ID
 * @param {form} form Form
 */
function updateUser(id, form) {
    $.ajax({
        type: "POST",
        url: apiUrl + '/user?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('User updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Update user password
 * @param {number} id User ID
 * @param {form} form Form
 */
function updateUserPassword(id, form) {
    $.ajax({
        type: "PUT",
        url: apiUrl + '/user?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('User password updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Delete user
 * @param {number} id User ID
 */
function deleteUser(id) {
    $.ajax({
        type: "DELETE",
        url: apiUrl + '/user?id=' + id,
        success: function (data, status, xhr) {
            toastr.success('User deleted successfully', 'Delete Complete');
            window.location.replace("users.html");
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}


/**
 * Load hospitals to dropdown list
 */
function loadHospitalsToDropdown() {
    $.ajax({
        type: "GET",
        url: apiUrl + '/lists/hospitals',
        dataType: "json",
        success: function (data, status, xhr) {
            $.each(data.data, function (key, hospital) {
                $('#hospital').append('<option value=' + hospital.id + '>' + hospital.name + '</option>');
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * -----------------------------------------------------------------------
 * Profile
 * -----------------------------------------------------------------------
 */

/**
 * Load details of user
 */
function editProfile() {
    let id = Cookies.get('userId');
    $.ajax({
        type: "GET",
        url: apiUrl + '/profile?id=' + id,
        dataType: "json",
        success: function (data, status, xhr) {
            let user = data.data;
            $('#name').val(user.name);
            $('#email').val(user.email);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr, true);
        }
    });
}

/**
 * Update profile
 * @param {form} form Form
 */
function updateProfile(form) {
    let id = Cookies.get('userId');
    $.ajax({
        type: "POST",
        url: apiUrl + '/profile?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Profile updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}

/**
 * Update password
 * @param {number} id User ID
 * @param {form} form Form
 */
function updatePassword(form) {
    let id = Cookies.get('userId');
    $.ajax({
        type: "PUT",
        url: apiUrl + '/profile?id=' + id + '&' + form.serialize(),
        success: function (data, status, xhr) {
            toastr.success('Password updated successfully', 'Save Complete');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }
    });
}