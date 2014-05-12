$(document).ready(function() {

  $.get('/groups.json', function (groups) {

    console.log('found groups: ', groups);

    $('#join-group input').select2({
        width: '350px',
        placeholder: 'Wähle eine Gruppe',
        minimumInputLength: 1,
        data: groups
    });


    $('#join-group input').on('change', function(e) {
      console.log('change ' + JSON.stringify( { val:e.val, added:e.added, removed:e.removed } ) );
      window.location.href = '/groups/' + e.val;
    });


  });

});