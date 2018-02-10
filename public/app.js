// This code enables the delete button to remove comments

$(document).ready(function(){
  // when the delete button is clicked, run the following function.
  $('.delete-button').on('click', function(){
  e.preventDefault();
  var reset = location.href +'/'+ $(this).data('Note');
  // ajax call to delete data
  $.ajax({
    method: "DELETE",
    url:reset
  })
  location.reload();
})
});