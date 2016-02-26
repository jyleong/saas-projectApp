// need method to determine free or premium

//function to get params from URL

function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
};

$(document).ready(function() {
  
  var show_error, stripeResponseHandler, submitHandler;
  

//function to handle the submit of the form and intercept the default event
  submitHandler = function(event) {
    var $form = $(event.target);
    $form.find("input[type=submit]").prop("disabled", true); // disable the submit button when clicked
    if(Stripe){ // if initialized correctly
      Stripe.card.createToken($form, stripeResponseHandler);
    } else {
      show_error("Failed to load credit card processing functionality. Please reload this page in your browser.")
    }
    // dissabled that default ation
    return false;
  };
// Initiate submit handler listener for any form with class cc_form

  $(".cc_form").on('submit', submitHandler);

// handle event of plan drop down changing
  var handlePlanChange = function(planType, form) {
    var $form = $(form);
    
    if (planType == undefined) {
      planType = $('#tenant_plan :selected').val(); // set for w.e is tenant id
    }
    
    if (planType === 'premium') {
      $('[data-stripe]').prop('required', true);
      $form.off('submit');
      $form.on('submit', submitHandler);
      $('[data-stripe]').show();
    } else {
      $('[data-stripe]').hide();
      $form.off('submit');
      $('[data-stripe]').removeProp('required');
    }
  }
// Set up plan change event listener #tenant_plan id in the forms for class cc_form
  $("#tenant_plan").on('change', function(event) { // if used actonsees change
    handlePlanChange($('#tenant_plan :selected').val(), ".cc_form");
  });
// call plan change handler so that the plan is set correctly in the drop down when the page loads
  handlePlanChange(GetURLParameter('plan'), ".cc_form");
// function to handle the token received form Stripe and remove credit card fields
  stripeResponseHandler = function(status, response) {
    var token, $form;
    $form = $('.cc_form');
    
    if (response.error) {
      console.log(response.error.message);
      show_error(response.error.message);
      $form.find("input[type=submit]").prop("disabled", true)
    }
    else {
      token = response.id;
      $form.append($("<input type=\"hidden\" name=\"payment[token]\" />").val(token));
      // remove info from credit card
      $("[data-strip=number]").remove();
      $("[data-stripe=cvv]").remove();
      $("[data-stripe=exp-year]").remove();
      $("[data-stripe=exp-month]").remove();
      $("[data-stripe=label]").remove();
      $form.get(0).submit();
    }
  };
//function to show errors when Stripe functionality returns an error
  show_error = function (message) {
  
    if($("#flash-messages").size() < 1){
      $('div.container.main div:first').prepend("<div id='flash-messages'></div>")
    }
    $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
    $('.alert').delay(5000).fadeOut(3000);

    return false;
  };


});