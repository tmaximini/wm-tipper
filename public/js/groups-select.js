jQuery(document).ready(function() {

  jQuery.get('/groups.json', function (groups) {

    console.log('found groups: ', groups);

    jQuery('#join-group input').select2({
        width: '350px',
        placeholder: 'Wähle eine Gruppe',
        minimumInputLength: 1,
        data: groups
    });


    jQuery('#join-group input').on('change', function(e) {
      console.log('change ' + JSON.stringify( { val:e.val, added:e.added, removed:e.removed } ) );
    });


  });

});