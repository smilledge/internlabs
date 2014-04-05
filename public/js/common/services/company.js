angular.module('InternLabs.services')


  /**
   * Company Model
   */
  .factory('Company', function() {

    var Company = function(data) {
      angular.extend(this, data);
    };

    Company.prototype.getDisplayAddress = function() {
      var html = "", address = this.address;

      html += address.line1 + '<br />';
      if ( address.line2 ) html += address.line2 + '<br />';
      html += address.city + ', ';
      html += address.state + ', ';
      html += address.postcode + '<br />';
      html += address.country;

      return html;
    };

    Company.prototype.getGoogleMapsLink = function() {
      var address = this.address, url = "";

      url += "http://maps.google.com/?ie=UTF8&hq=&ll=";
      url += address.lat + "," + address.lng;
      url += "&q=" + address.lat + "," + address.lng;;
      url += "&z=18";

      return url;
    };

    return Company;
  })


  /**
   * Company Service
   */
  .service('CompanyService', function($http, $q, Company, Options) {

    /**
     * Get all companies
     */
    this.get = function(companyId) {
      var deferred = $q.defer();

      $http.get(Options.apiUrl('companies/' + companyId), {
        cache: true
      })
        .success(function(data) {
          if ( ! data.success ) {
            console.log(data);
          }

          deferred.resolve(new Company(data.data.company));
        });

      return deferred.promise;
    };

  })




  ;