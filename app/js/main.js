"use strict";

$.get("/projectList", function(responseData) {
  var dirs = responseData.data;
  //console.log("Projects list: " + dirs);
  for (var i = 0; i < dirs.length; i++) {
    var o = new Option(dirs[i].name , dirs[i].path + '/' + dirs[i].main);
    $('#project-list').append(o);
  }
});

$('#open-button').on('click',function(ev){
  var val = $('#project-list').val();
  document.getElementById('loaded-app').src = val;
});
