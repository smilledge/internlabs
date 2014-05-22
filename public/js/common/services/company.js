angular.module('InternLabs.services')

  .run(function(Restangular) {

    Restangular.extendModel('companies', function(model) {
      

      /**
       * Get a formatted company address
       */
      model.getDisplayAddress = function() {
        var html = "", address = this.address;
        html += address.line1 + '<br />';
        if ( address.line2 ) html += address.line2 + '<br />';
        html += address.city + ', ';
        html += address.state + ', ';
        html += address.postcode + '<br />';
        html += address.country;
        return html;
      };


      /**
       * Get a link to the company's address on google maps
       */
      model.getGoogleMapsLink = function() {
        var address = this.address, url = "";
        url += "http://maps.google.com/?ie=UTF8&hq=&ll=";
        url += address.lat + "," + address.lng;
        url += "&q=" + address.lat + "," + address.lng;;
        url += "&z=18";
        return url;
      };


      model.getSkillsString = function() {
        var string;
        if ( ! _.isArray(this.skills) ) {
          return null;
        }
        var string = this.skills.slice(0, 3).join(', ');
        if ( this.skills.length > 3) {
          string += ' (+' + (this.skills.length - 3) + ' more)';
        }
        return string;
      };


      return model;
    });

  })


  ;