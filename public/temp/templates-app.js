angular.module('templates-app', ['common/forms/file-upload.tpl.html', 'company/details.tpl.html', 'company/list.tpl.html', 'company/widgets/profile.tpl.html', 'company/widgets/roles.tpl.html', 'company/widgets/sidebar.tpl.html', 'dashboard/company-profile.tpl.html', 'dashboard/dashboard.tpl.html', 'dashboard/forms/logo-delete.tpl.html', 'dashboard/forms/logo-upload.tpl.html', 'dashboard/forms/role-delete.tpl.html', 'dashboard/forms/role.tpl.html', 'dashboard/internships.tpl.html', 'dashboard/layout.tpl.html', 'dashboard/profile.tpl.html', 'dashboard/roles.tpl.html', 'dashboard/widgets/company-logo.tpl.html', 'dashboard/widgets/edit-profile.tpl.html', 'internships/details.tpl.html', 'internships/forms/apply.tpl.html', 'internships/forms/documents-edit.tpl.html', 'internships/forms/documents-upload.tpl.html', 'internships/forms/internship-status.tpl.html', 'internships/forms/interview-delete.tpl.html', 'internships/forms/interview.tpl.html', 'internships/forms/schedule-add.tpl.html', 'internships/forms/schedule.tpl.html', 'internships/forms/supervisor-add.tpl.html', 'internships/forms/supervisor-delete.tpl.html', 'internships/widgets/activity.tpl.html', 'internships/widgets/availability.tpl.html', 'internships/widgets/documents.tpl.html', 'internships/widgets/interview.tpl.html', 'internships/widgets/message.tpl.html', 'internships/widgets/profile.tpl.html', 'internships/widgets/schedule.tpl.html', 'internships/widgets/status.tpl.html', 'internships/widgets/supervisors.tpl.html', 'internships/widgets/title.tpl.html', 'login/activate.tpl.html', 'login/login.tpl.html', 'login/password-reset.tpl.html', 'login/resend-activation.tpl.html', 'register/modal-error.tpl.html', 'register/register-form.tpl.html', 'register/register.tpl.html', 'search/results-map.tpl.html', 'search/search.tpl.html', 'search/widgets/search.tpl.html']);

angular.module("common/forms/file-upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/forms/file-upload.tpl.html",
    "<div>\n" +
    "  <div ng-show=\"_uploader.isHTML5\">\n" +
    "    <div class=\"dropzone\" ng-file-drop ng-file-over=\"over\">\n" +
    "      <p>Drag and drop files here to upload</p>\n" +
    "      <button type=\"button\" class=\"btn btn-link\" ng-click=\"selectFiles()\"><i class=\"fa fa-file\"></i> Select files</button>\n" +
    "      <input class=\"input-file hide\" ng-file-select type=\"file\" multiple />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"list-group list-uploads\">\n" +
    "    <div ng-repeat=\"item in _uploader.queue\" class=\"list-group-item clearfix\">\n" +
    "      <div class=\"pull-left\">\n" +
    "        <span ng-show=\"item.isSuccess\"><i class=\"fa text-success fa-check\"></i></span>\n" +
    "        <span ng-show=\"item.isCancel\"><i class=\"fa text-warning fa-ban\"></i></span>\n" +
    "        <span ng-show=\"item.isError\"><i class=\"fa text-danger fa-warning\"></i></span>\n" +
    "        <strong>{{ item.file.name }}</strong> <span class=\"text-muted\">({{ item.file.size/1024/1024|number:2 }} MB)</span>\n" +
    "      </div>\n" +
    "      <a ng-click=\"item.remove()\" class=\"if-editable btn btn-danger btn-icon fa fa-times pull-right\"></a>\n" +
    "      <div class=\"item-progress\" ng-style=\"{ 'width': item.progress + '%' }\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-hide=\"hideButtons\" class=\"text-center\">\n" +
    "      <button type=\"button\" class=\"btn btn-success btn-icon-left\" ng-click=\"_uploader.uploadAll()\" ng-show=\"_uploader.getNotUploadedItems().length\"><i class=\"fa fa-arrow-up\"></i> Start Upload</button>\n" +
    "      <button type=\"button\" class=\"btn btn-danger btn-icon-left\" ng-click=\"_uploader.cancelAll()\" ng-show=\"_uploader.isUploading\"><i class=\"fa fa-times\"></i> Cancel Upload</button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-icon-left\" ng-click=\"_uploader.clearQueue()\" ng-show=\"_uploader.queue.length\"><i class=\"fa fa-trash-o\"></i> Clear Queue</button>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("company/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("company/details.tpl.html",
    "<article class=\"content-page company-details\">\n" +
    "  \n" +
    "  <header>\n" +
    "    <div class=\"container clearfix\">\n" +
    "      <h1 class=\"page-title pull-left\">{{ company.name }}</h1>\n" +
    "\n" +
    "      <div class=\"actions pull-right\">\n" +
    "        <button type=\"button\" auth-group=\"student\" ng-click=\"apply()\" class=\"btn btn-primary btn-icon-right\">Apply for Internship <i class=\"fa fa-envelope\"></i></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"main\">\n" +
    "    <div class=\"container\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-4 profile-sidebar\">\n" +
    "          <div ng-include=\"'company/widgets/sidebar.tpl.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-8 profile-body\">\n" +
    "          <div ng-include=\"'company/widgets/profile.tpl.html'\"></div>\n" +
    "          <div ng-include=\"'company/widgets/roles.tpl.html'\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"map map-fullwidth\">\n" +
    "    <div class=\"map-overlay\">\n" +
    "      <div class=\"container\">\n" +
    "        <div class=\"map-info\">\n" +
    "          <h2>{{ company.name }}</h2>\n" +
    "          <p ng-bind-html=\"company.displayAddress\"></p>\n" +
    "          <a href=\"{{ company.getGoogleMapsLink() }}\" class=\"btn btn-primary btn-icon-right\" target=\"_blank\">Get Directions <i class=\"fa fa-map-marker\"></i></a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div google-map lng=\"company.address.lng\" lat=\"company.address.lat\" height=\"500\"></div>\n" +
    "  </section>\n" +
    "\n" +
    "</article>");
}]);

angular.module("company/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("company/list.tpl.html",
    "<div class=\"list-group list-companies\">\n" +
    "  <div ng-repeat=\"company in companies track by company._id\" ng-class=\"{'company-hover':company.$hover}\" ng-mouseover=\"company.$hover=true\" ng-mouseleave=\"company.$hover=false\">\n" +
    "    <a href=\"{{ company.url }}\" class=\"list-group-item item-company\">\n" +
    "      <div class=\"company-logo\">\n" +
    "        <img ng-src=\"{{ company.logoUrl }}\" alt=\"{{ company.name }}\">\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"overview\">\n" +
    "        <h2>{{ company.name }}</h2>\n" +
    "        <p class=\"introduction\">{{ company.introduction | limitTo:120 }}...</p>\n" +
    "        <div class=\"meta\">\n" +
    "          <span class=\"location\"><i class=\"fa fa-map-marker\"></i> {{ [company.address.city, company.address.country].join(', ') }}</span>\n" +
    "          <span class=\"skills\"><i class=\"fa fa-tag\"></i> {{ company.getSkillsString() }}</span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "    <div ng-repeat=\"role in company.roles\" class=\"list-group-item item-role item-muted text-muted\">\n" +
    "      <strong>{{ role.title }}</strong>\n" +
    "      <p>{{ role.description | limitTo:80 }}...</p>\n" +
    "\n" +
    "      <div dropdown-menu>\n" +
    "        <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "        <ul>\n" +
    "          <li><a ng-click=\"showRoleDetails(role)\">More Info</a></li>\n" +
    "          <li><a auth-group=\"student\" ng-click=\"apply(company, role)\">Apply</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("company/widgets/profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("company/widgets/profile.tpl.html",
    "<div ng-if=\"company.introduction\" class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>Company profile</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      {{ company.introduction }}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"company.skills\" class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>{{ company.name }} is looking for interns with the following skills</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <ul class=\"skills\">\n" +
    "        <li ng-repeat=\"skill in company.skills\">{{ skill }}</li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("company/widgets/roles.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("company/widgets/roles.tpl.html",
    "<div ng-if=\"company.roles.length\" class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>Available Internship Roles</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div ng-repeat=\"role in company.roles\" class=\"list-group-item\">\n" +
    "      <strong>{{ role.title }}</strong>\n" +
    "      <p>{{ role.description | limitTo:80 }}...</p>\n" +
    "\n" +
    "      <div dropdown-menu>\n" +
    "        <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "        <ul>\n" +
    "          <li><a ng-click=\"showRoleDetails(role)\">More Info</a></li>\n" +
    "          <li><a auth-group=\"student\" ng-click=\"apply(role)\">Apply</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("company/widgets/sidebar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("company/widgets/sidebar.tpl.html",
    "<div class=\"content-box\">\n" +
    "  <div class=\"profile-logo clearfix\">\n" +
    "    <img ng-show=\"company.logoUrl\" ng-src=\"{{ company.logoUrl }}\" alt=\"{{ company.name }}\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <i class=\"fa fa-map-marker\"></i> {{ company.address.city + ', ' +  company.address.country }}\n" +
    "    </div>\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <i class=\"fa fa-globe\"></i> <a href=\"{{ company.website }}\" target=\"_blank\">{{ company.website }}</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("dashboard/company-profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/company-profile.tpl.html",
    "<article class=\"edit-company-profile\">\n" +
    "  <div ng-include=\"'dashboard/widgets/company-logo.tpl.html'\"></div>\n" +
    "\n" +
    "</article>");
}]);

angular.module("dashboard/dashboard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/dashboard.tpl.html",
    "<div class=\"content-box\" auth-group=\"student\">\n" +
    "  <header>\n" +
    "    <h3>Recommended Internships <span class=\"small text-muted text-small\">(based on your location and skills)</span></h3>\n" +
    "  </header>\n" +
    "  <div ng-show=\"noResults\" class=\"no-results\">\n" +
    "    <p class=\"lead\">Sorry but we could not find any appropriate internships for you. Try adding some skills to your profile.</p>\n" +
    "  </div>\n" +
    "  <div ng-show=\"searching\" class=\"searching text-center\">\n" +
    "    <p class=\"lead\">Please click \"Allow\" if you are asked to share your location.</p>\n" +
    "    <p class=\"text-muted\">(Your location will be used to help find internships in your area)</p>\n" +
    "    <i class=\"fa fa-spinner fa-spin\" style=\"font-size:40px\"></i>\n" +
    "  </div>\n" +
    "  <div company-list companies=\"recommendations\"></div>\n" +
    "</div>");
}]);

angular.module("dashboard/forms/logo-delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/forms/logo-delete.tpl.html",
    "<div class=\"text-center\">\n" +
    "  \n" +
    "  <p class=\"lead\">Are you sure you want to remove your company's logo</p>\n" +
    "\n" +
    "  <p class=\"actions\">\n" +
    "    <button ng-click=\"delete()\" type=\"submit\" class=\"btn btn-danger\">Remove</button>\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-default\">Cancel</button>\n" +
    "  </p>\n" +
    "\n" +
    "</div>");
}]);

angular.module("dashboard/forms/logo-upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/forms/logo-upload.tpl.html",
    "<form validate=\"true\" role=\"form\" ng-submit=\"upload()\" ng-init=\"initialize()\">\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"input-logo\" class=\"sr-only\">Select Logo</label>\n" +
    "    <input type=\"file\" name=\"logo\" id=\"input-logo\" ng-file-select class=\"form-control\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group text-center\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary btn-icon-right\">Upload <i class=\"fa fa-arrow-up\"></i></button>\n" +
    "  </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("dashboard/forms/role-delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/forms/role-delete.tpl.html",
    "<div class=\"text-center\">\n" +
    "  \n" +
    "  <p class=\"lead\">Are you sure you want to delete this role?</p>\n" +
    "\n" +
    "  <p class=\"actions\">\n" +
    "    <button ng-click=\"delete()\" type=\"submit\" class=\"btn btn-danger\">Delete</button>\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-default\">Cancel</button>\n" +
    "  </p>\n" +
    "\n" +
    "</div>");
}]);

angular.module("dashboard/forms/role.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/forms/role.tpl.html",
    "<form validate=\"true\" role=\"form\" ng-submit=\"save()\">\n" +
    "  \n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Role Title</label>\n" +
    "    <input ng-model=\"role.title\" type=\"text\" class=\"form-control\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"\">Role Description</label>\n" +
    "    <textarea ng-model=\"role.description\" class=\"form-control\" rows=\"10\"></textarea>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group text-center\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary btn-icon-right\">Save <i class=\"fa fa-save\"></i></button>\n" +
    "  </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("dashboard/internships.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/internships.tpl.html",
    "<div class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>{{ title || \"Internships\" }}</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"internships.length\" class=\"list-group list-internships\">\n" +
    "    <a ng-repeat=\"internship in internships\" href=\"{{ internship.url }}\" class=\"list-group-item clearfix\">\n" +
    "      <div class=\"pull-left\" internship-title internship=\"internship\"></div>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "  <div auth-group=\"student\" ng-show=\"!internships.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">Looks like you haven't applied for any internships yet!</p>\n" +
    "    <a href=\"/search\" class=\"btn btn-link btn-sm\"><i class=\"fa fa-search\"></i> Find one now</a>\n" +
    "  </div>\n" +
    "  <div auth-group=\"employer\" ng-show=\"!internships.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">No results found</p>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("dashboard/layout.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/layout.tpl.html",
    "<article class=\"content-page\">\n" +
    "  <header>\n" +
    "    <div class=\"container\">\n" +
    "      <h1 class=\"page-title\">Dashboard</h1>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"main\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-3\">\n" +
    "          <div class=\"content-box widget-navigation\">\n" +
    "            <header>\n" +
    "              <h3>Dashboard</h3>\n" +
    "            </header>\n" +
    "\n" +
    "            <ul class=\"nav nav-pills nav-stacked\">\n" +
    "              <li ng-class=\"{active:active=='dashboard'}\"><a href=\"/dashboard\">Dashboard</a></li>\n" +
    "              <li auth-group=\"student\" ng-class=\"{active:active=='internships'}\"><a href=\"/dashboard/internships\">My Internships</a></li>\n" +
    "              <li ng-class=\"{active:active=='applications'}\"><a href=\"/dashboard/applications\">Pending Applications</a></li>\n" +
    "              <li ng-class=\"{active:active=='declined'}\"><a href=\"/dashboard/applications/declined\">Declined Applications</a></li>\n" +
    "              <li auth-group=\"employers\" ng-class=\"{active:active=='internships'}\"><a href=\"/dashboard/internships\">Active Internships</a></li>\n" +
    "              <li ng-class=\"{active:active=='archived'}\"><a href=\"/dashboard/internships/archived\">Archived Internships</a></li>\n" +
    "              <li auth-group=\"employer\" ng-class=\"{active:active=='roles'}\"><a href=\"/dashboard/roles\">Available Roles</a></li>\n" +
    "              <li auth-group=\"employer\" ng-class=\"{active:active=='profile'}\"><a href=\"/dashboard/company-profile\">Company Profile</a></li>\n" +
    "              <li auth-group=\"student\" ng-class=\"{active:active=='profile'}\"><a href=\"/dashboard/profile\">Edit Profile</a></li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-9\">\n" +
    "          <div ng-include=\"state.main\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</article>");
}]);

angular.module("dashboard/profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/profile.tpl.html",
    "<div edit-profile-widget profile=\"profile\"></div>");
}]);

angular.module("dashboard/roles.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/roles.tpl.html",
    "<div class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>Available Roles</h3>\n" +
    "\n" +
    "    <div dropdown-menu>\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li><a ng-click=\"add()\">Add Role</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div ng-repeat=\"role in roles\" class=\"list-group-item\">\n" +
    "      <strong>{{ role.title }}</strong>\n" +
    "      <p>{{ role.description }}</p>\n" +
    "\n" +
    "      <div dropdown-menu>\n" +
    "        <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "        <ul>\n" +
    "          <li><a ng-click=\"edit(role)\">Edit Role</a></li>\n" +
    "          <li><a ng-click=\"delete(role)\">Delete Role</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"!roles.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">Looks like you have not created any internship roles yet!</p>\n" +
    "    <a ng-click=\"add()\" class=\"btn btn-link\"><i class=\"fa fa-plus\"></i> Create one now</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("dashboard/widgets/company-logo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/widgets/company-logo.tpl.html",
    "<div class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>Company Logo</h3>\n" +
    "\n" +
    "    <div dropdown-menu>\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li><a ng-click=\"uploadLogo()\">Upload Logo</a></li>\n" +
    "        <li><a ng-click=\"deleteLogo()\">Remove Logo</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <div class=\"profile-logo\">\n" +
    "        <img ng-if=\"company.logoUrl\" ng-src=\"{{ company.logoUrl }}\" alt=\"{{ company.name }}\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("dashboard/widgets/edit-profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/widgets/edit-profile.tpl.html",
    "<div class=\"content-box\">\n" +
    "  <header>\n" +
    "    <h3>Edit Profile</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <form role=\"form\" ng-submit=\"save()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"row-sm\">\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <label>First Name</label>\n" +
    "          <input type=\"text\" ng-model=\"profile.firstName\" class=\"form-control\">\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <label>Last Name</label>\n" +
    "          <input type=\"text\" ng-model=\"profile.lastName\" class=\"form-control\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      \n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>Introduction</label>\n" +
    "      <textarea ng-model=\"profile.introduction\" rows=\"4\" class=\"form-control\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>Skills</label>\n" +
    "      <input type=\"text\" ng-model=\"profile._skills\" class=\"form-control\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"row-sm\">\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <label>University</label>\n" +
    "          <select selecter name=\"profile.university\" ng-model=\"profile.university\">\n" +
    "            <option value=\"\">Select a University</option>\n" +
    "            <option ng-repeat=\"o in universityOptions\" ng-selected=\"{{ o === profile.university }}\" value=\"{{ o }}\">{{ o }}</option>\n" +
    "          </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <label>Course Name</label>\n" +
    "          <input type=\"text\" ng-model=\"profile.courseName\" class=\"form-control\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>LinkedIn Profile URL</label>\n" +
    "      <input type=\"text\" ng-model=\"profile.linkedIn\" class=\"form-control\">\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Resume upload -->\n" +
    "\n" +
    "    <div class=\"form-footer text-center\">\n" +
    "      <button type=\"submit\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-save\"></i> Save</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
}]);

angular.module("internships/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/details.tpl.html",
    "<article class=\"content-page internship-details\">\n" +
    "  \n" +
    "  <header>\n" +
    "    <div class=\"container clearfix\">\n" +
    "      <h1 class=\"page-title pull-left\">Internship Dashboard</h1>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"sub-header\">\n" +
    "    <div class=\"container clearfix\">\n" +
    "      <div class=\"pull-left\" internship-title internship=\"internship\"></div>\n" +
    "\n" +
    "      <div class=\"pull-right\">\n" +
    "        <div auth-group=\"employer\" status-widget internship=\"internship\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"main\">\n" +
    "    <div class=\"container\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <div auth-group=\"employer\" ng-show=\"internship.status=='pending'\" profile-widget internship=\"internship\"></div>\n" +
    "          <div ng-show=\"internship.status=='pending'\" interview-widget internship=\"internship\"></div>\n" +
    "          <div ng-show=\"internship.status=='active'\" schedule-widget internship=\"internship\"></div>\n" +
    "          <div ng-show=\"internship.status=='pending'\" auth-group=\"employer\" availability-widget internship=\"internship\"></div>\n" +
    "          <div supervisors-widget internship=\"internship\"></div>\n" +
    "          <div documents-widget internship=\"internship\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <div ng-hide=\"internship.status=='rejected'\" message-widget internship=\"internship\"></div>\n" +
    "          <div activity-widget internship=\"internship\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "\n" +
    "</article>");
}]);

angular.module("internships/forms/apply.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/apply.tpl.html",
    "<form apply-form role=\"form\">\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <p>Your internship proposal contains everything your employer will need to know. This includes the internship length, your availability, required documentation and anything else that will be required of the employer.</p>\n" +
    "    <p>Your profile and resume will also be attached to your application.</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div stepped-form>\n" +
    "\n" +
    "    <fieldset class=\"form-step\">\n" +
    "      \n" +
    "      <legend>Proposed Role</legend>\n" +
    "\n" +
    "      <div class=\"custom-role\">\n" +
    "        <div class=\"form-group\">\n" +
    "          <label>Role Title</label>\n" +
    "          <input ng-model=\"application.role.title\" ng-disabled=\"existingRole\" type=\"text\" class=\"form-control\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label for=\"\">Role Description</label>\n" +
    "          <textarea ng-model=\"application.role.description\" ng-disabled=\"existingRole\" class=\"form-control\" rows=\"6\"></textarea>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <a class=\"next btn btn-primary pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "    <fieldset class=\"form-step\">\n" +
    "\n" +
    "      <legend>Internship Details</legend>\n" +
    "  \n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-sm-4\">\n" +
    "            <label for=\"\">Start Date</label>\n" +
    "            <input date-picker=\"application.startDate\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-sm-4\">\n" +
    "            <label for=\"\">End Date</label>\n" +
    "            <input date-picker=\"application.endDate\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-4\">\n" +
    "            <label for=\"\">Total Hours</label>\n" +
    "            <input ng-model=\"application.totalHours\" type=\"text\" class=\"form-control\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"\">Availability</label>\n" +
    "        <div checkbox-list selected=\"application.availability\" options=\"['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']\" filterable=\"false\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"field-comment\">Comments</label>\n" +
    "        <textarea ng-model=\"application.comment\" id=\"field-comment\" rows=\"6\" class=\"form-control\"></textarea>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <a class=\"previous btn btn-default pull-left btn-icon-left\">Back <i class=\"fa fa-arrow-left\"></i></a>\n" +
    "        <a class=\"next btn btn-primary pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "    <fieldset class=\"form-step\">\n" +
    "\n" +
    "      <legend>Attached Documents</legend>\n" +
    "\n" +
    "      <div upload-form uploader=\"uploader\" allow=\"all\" url=\"/testing/123\" hide-buttons=\"true\"></div>\n" +
    "\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <a class=\"previous btn btn-default pull-left btn-icon-left\">Back <i class=\"fa fa-arrow-left\"></i></a>\n" +
    "        <a class=\"next btn btn-primary pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "    <fieldset class=\"form-step\">\n" +
    "\n" +
    "      <legend>Confirm Application</legend>\n" +
    "\n" +
    "      <div class=\"list-group\">\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Role Title</strong>\n" +
    "          <span class=\"pull-right\">{{ application.role.title }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Role Description</strong>\n" +
    "          <div>{{ application.role.description }}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"list-group\">\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Start Date</strong>\n" +
    "          <span class=\"pull-right\">{{ application.startDate | date }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>End Date</strong>\n" +
    "          <span class=\"pull-right\">{{ application.endDate | date }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Total Hours</strong>\n" +
    "          <span class=\"pull-right\">{{ application.totalHours || \"0\" }} hours</span>\n" +
    "        </div>\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Availability</strong>\n" +
    "          <span class=\"pull-right\">{{ application.availability.join(', ') }}</span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"list-group\">\n" +
    "        <div class=\"list-group-item\">\n" +
    "          <strong>Comments</strong>\n" +
    "          <div>{{ application.comment }}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <a class=\"previous btn btn-default pull-left btn-icon-left\">Back <i class=\"fa fa-arrow-left\"></i></a>\n" +
    "        <a ng-click=\"save()\" class=\"next btn btn-primary pull-right btn-icon-right\">Submit Application <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "    <fieldset class=\"form-step\">\n" +
    "\n" +
    "      <legend>Submitting Application</legend>\n" +
    "\n" +
    "      <div class=\"text-center\" style=\"padding:60px 0;\">\n" +
    "        <p class=\"lead\">Please wait while your application is submitted...</p>\n" +
    "        <i class=\"fa fa-spinner fa-spin\" style=\"font-size:40px\"></i>\n" +
    "      </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("internships/forms/documents-edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/documents-edit.tpl.html",
    "<div>\n" +
    "  <div class=\"list-group list-files\">\n" +
    "    <div ng-repeat-start=\"item in internship.documents track by item._id\" class=\"list-group-item\">\n" +
    "      <strong class=\"pull-left\"><i class=\"fa fa-file\"></i> {{ item.name || item.file }}</strong>\n" +
    "      <div class=\"pull-right\">\n" +
    "        <a href=\"{{ item.fileUrl }}\" target=\"_blank\" class=\"btn btn-success btn-icon fa fa-download\"></a>\n" +
    "        <a ng-click=\"toggle(item, 'edit')\" class=\"btn btn-success btn-icon fa fa-pencil\"></a>\n" +
    "        <a ng-click=\"toggle(item, 'delete')\" class=\"btn btn-danger btn-icon fa fa-times\"></a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"item.$delete\" class=\"list-group-item list-form item-muted text-center\">\n" +
    "      <p class=\"lead\">Are you sure you want to delete this document?</p>\n" +
    "      <button ng-click=\"delete(item)\" type=\"button\" class=\"btn btn-danger btn-icon-left\"><i class=\"fa fa-trash-o\"></i> Delete</button>\n" +
    "      <button ng-click=\"cancel()\" type=\"button\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-repeat-end ng-show=\"item.$edit\" class=\"list-group-item list-form item-muted\">\n" +
    "      <form ng-submit=\"save(item)\" class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-2 control-label\">Name</label>\n" +
    "          <div class=\"col-sm-9\">\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"$newDocument.name\" placeholder=\"Name\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-2 control-label\">Description</label>\n" +
    "          <div class=\"col-sm-9\">\n" +
    "            <textarea class=\"form-control\" rows=\"3\" ng-model=\"$newDocument.description\" placeholder=\"Description\"></textarea>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <div class=\"col-sm-9 col-sm-offset-2\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-save\"></i> Save</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer text-center\">\n" +
    "    <button ng-click=\"close()\" type=\"button\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-check\"></i> Done</button>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/forms/documents-upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/documents-upload.tpl.html",
    "<div upload-form allow=\"all\" url=\"{{ url }}\"></div>");
}]);

angular.module("internships/forms/internship-status.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/internship-status.tpl.html",
    "<div class=\"text-center\">\n" +
    "  <p class=\"lead\">Are you sure you want to change this internship's status to \"{{ status | titlecase }}\"?</p>\n" +
    "  <p class=\"actions\">\n" +
    "    <button ng-click=\"save()\" type=\"submit\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-check\"></i> Update</button>\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </p>\n" +
    "</div>");
}]);

angular.module("internships/forms/interview-delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/interview-delete.tpl.html",
    "<div class=\"text-center\">\n" +
    "  <p class=\"lead\">Are you sure you want to cancel this interview?</p>\n" +
    "  <p class=\"actions\">\n" +
    "    <button ng-click=\"delete()\" type=\"submit\" class=\"btn btn-danger btn-icon-left\"><i class=\"fa fa-trash-o\"></i> Cancel Interview</button>\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </p>\n" +
    "</div>");
}]);

angular.module("internships/forms/interview.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/interview.tpl.html",
    "<form role=\"form\" ng-submit=\"save()\">\n" +
    "  \n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"row-sm\">\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <label>Date</label>\n" +
    "        <input date-picker=\"_interview.date\" type=\"text\" class=\"form-control\">\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <label>Start Time</label>\n" +
    "        <select selecter ng-model=\"_interview.startTime\" ng-options=\"o as o for o in timeOptions\" class=\"form-control\"></select>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <label>End Time</label>\n" +
    "        <select selecter ng-model=\"_interview.endTime\" ng-options=\"o as o for o in timeOptions\" class=\"form-control\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Comments</label>\n" +
    "    <textarea ng-model=\"_interview.comment\" class=\"form-control\" rows=\"4\"></textarea>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer text-center\">\n" +
    "    <button ng-click=\"save()\" type=\"button\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-check\"></i> Schedule Interview</button>\n" +
    "    <button ng-click=\"close()\" type=\"button\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </div>\n" +
    "</form>");
}]);

angular.module("internships/forms/schedule-add.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/schedule-add.tpl.html",
    "<form ng-submit=\"save()\" role=\"form\" class=\"schedule-add\">\n" +
    "  <div class=\"form-group\">\n" +
    "      <div class=\"row-sm\">\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <label>Date</label>\n" +
    "          <input date-picker=\"newSchedule.date\" type=\"text\" class=\"form-control\">\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <label>Start Time</label>\n" +
    "          <select selecter ng-model=\"newSchedule.startTime\" ng-options=\"o as o for o in timeOptions\" class=\"form-control\"></select>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <label>End Time</label>\n" +
    "          <select selecter ng-model=\"newSchedule.endTime\" ng-options=\"o as o for o in timeOptions\" class=\"form-control\"></select>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"modal-footer text-center\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-check\"></i> Add to Schedule</button>\n" +
    "    <button ng-click=\"close()\" type=\"button\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("internships/forms/schedule.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/schedule.tpl.html",
    "<div>\n" +
    "  <div class=\"list-group list-schedule\">\n" +
    "    <div ng-repeat=\"item in schedule\" class=\"list-group-item\">\n" +
    "      <strong class=\"date pull-left\"><i class=\"fa fa-calendar\"></i> {{ item.date | date:short }}</strong>\n" +
    "      <span class=\"pull-right\">\n" +
    "        <span class=\"time\"><i class=\"fa fa-clock-o\"></i> {{ item.startTime }} <span class=\"text-muted\">to</span> {{ item.endTime }}</span>\n" +
    "        <a ng-click=\"remove(item)\" class=\"btn btn-danger btn-icon fa fa-times\"></a>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer text-center\">\n" +
    "    <button ng-click=\"close()\" type=\"button\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-check\"></i> Done</button>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/forms/supervisor-add.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/supervisor-add.tpl.html",
    "<form  ng-submit=\"save()\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Supervisor Email</label>\n" +
    "    <input ng-model=\"newSupervisor\" type=\"text\" class=\"form-control\">\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"modal-footer text-center\">\n" +
    "    <button ng-click=\"save()\" type=\"button\" class=\"btn btn-primary btn-icon-left\"><i class=\"fa fa-plus\"></i> Add Supervisor</button>\n" +
    "    <button ng-click=\"close()\" type=\"button\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </div>\n" +
    "</form>");
}]);

angular.module("internships/forms/supervisor-delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/forms/supervisor-delete.tpl.html",
    "<div class=\"text-center\">\n" +
    "  <p class=\"lead\">Are you sure you want to remove this supervisor?</p>\n" +
    "  <p class=\"actions\">\n" +
    "    <button ng-click=\"delete()\" type=\"submit\" class=\"btn btn-danger btn-icon-left\"><i class=\"fa fa-trash-o\"></i> Delete</button>\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-default btn-icon-left\"><i class=\"fa fa-times\"></i> Cancel</button>\n" +
    "  </p>\n" +
    "</div>");
}]);

angular.module("internships/widgets/activity.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/activity.tpl.html",
    "<div class=\"content-box widget-activity\">\n" +
    "  <header>\n" +
    "    <h3>Recent Activity</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group list-activity\">\n" +
    "    <div ng-repeat=\"item in internship.activity track by item._id\" class=\"list-group-item item-activity type-{{ item.type || 'update' }} priority-{{ item.priority || '1' }}\" ng-class=\"{'editable': canEdit(item)}\">\n" +
    "      <p class=\"description\">{{ item.description }}</p>\n" +
    "      <div class=\"meta\">\n" +
    "        <span ng-show=\"item.author\" class=\"user\"><i class=\"fa fa-user\"></i> {{ item.author.profile.name }}</span>\n" +
    "        <span class=\"timestamp\"><i class=\"fa fa-calendar\"></i> {{ item.createdAt | date }} <span class=\"text-muted\">at</span> {{ item.createdAt | date:'shortTime' }}</span>\n" +
    "        <a ng-click=\"remove(item)\" class=\"if-editable btn btn-danger btn-icon fa fa-times\"></a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/availability.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/availability.tpl.html",
    "<div class=\"content-box widget-availability\">\n" +
    "  <header>\n" +
    "    <h3>Availability</h3>\n" +
    "  </header>\n" +
    "\n" +
    "    <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <strong><i class=\"fa fa-calendar\"></i> Available</strong>\n" +
    "      <span class=\"pull-right\">{{ internship.startDate | date:'d/M/yyyy' }}<span class=\"text-muted\"> to </span> {{ internship.endDate | date:'d/M/yyyy' }}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <strong><i class=\"fa fa-clock-o\"></i> Internship Length</strong>\n" +
    "      <span class=\"pull-right\">{{ internship.totalHours }} <span class=\"text-muted\">hours</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"internship.availability\" class=\"list-group\">\n" +
    "    <div class=\"list-group-item\" ng-repeat=\"day in _availability\">\n" +
    "      <strong>{{ day.day }}</strong>\n" +
    "      <i ng-show=\"day.available\" class=\"fa fa-check text-success pull-right\"></i>\n" +
    "      <i ng-show=\"!day.available\" class=\"fa fa-times text-muted pull-right\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/documents.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/documents.tpl.html",
    "<div class=\"content-box widget-documents\">\n" +
    "  <header>\n" +
    "    <h3>Documents</h3>\n" +
    "\n" +
    "    <div dropdown-menu>\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li><a ng-click=\"upload()\">Upload Documents</a></li>\n" +
    "        <li><a ng-click=\"edit()\">Edit Documents</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"internship.documents.length\" class=\"list-group list-documents\">\n" +
    "    <div ng-repeat-start=\"doc in internship.documents\" class=\"list-group-item\">\n" +
    "      <strong>{{ doc.name }}</strong>\n" +
    "      <a href=\"{{ doc.fileUrl }}\" class=\"pull-right\" target=\"_blank\"><i class=\"fa fa-download\"></i> Download</a>\n" +
    "    </div>\n" +
    "    <div ng-repeat-end ng-show=\"doc.description\" class=\"list-group-item item-muted text-muted\">\n" +
    "      {{ doc.description }}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"!internship.documents.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">No documents have been uploaded</p>\n" +
    "    <a ng-click=\"upload()\" class=\"btn btn-link btn-sm\"><i class=\"fa fa-cloud-upload\"></i> Upload a document</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/interview.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/interview.tpl.html",
    "<div class=\"content-box widget-interview\">\n" +
    "  <header>\n" +
    "    <h3>Interview</h3>\n" +
    "\n" +
    "    <div dropdown-menu auth-group=\"employer\">\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li ng-show=\"!internship.interview\"><a ng-click=\"edit()\">Schedule Interview</a></li>\n" +
    "        <li ng-show=\"internship.interview\"><a ng-click=\"edit()\">Edit Interview</a></li>\n" +
    "        <li ng-show=\"internship.interview\"><a ng-click=\"remove()\">Cancel Interview</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div ng-show=\"internship.interview\" class=\"list-group list-interview\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <strong><i class=\"fa fa-calendar\"></i> Date</strong>\n" +
    "      <span class=\"pull-right\">{{ internship.interview.date | date }}</span>\n" +
    "    </div>\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <strong><i class=\"fa fa-clock-o\"></i> Time</strong>\n" +
    "      <span class=\"pull-right\">{{ internship.interview.startTime }} <span class=\"muted\">to</span> {{ internship.interview.endTime }}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"!internship.interview\" class=\"no-results\">\n" +
    "    <p class=\"lead\">No interview has been scheduled</p>\n" +
    "    <a auth-group=\"employer\" ng-click=\"edit()\" class=\"btn btn-link btn-sm\"><i class=\"fa fa-group\"></i> Schedule an Interview</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/message.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/message.tpl.html",
    "<div class=\"content-box widget-message\">\n" +
    "  <header>\n" +
    "    <h3>Post a message</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <form ng-submit=\"save()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <textarea ng-model=\"message\" rows=\"3\" class=\"form-control\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group text-right\">\n" +
    "      <button type=\"submit\" class=\"btn btn-primary btn-icon-right\"><i class=\"fa fa-check\"></i> Post Message</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>");
}]);

angular.module("internships/widgets/profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/profile.tpl.html",
    "<div class=\"content-box widget-profile\">\n" +
    "  <header>\n" +
    "    <h3>Applicant's Profile</h3>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\">\n" +
    "      <strong>Name</strong>\n" +
    "      <span class=\"pull-right\">{{ profile.name }}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.introduction\" class=\"list-group-item\">\n" +
    "      {{ profile.introduction }}\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.university\" class=\"list-group-item\">\n" +
    "      <strong>University</strong>\n" +
    "      <span class=\"pull-right\">{{ profile.university }}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.courseName\" class=\"list-group-item\">\n" +
    "      <strong>Course</strong>\n" +
    "      <span class=\"pull-right\">{{ profile.courseName }}</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.skills\" class=\"list-group-item\">\n" +
    "      <div><strong>Key Skills</strong></div>\n" +
    "      <div>{{ profile.skills.join(', ') }}</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.resume\" class=\"list-group-item\">\n" +
    "      <strong>Resume</strong>\n" +
    "      <span class=\"pull-right\"><a href=\"{{ profile.resume }}\" target=\"_blank\"><i class=\"fa fa-download\"></i> Download</a></span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"profile.linkedIn\" class=\"list-group-item\">\n" +
    "      <strong>LinkedIn</strong>\n" +
    "      <span class=\"pull-right\"><a href=\"{{ profile.linkedIn }}\" target=\"_blank\"><i class=\"fa fa-linkedin-square\"></i> View Profile</a></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/schedule.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/schedule.tpl.html",
    "<div class=\"content-box widget-schedule\">\n" +
    "  <header>\n" +
    "    <h3>Schedule</h3>\n" +
    "\n" +
    "    <div dropdown-menu>\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li><a ng-click=\"edit()\">Edit Schedule</a></li>\n" +
    "        <li><a ng-click=\"add()\">Add Scheduled Work</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group list-schedule\">\n" +
    "    <div ng-repeat=\"item in internship.schedule\" class=\"list-group-item\">\n" +
    "      <strong class=\"date pull-left\"><i class=\"fa fa-calendar\"></i> {{ item.date | date:short }}</strong>\n" +
    "      <span class=\"time pull-right\"><i class=\"fa fa-clock-o\"></i> {{ item.startTime }} <span class=\"text-muted\">to</span> {{ item.endTime }}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"!internship.schedule.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">Looks like you have not created a schedule yet!</p>\n" +
    "    <a ng-click=\"edit()\" class=\"btn btn-link btn-sm\"><i class=\"fa fa-plus\"></i> Create one now</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/status.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/status.tpl.html",
    "<div class=\"widget-status\">\n" +
    "  <div dropdown-menu class=\"dropdown-lg\">\n" +
    "    <a ng-click=\"toggle()\"><span>{{ internship.status | titlecase }}</span> <i class=\"fa fa-bars\"></i></a>\n" +
    "    <ul>\n" +
    "      <li ng-show=\"internship.status == 'pending'\"><a ng-click=\"change('active')\">Approve Internship</a></li>\n" +
    "      <li ng-show=\"internship.status == 'pending'\"><a ng-click=\"change('rejected')\">Reject Internship</a></li>\n" +
    "      <li ng-show=\"internship.status == 'active'\"><a ng-click=\"change('completed')\">Mark internship as completed</a></li>\n" +
    "      <li ng-show=\"internship.status == 'completed'\"><a ng-click=\"change('active')\">Mark internship as active</a></li>\n" +
    "      <li ng-show=\"internship.status == 'active' || internship.status == 'rejected'\"><a ng-click=\"change('pending')\">Mark internship as pending</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("internships/widgets/supervisors.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/supervisors.tpl.html",
    "<div class=\"content-box widget-supervisors\">\n" +
    "  <header>\n" +
    "    <h3>Supervisors</h3>\n" +
    "\n" +
    "    <div dropdown-menu>\n" +
    "      <a ng-click=\"toggle()\"><i class=\"fa fa-bars\"></i></a>\n" +
    "      <ul>\n" +
    "        <li><a ng-click=\"add()\">Add Supervisor</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"list-group list-supervisors\">\n" +
    "    <div ng-repeat=\"item in _supervisors\" class=\"list-group-item\">\n" +
    "      <strong class=\"email\"><i class=\"fa fa-eye\"></i> {{ item.email }}</strong>\n" +
    "      <a ng-click=\"remove(item.email)\" class=\"btn btn-danger btn-icon fa fa-times pull-right\"></a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"!_supervisors.length\" class=\"no-results\">\n" +
    "    <p class=\"lead\">Looks like you have not added any supervisors yet!</p>\n" +
    "    <a ng-click=\"add()\" class=\"btn btn-link btn-sm\"><i class=\"fa fa-plus\"></i> Add one now</a>\n" +
    "  </div>\n" +
    " \n" +
    "</div>");
}]);

angular.module("internships/widgets/title.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("internships/widgets/title.tpl.html",
    "<div class=\"internship-title\">\n" +
    "  <div ng-show=\"!isCompany && company.logoUrl\" class=\"company-logo\">\n" +
    "    <img ng-src=\"{{ company.logoUrl }}\" alt=\"{{ company.name }}\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"title-body pull-left\">\n" +
    "    <h2 ng-show=\"!isCompany\">{{ internship.role.title || \"Internship\" }} <span class=\"text-muted\">at</span> <a href=\"{{ company.url }}\">{{ company.name }}</a></h2>\n" +
    "    <h2 ng-show=\"isCompany\">{{ profile.name }} <span class=\"text-muted\">({{ internship.role.title || \"Internship\" }})</h2>\n" +
    "    <div class=\"meta\">\n" +
    "      <span class=\"status\">\n" +
    "        <i ng-class=\"{\n" +
    "          'fa fa-cogs': internship.status == 'pending',\n" +
    "          'fa fa-check-square': internship.status == 'active',\n" +
    "          'fa fa-minus-circle': internship.status == 'rejected',\n" +
    "          'fa fa-trophy': internship.status == 'completed',\n" +
    "        }\"></i> {{ internship.status | titlecase }}\n" +
    "      </span>\n" +
    "      <span class=\"date\">\n" +
    "        <i class=\"fa fa-calendar\"></i> From {{ internship.startDate | date }} to {{ internship.endDate | date }}\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("login/activate.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/activate.tpl.html",
    "<section class=\"section-green section-activate\" fill-screen>\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-offset-3 col-sm-6 text-center\">\n" +
    "\n" +
    "        <div ng-show=\"!activated\">\n" +
    "          <h1>Activating Account</h1>\n" +
    "          <p>Please wait while your account is being activated...</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"activated\">\n" +
    "          <h1>Your account as been activated</h1>\n" +
    "          <p>Your account has been activated successfully. You may now login.</p>\n" +
    "          <a href=\"/login\" class=\"btn btn-default btn-icon-right\">Proceed to login <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>");
}]);

angular.module("login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/login.tpl.html",
    "<section class=\"section-green section-login\" fill-screen>\n" +
    "  \n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "      <form validate=\"true\" ng-submit=\"submit()\" role=\"form\" class=\"col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels\" login-form animated-form>\n" +
    "\n" +
    "        <h1 class=\"text-center animation-group\">Login</h1>\n" +
    "\n" +
    "        <div form-errors=\"errors\"></div>\n" +
    "\n" +
    "        <div class=\"form-group animation-group\">\n" +
    "          <label for=\"\">Email</label>\n" +
    "          <input type=\"email\" name=\"email\" ng-model=\"credentials.email\" class=\"form-control\" placeholder=\"Email\" float-label required>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group animation-group\">\n" +
    "          <label for=\"\">Password</label>\n" +
    "          <input type=\"password\" name=\"password\" ng-model=\"credentials.password\" class=\"form-control\" placeholder=\"Password\" float-label required>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group animation-group\">\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-6\">\n" +
    "              <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                  <input type=\"checkbox\" ng-model=\"credentials.remember\" name=\"credentials.remember\" ng-true-value=\"true\" fs-picker> Remember Me\n" +
    "                </label>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "              <button type=\"submit\" class=\"btn btn-default pull-right btn-icon-right\">Login <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <p class=\"animation-group text-center link-lost-password\"><a href=\"/password-reset\">Lost your password?</a> | <a href=\"/resend-activation\">Resend Activation Email</a></p>\n" +
    "\n" +
    "      </form>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</section>");
}]);

angular.module("login/password-reset.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/password-reset.tpl.html",
    "<section class=\"section-green section-password-reset\" fill-screen>\n" +
    "  \n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "      <div class=\"col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels text-center\">\n" +
    "        \n" +
    "        <!-- Send reset -->\n" +
    "        <div ng-show=\"action == 'send'\">\n" +
    "          \n" +
    "          <!-- Send form -->\n" +
    "          <form validate=\"true\" ng-submit=\"send()\" role=\"form\" animated-form ng-if=\"!sendSuccess\">\n" +
    "            <h1 class=\"text-center animation-group\">Password Reset</h1>\n" +
    "\n" +
    "            <div class=\"form-group animation-group\">\n" +
    "              <label for=\"\">Email</label>\n" +
    "              <input type=\"email\" name=\"email\" ng-model=\"reset.email\" class=\"form-control\" placeholder=\"Your account's email address\" float-label required>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"form-group animation-group\">\n" +
    "              <button type=\"submit\" class=\"btn btn-default btn-icon-right\">Send Confirmation Email <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "            </div>\n" +
    "          </form>\n" +
    "\n" +
    "          <!-- Send confirmation -->\n" +
    "          <div ng-if=\"sendSuccess\">\n" +
    "            <h1>Confirmation Send</h1>\n" +
    "            <p>A confirmation email has been sent to the address you provided. Please click the link in this email to set a new password for your account.</p>\n" +
    "          </div>\n" +
    "          \n" +
    "        </div>\n" +
    "        \n" +
    "\n" +
    "\n" +
    "        <!-- Reset password -->\n" +
    "        <div ng-show=\"action == 'reset'\">\n" +
    "          \n" +
    "          <!-- Reset form -->\n" +
    "          <form validate=\"true\" ng-submit=\"reset()\" role=\"form\" animated-form ng-if=\"!resetSuccess\">\n" +
    "            <h1 class=\"text-center animation-group\">Password Reset</h1>\n" +
    "\n" +
    "            <div class=\"form-group animation-group\">\n" +
    "              <label for=\"\">New Password</label>\n" +
    "              <input type=\"password\" name=\"password\" ng-model=\"reset.password\" class=\"form-control\" placeholder=\"New password for your account\" float-label required data-parsley-minlength=\"6\">\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"form-group animation-group\">\n" +
    "              <button type=\"submit\" class=\"btn btn-default btn-icon-right\">Reset Password <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "            </div>\n" +
    "          </form>\n" +
    "\n" +
    "          <!-- Reset confirmation -->\n" +
    "          <div ng-show=\"resetSuccess\">\n" +
    "            <h1>Your password has been reset</h1>\n" +
    "            <p>Your password has been reset successfully. You may now login using your new password.</p>\n" +
    "            <a href=\"/login\" class=\"btn btn-default btn-icon-right\">Proceed to login <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "          </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      \n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</section>");
}]);

angular.module("login/resend-activation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/resend-activation.tpl.html",
    "<section class=\"section-green section-resend-activation\" fill-screen>\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 floating-labels text-center\">\n" +
    "\n" +
    "        <!-- Send form -->\n" +
    "        <form validate=\"true\" ng-submit=\"send()\" role=\"form\" animated-form ng-if=\"!success\">\n" +
    "          <h1 class=\"text-center animation-group\">Resend Activation</h1>\n" +
    "\n" +
    "          <div form-errors=\"errors\"></div>\n" +
    "\n" +
    "          <div class=\"form-group animation-group\">\n" +
    "            <label for=\"\">Email</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"resend.email\" class=\"form-control\" placeholder=\"Your account's email address\" float-label required>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"form-group animation-group\">\n" +
    "            <button type=\"submit\" class=\"btn btn-default btn-icon-right\">Resend Activation Email <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <!-- Send confirmation -->\n" +
    "        <div ng-if=\"success\">\n" +
    "          <h1>Activation Email Send</h1>\n" +
    "          <p>An activation email has been sent to the address you provided. Please click the link in this email to verify your account.</p>\n" +
    "        </div>\n" +
    "        \n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>");
}]);

angular.module("register/modal-error.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("register/modal-error.tpl.html",
    "<div>\n" +
    "  <p>The following errors occured when creating you account;</p>\n" +
    "  <ul>\n" +
    "    <li ng-repeat=\"error in errors\">{{ error }}</li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <p class=\"actions text-center\">\n" +
    "    <button ng-click=\"close()\" type=\"submit\" class=\"btn btn-primary\">Ok</button>\n" +
    "  </p>\n" +
    "</div>");
}]);

angular.module("register/register-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("register/register-form.tpl.html",
    "<form validate=\"true\" ng-submit=\"submit()\" role=\"form\" class=\"col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 floating-labels\" animated-form>\n" +
    "\n" +
    "  <div class=\"form-group animation-group\">\n" +
    "    <h1 class=\"text-center\">{{ type() }} Signup</h1>\n" +
    "  </div>\n" +
    "\n" +
    "  <div stepped-form>\n" +
    "\n" +
    "\n" +
    "    <!-- Account Details -->\n" +
    "    <fieldset class=\"form-step\">\n" +
    "\n" +
    "      <div class=\"animation-group form-step-title\">\n" +
    "        <i class=\"number\">1</i>\n" +
    "        <h3 class=\"title\">My Account</h3>\n" +
    "        <p class=\"message\">Your account details will be used to login.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group animation-group\">\n" +
    "        <div class=\"row-sm\">\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label>Your Name</label>\n" +
    "            <input type=\"text\" name=\"user.profile.firstName\" ng-model=\"user.profile.firstName\" class=\"form-control\" placeholder=\"First Name\" float-label required>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <input type=\"text\" name=\"user.profile.lastName\" ng-model=\"user.profile.lastName\" class=\"form-control\" placeholder=\"Last Name\" float-label required>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group animation-group\">\n" +
    "        <label for=\"\">Email</label>\n" +
    "        <input type=\"email\" name=\"email\" ng-model=\"user.email\" class=\"form-control\" placeholder=\"Email\" float-label required>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group animation-group\">\n" +
    "        <label for=\"\">Password</label>\n" +
    "        <input type=\"password\" name=\"password\" ng-model=\"user.password\" class=\"form-control\" placeholder=\"Password\" float-label required data-parsley-minlength=\"6\">\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group animation-group\">\n" +
    "        <a href=\"#\" class=\"next btn btn-default pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-- My Profile -->\n" +
    "    <fieldset class=\"form-step\" ng-if=\"user.type == 'student'\">\n" +
    "\n" +
    "      <div class=\"form-step-title\">\n" +
    "        <i class=\"number\">2</i>\n" +
    "        <h3 class=\"title\">My Profile</h3>\n" +
    "        <p class=\"message\">Your profile will help us match interships relative to your skills and interests. It will also be made available to employers.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Introduction</label>\n" +
    "        <textarea name=\"user.profile.introduction\" ng-model=\"user.profile.introduction\" class=\"form-control\" placeholder=\"Introduction\" float-label></textarea>\n" +
    "        <div class=\"inline-help\">\n" +
    "          <i class=\"help-icon\" popover=\"Your introduction is a great opportunity to introduce yourself to employers.\" popover-title=\"Introduction\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"row-sm\">\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label>Course Name</label>\n" +
    "            <input type=\"test\" name=\"user.profile.courseName\" ng-model=\"user.profile.courseName\" class=\"form-control\" placeholder=\"Course Name\" float-label>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-sm-6\">\n" +
    "            <label class=\"sr-only\">University</label>\n" +
    "            <select selecter name=\"user.profile.university\" ng-model=\"user.profile.university\">\n" +
    "              <option value=\"\">Select a University</option>\n" +
    "              <option ng-repeat=\"o in universityOptions\" value=\"{{ o }}\">{{ o }}</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>LinkedIn Profile</label>\n" +
    "        <input type=\"test\" name=\"user.profile.linkedIn\" ng-model=\"user.profile.linkedIn\" class=\"form-control\" placeholder=\"LinkedIn Profile URL\" float-label>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Skills</label>\n" +
    "        <input type=\"test\" name=\"user.profile.skills\" ng-model=\"user.profile.skills\" class=\"form-control\" placeholder=\"Comma seperated list of skills\" float-label>\n" +
    "        <div class=\"inline-help\">\n" +
    "          <i class=\"help-icon\" popover=\"Enter a comma seperated list of your key skills. (For example; Graphic Design, Adobe Photoshop, etc.)\" popover-title=\"Key Skills\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group \">\n" +
    "        <a href=\"#\" class=\"previous btn btn-link btn-icon-left\"><i class=\"fa fa-arrow-left\"></i> Previous</a>\n" +
    "        <button type=\"submit\" class=\"btn btn-default pull-right btn-icon-right\">Signup <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "    \n" +
    "    <!-- Company Profile -->\n" +
    "    <fieldset class=\"form-step\" ng-if=\"user.type == 'employer'\">\n" +
    "\n" +
    "      <div class=\"form-step-title\">\n" +
    "        <i class=\"number\">2</i>\n" +
    "        <h3 class=\"title\">Company Profile</h3>\n" +
    "        <p class=\"message\">Your company profile will be displayed to students interested in applying for internships with you.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Company Name</label>\n" +
    "        <input type=\"test\" name=\"user.company.name\" ng-model=\"user.company.name\" class=\"form-control\" placeholder=\"Company Name\" float-label required>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Company Introduction</label>\n" +
    "        <textarea name=\"user.company.introduction\" ng-model=\"user.company.introduction\" class=\"form-control\" placeholder=\"Company Introduction\" float-label></textarea>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Website</label>\n" +
    "        <input type=\"test\" name=\"user.company.website\" ng-model=\"user.company.website\" class=\"form-control\" placeholder=\"Website URL\" float-label>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Skills</label>\n" +
    "        <input type=\"test\" name=\"user.company.skills\" ng-model=\"user.company.skills\" class=\"form-control\" placeholder=\"Comma seperated list of skills\" float-label>\n" +
    "        <div class=\"inline-help\">\n" +
    "          <i class=\"help-icon\" popover=\"Enter a comma seperated list of the skills your company looks for in interns. (For example; Graphic Design, Project Management, etc.)\" popover-title=\"Key Skills\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group\">\n" +
    "        <a href=\"#\" class=\"previous btn btn-link btn-icon-left\"><i class=\"fa fa-arrow-left\"></i> Previous</a>\n" +
    "        <a href=\"#\" class=\"next btn btn-default pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-- Company Logo -->\n" +
    "    <fieldset class=\"form-step\" ng-if=\"user.type == 'employer'\">\n" +
    "\n" +
    "      <div class=\"form-step-title\">\n" +
    "        <i class=\"number\">3</i>\n" +
    "        <h3 class=\"title\">Company Logo</h3>\n" +
    "        <p class=\"message\">Upload your company's logo to be displayed in you profile.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Company Logo</label>\n" +
    "        <input type=\"file\" name=\"logo\" ng-file-select class=\"form-control\">\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group\">\n" +
    "        <a href=\"#\" class=\"previous btn btn-link btn-icon-left\"><i class=\"fa fa-arrow-left\"></i> Previous</a>\n" +
    "        <a href=\"#\" class=\"next btn btn-default pull-right btn-icon-right\">Next <i class=\"fa fa-arrow-right\"></i></a>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-- Company Address -->\n" +
    "    <fieldset class=\"form-step\" ng-if=\"user.type == 'employer'\">\n" +
    "\n" +
    "      <div class=\"form-step-title\">\n" +
    "        <i class=\"number\">4</i>\n" +
    "        <h3 class=\"title\">Company Address</h3>\n" +
    "        <p class=\"message\">Please provide your company's address to help your interns locate you.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group vertical-input-stack\">\n" +
    "        <label>Street Address</label>\n" +
    "        <input type=\"test\" name=\"user.company.address.line1\" ng-model=\"user.company.address.line1\" class=\"form-control\" placeholder=\"Street Address\" float-label required>\n" +
    "        <input type=\"test\" name=\"user.company.address.line2\" ng-model=\"user.company.address.line2\" class=\"form-control\">\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group \">\n" +
    "        <div class=\"row-sm\">\n" +
    "          <div class=\"col-sm-5\">\n" +
    "            <label>City / State / Postcode</label>\n" +
    "            <input type=\"test\" name=\"user.company.address.city\" ng-model=\"user.company.address.city\" class=\"form-control\" placeholder=\"City\" float-label required>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-sm-5\">\n" +
    "            <label class=\"sr-only\">State</label>\n" +
    "            <select selecter name=\"user.company.address.state\" ng-model=\"user.company.address.state\" placeholder=\"State\" required>\n" +
    "              <option value=\"\">Select a State</option>\n" +
    "              <option>Australian Capital Territory</option>\n" +
    "              <option>New South Wales</option>\n" +
    "              <option>Northern Territory</option>\n" +
    "              <option>Queensland</option>\n" +
    "              <option>South Australia</option>\n" +
    "              <option>Tasmania</option>\n" +
    "              <option>Victoria</option>\n" +
    "              <option>Western Australia</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-sm-2\">\n" +
    "            <label class=\"sr-only\">Postcode</label>\n" +
    "            <input type=\"test\" name=\"user.company.address.postcode\" ng-model=\"user.company.address.postcode\" class=\"form-control\" placeholder=\"1234\" required data-parsley-type=\"integer\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group \">\n" +
    "        <label>Country</label>\n" +
    "        <select selecter name=\"user.company.address.country\" ng-model=\"user.company.address.country\" placeholder=\"Country\" float-label required>\n" +
    "          <option value=\"\">Select a Country</option>\n" +
    "          <option selected=\"selected\">Australia</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group\">\n" +
    "        <a href=\"#\" class=\"previous btn btn-link btn-icon-left\"><i class=\"fa fa-arrow-left\"></i> Previous</a>\n" +
    "        <button type=\"submit\" ng-disabled=\"loading\" class=\"btn btn-default pull-right btn-icon-right\">Signup <i class=\"fa fa-arrow-right\"></i></button>\n" +
    "      </div>\n" +
    "    </fieldset>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("register/register.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("register/register.tpl.html",
    "<section class=\"section-green section-register\" fill-screen>\n" +
    "  \n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "      <div register-form user=\"user\" submit=\"submit\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</section>");
}]);

angular.module("search/results-map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/results-map.tpl.html",
    "<div class=\"results-map\">\n" +
    "\n" +
    "  <div class=\"content-box widget-search\">\n" +
    "    <header>\n" +
    "      <h3>Search</h3>\n" +
    "      <div results-view-toggle query=\"query\"></div>\n" +
    "    </header>\n" +
    "  </div>\n" +
    "\n" +
    "  <div id=\"map\"></div>\n" +
    "  <script type=\"text/ng-template\" id=\"infoWindowTemplate\">\n" +
    "    <div class=\"infobox-content\">\n" +
    "      <article>\n" +
    "        <button type=\"button\" class=\"close close-button\">&times;</button>\n" +
    "        <a href=\"{{ result.url }}\"><img ng-show=\"result.logoUrl\" ng-src=\"{{ result.logoUrl }}\" alt=\"{{ result.name }}\"></a>\n" +
    "        <hr />\n" +
    "        <header class=\"clearfix\">\n" +
    "          <h4 class=\"pull-left\"><a href=\"{{ result.url }}\">{{ result.name }}</a></h4>\n" +
    "          <a href=\"{{ result.url }}\" class=\"btn btn-primary btn-sm pull-right\">More Info <i class=\"fa fa-arrow-right small\"></i></a>\n" +
    "        </header>\n" +
    "      </article>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "</div>");
}]);

angular.module("search/search.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/search.tpl.html",
    "<article class=\"content-page\">\n" +
    "  <header>\n" +
    "    <div class=\"container\">\n" +
    "      <h1 class=\"page-title\">Search</h1>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "\n" +
    "  <!-- List View -->\n" +
    "  <section ng-show=\"query.view == 'list'\" class=\"main\">\n" +
    "    <div class=\"container\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <div search-widget query=\"query\" options=\"options\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-8\">\n" +
    "\n" +
    "          <div class=\"content-box widget-search\">\n" +
    "            <header class=\"clearfix\">\n" +
    "              <h3 class=\"pull-left\">Results</h3>\n" +
    "              <div class=\"pull-right\" results-view-toggle query=\"query\"></div>\n" +
    "            </header>\n" +
    "\n" +
    "            <div company-list companies=\"results\"></div>\n" +
    "\n" +
    "            <div ng-show=\"!results.length\" class=\"no-results\">\n" +
    "              <p class=\"lead\">No results found!</p>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "\n" +
    "\n" +
    "  <section ng-if=\"query.view=='map'\" class=\"main\">\n" +
    "    <div results-map results=\"results\" query=\"query\"></div>\n" +
    "  </section>\n" +
    "\n" +
    "</article>");
}]);

angular.module("search/widgets/search.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/widgets/search.tpl.html",
    "<div>\n" +
    "  <div class=\"content-box widget-search\">\n" +
    "    <header class=\"clearfix\">\n" +
    "      <h3 class=\"pull-left\">Search</h3>\n" +
    "    </header>\n" +
    "\n" +
    "    <form role=\"form\" ng-submit=\"search()\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"query.query\" class=\"form-control\" placeholder=\"Search for...\">\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary btn-icon-left btn-block\">Search <i class=\"fa fa-search\"></i></button>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"content-box widget-filter hidden-xs\">\n" +
    "    <header class=\"clearfix\">\n" +
    "      <h3 class=\"pull-left\">Search in Locations</h3>\n" +
    "    </header>\n" +
    "    <div checkbox-list selected=\"query.locations\" options=\"options.locations\" filterable=\"true\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"content-box widget-filter hidden-xs\">\n" +
    "    <header class=\"clearfix\">\n" +
    "      <h3 class=\"pull-left\">Search by Skills</h3>\n" +
    "    </header>\n" +
    "    <div checkbox-list selected=\"query.skills\" options=\"options.skills\" filterable=\"true\"></div>\n" +
    "  </div>\n" +
    "</div>");
}]);
