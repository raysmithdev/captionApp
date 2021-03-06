function upload(file, signed_request, url, done) {
  var xhr = new XMLHttpRequest()
  xhr.open("PUT", signed_request)
  xhr.setRequestHeader('x-amz-acl', 'public-read')
  xhr.onload = function() {
    if (xhr.status === 200) {
      done()
    }
  }

  xhr.send(file)
}

function sign_request(file, done) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", "/sign?file_name=" + file.name + "&file_type=" + file.type)

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText)
      done(response)
      }
    }

      xhr.send()
}

function printLabelsTest(responses){
  $('#pic-labels').empty();
  var intro;
  
  $('#pic-labels').append('<span>'+'Your photo '+'</span>');
  for(var i=0; i < responses.Labels.length; i++){
    var theLabel = responses.Labels[i].Name[0]; 
    // console.log(theLabel);
    if(theLabel.match(/[aeiouAEIOU]/)){
      intro = " has an ";
    } 
    else{
      intro = " has a ";
    }
    $('#pic-labels').append('<span>'+intro+responses.Labels[i].Name)+'</span>';
  }
  $('#pic-labels').append('<span>'+' in it.'+'</span>');    
}

function addUser(firstName, lastName, username, password, callback) {
  $.ajax({
    url: "http://localhost:8080/users/",
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(
      {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
      }
    ),
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function logIn(username, password, callback) {
  $.ajax({
    url: "http://localhost:8080/users/login",
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    data: {
      username: username,
      password: password
    },
    // data: JSON.stringify(
    //   {
    //   username: username,
    //   password: password
    //   }
    // ),
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

$(document).ready( function(){

    $('#rekog-button').click(function(){
      $('#header-container').fadeOut(300);
      $('#vid-container').fadeOut(300);
      $('#story-content').fadeOut(300);
      $('#foot-div').fadeOut(300);
      $('#rekog-link').fadeOut(300);
      $('#signIn-link').fadeOut(300);
      $('#rekog-block').fadeIn(600);
    });

    $('.message a').click(function(){
      $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });

    $('#signIn-button').click(function(){
      $('#header-container').fadeOut(300);
      $('#vid-container').fadeOut(300);
      $('#story-content').fadeOut(300);
      $('#foot-div').fadeOut(300);
      $('#signIn-link').fadeOut(300);
      $('#rekog-link').fadeOut(300);
      $('#signIn-block').fadeIn(600);
    });

    $('.back-button').click(function(){
      $('.register-form')[0].reset();
      $('.login-form')[0].reset();
      $('#signIn-block').fadeOut(300);
      $('#rekog-block').fadeOut(300);
      $('#sign-up').fadeOut(300);
      $('#header-container').fadeIn(300);
      $('#story-content').fadeIn(300);
      $('#foot-div').fadeIn(300);
      $('#vid-container').fadeIn(300);
      $('#signIn-link').fadeIn(600);
      $('#rekog-link').fadeIn(600);
    });

    $('.register-form').submit(function(event) {
      event.preventDefault();
      let firstName = $('.register').find('#firstName').val();
      console.log(firstName);
      let lastName = $('.register').find('#lastName').val();
      console.log(lastName);
      let username = $('.register').find('#username').val();
      console.log(username);
      let password = $('.register').find('#password').val();
      console.log(password);
      addUser(firstName, lastName, username, password, function(data){
        console.log(data);
      });
    });

    $('.login-form').submit(function(event) {
      event.preventDefault();
      let username = $('.login-form').find('#login-username').val();
      console.log(username);
      let password = $('.login-form').find('#login-pw').val();
      console.log(password);
      logIn(username, password, function(loginData){
        console.log(loginData);
      });
    });

    document.getElementById("image").onchange = function() {
      var file = document.getElementById("image").files[0]
      if (!file) return

      sign_request(file, function(response) {
        upload(file, response.signed_request, response.url, function() {
          document.getElementById("preview").src = response.url
          var xhr = new XMLHttpRequest()
          
          xhr.open("GET", "/api/rekog?file_name=" + file.name)

          xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
              var response = JSON.parse(xhr.responseText)
            //RESPONSE IS MY OBJECT 
              printLabelsTest(response);

            }
          }

          xhr.send() 

        })
      })
    }
})
