<p align="center"><img src="https://static.wixstatic.com/media/32f65e_b51531ff0cdb48e58bc3e2d309fe0133~mv2.png/v1/fill/w_160,h_36,al_c,q_85,usm_0.66_1.00_0.01/Spark%20logo%20X%20RGB%20dark.webp" width="160"></p>

# Introduction
Individual assignment for SparkX. A Covid Management System to manage hospitals and patients. Frontent developed using HTML, CSS and Javascript.

Backend   : [View Repository](https://github.com/PasanBhanu/spark-individual-assignment)

Frontend  : [View Repository](https://github.com/PasanBhanu/spark-individual-assignment-frontend)

# Instructions
- Clone the repository
- Add repository to a folder in htdocs (XAMMP), www (WAMP) or host in the server
- Install CROS enable extention if you are using Chrome or get errors due to CROS policy. [Allow CORS: Access-Control-Allow-origin](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
- Update **apiUrl** and **baseUrl** in 
  - inc\js\auth.js
  - inc\js\home.js
  - inc\js\functions.js

``` java
var apiUrl = "http://localhost:8080";
var baseUrl = "http://localhost/ncms"
```
**apiUrl** - Backend url (base url) without trailing slash
**baseUrl** - Frontend url (index.html url) without trailing slash

# Dependancies
- Bootstrap: 4.0.0
- Fontawesome: 4.7.0
- Toastr: 2.1.3
- Sweetalert2
- JS Cookie: 2.2.1
- JQuery: 3.3.1
- ChartJS: 2.7.1

