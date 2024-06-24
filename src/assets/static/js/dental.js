function getQueryParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

jQuery(document).ready(function () {
    // Initial selection
    var dentalParam = getQueryParam('dental');
    if (dentalParam === 'true') {
        // Hide the specified elements
        jQuery(".image-container, .option-wrapper").hide();
    }
    else{
        jQuery(".dental-wrapper").hide();
    }
    
    jQuery(".dental-symptom-wrapper:first").addClass("selected");
    updatePreview(jQuery(".dental-symptom-wrapper:first"));
    
    // Click event for dental-symptom-wrapper
    jQuery(".dental-symptom-wrapper").click(function () {
        // Remove selected class from all elements
        jQuery(".dental-symptom-wrapper").removeClass("selected");
        
        // Add selected class to the clicked element
        jQuery(this).addClass("selected");
        
        // Update the preview
        updatePreview(jQuery(this));
    });

    jQuery(".left-panel").click(function () {
      var symptomName = jQuery(this).data("symptomName"); // Retrieve the stored symptom name
      console.log('Symptom Name:', symptomName);
        console.log('here');
        openPreviewModal(symptomName);
    });

    // Function to update the preview in the left panel
    function updatePreview(element) {
      
        var previewContent = element.html(); // You can customize this based on your needs
        var symptomName = element.find(".modal-title p").text(); // Extract the symptom name

        // jQuery(".left-panel").html(previewContent);
        jQuery(".left-panel").html(previewContent).data("symptomName", symptomName); // Store the symptom name in the data attribute

    }

    // Function to open the preview modal
    function openPreviewModal(symptomName) {
      selectedBodyPart = symptomName;
        var bodyPart ='teeth';
        var gender = 'female'
        // Show the modal
        $("body").addClass("loading");

      var apiUrl =
      '/api/public/v1/dental/consultationService?bodyPart=' +
        bodyPart +
        '&gender=' +
        gender +
        '&symptom=' +
        symptomName;
      
        $.ajax({
            url: getApiUrl() + apiUrl,
            method: 'GET',
            headers: {
              'X-TenantID': '' + bid
            },
            success: function (data, textStatus) {
    
              try {
                var symptoms = data;
                var optionsHtml = "";
                var radio = "radio"
                for (var i = 0; i < symptoms.length; i++) {
                  radio = radio + i
                  symptoms[i].value = symptoms[i].value.replace("'", "&#39;");
                  optionsHtml += "<div class='checkbox_sec c1'><input onchange='onSymptomChange()' type='checkbox' name='symptoms' id='" +
                    radio + "' value='" +
                    symptoms[i].value + "'><label for= '" +
                    radio + "'><span>" + symptoms[i].name + "<span></label></div>";
                }
                if (data.length > 0) {
                  $("#symptom-list").html(optionsHtml);
                  selectCurrentSymptom();
    
                } else {
                  var bgColor = localStorage.getItem("bgColor")
                  var html = "<p class='no-symptoms' style=color:" + bgColor + " > No Symptoms Associated</p>"
                  $("#symptom-list").html(html)
                }
    
                $(".modal-wrapper").css("display", "block");
              } catch (e) { }
    
    
              $("body").removeClass("loading");
    
            },
            error: function () {
              $("body").removeClass("loading");
              alert("Unable to load the symptoms.");
            }
          });
        // You can customize this to load dynamic content or perform other actions
    }
});