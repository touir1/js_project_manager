"use strict";

$.get("/projectList", function(responseData) {
  var dirs = responseData.data;
  //console.log("Projects list: " + dirs);
  for (var i = 0; i < dirs.length; i++) {
    console.log(dirs[i]);
  }
});
