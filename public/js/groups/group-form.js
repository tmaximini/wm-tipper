$(document).ready(function() {
  $('#password').change(function() {
    if ($(this).val()) {
      $('#is_public').attr('checked', false);
    } else {
      $('#is_public').attr('checked', true);
    }
  });
});