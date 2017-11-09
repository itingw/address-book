var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        // console.log(xmlHttp.responseText);
        // return xmlHttp.responseText;
        callback(xmlHttp.responseText);
}
// var url = "http://virtserver.swaggerhub.com/itingw/address-book/1.0.0/user/%7B0%7D";
var url = "https://raw.githubusercontent.com/itingw/address-book/master/js/data.json";
xmlHttp.open("GET", url, true); // true for asynchronous
xmlHttp.send(null);

var callback = function(userData) {
  var users = JSON.parse(userData).users;
  display.init(users);
}

var display = {

  init: function(userData) {

    //create DOM elements
    var list = document.createElement("div");
    list.id = "list";
    var detail = document.createElement("div");
    detail.id = "detail";

    var name = document.createElement("h1");
    name.id = "name";
    var info = document.createElement("div");
    info.id = "info";

    var email = document.createElement("p");
    email.id = "email";
    var phone = document.createElement("p");
    phone.id = "phone";
    var role = document.createElement("p");
    role.id = "role";
    var lastLogin = document.createElement("p");
    lastLogin.id = "lastLogin";
    var actions = document.createElement("p");
    actions.id = "actions";

    var image = document.createElement('img');
    image.id = "image";

    var editDiv = document.createElement("div");
    editDiv.id = "edit";

    //append DOM elements in order
    detail.appendChild(name);
    detail.appendChild(image);
    detail.appendChild(info);
    detail.appendChild(editDiv);
    info.appendChild(email);
    info.appendChild(phone);
    info.appendChild(role);
    info.appendChild(lastLogin);
    info.appendChild(actions);

    //append list and detail to body
    $('body').append(list);
    $('body').append(detail);

    //media query changes welcome message
    const mq = window.matchMedia( "(min-width: 450px)" );
    if(mq.matches) {
      document.getElementById("name").textContent = "Welcome to the directory. Please click on a name in the list to learn more about the user!";
    }
    else {
      document.getElementById("name").textContent = "Welcome to the directory. Please open the menu and click on a name in the list to learn more about the user!";
    }

    this.renderList(userData);
  },

  //render the list of buttons
  renderList: function(userData) {
    //if the user buttons already exist, remove them
    if(document.getElementsByClassName("list-button") !== null)
    {
      $(".list-button").remove();
    }

    //add User buttons
    var allUsers = userData;
    console.log(allUsers)
    for (var i = 0; i < allUsers.length; i++)
    {
        //create buttons, make sure to skip through users that have been deleted
        if(allUsers[i] !== undefined) {
          var button = document.createElement("button");
          var user = allUsers[i];
          button.id = user.idNo;
          button.className = "list-button";
          button.append(user.name);
          document.getElementById("list").appendChild(button);

          //use React to make this happen
          button.addEventListener('click', function(user) {
            display.render(user);
          }, false);
        }
    }

    //add the add user button to the end of the list
    this.showAddUser();

  },

  //render the details
  render: function(user) {

    //make sure the detail pane is showing
    this.showElementbyId("detail", "inline-block");
    this.showElementbyId("name", "block");
    this.showElementbyId("image", "block");
    this.showElementbyId("info", "block");

    var user = user;
    //change names of DOM elements
      document.getElementById("name").textContent = user.name;
      document.getElementById("email").textContent = "email: " + user.email;
      document.getElementById("phone").textContent = "phone: " +user.phone;
      document.getElementById("role").textContent = "role: " + user.role;
      document.getElementById("lastLogin").textContent = "last login: " + user.lastLogin;
      document.getElementById("actions").textContent = "actions: " + user.actions;
      document.getElementById("image").src = user.url;

      //show the edit and delete button
      this.showEditButton();
      this.showDeleteButton();
    // }

    //make sure the form, cancel and submit buttons are hidden
    this.hideElementbyId("form");
    this.hideElementbyId("cancel");
    this.hideElementbyId("submit");

  },

  //hides specified element by Id
  hideElementbyId: function(id) {
    if(document.getElementById(id) !== null) {
      document.getElementById(id).style.display = "none";
    }
  },

  //show element by Id
  showElementbyId: function(id, style) {
    if(document.getElementById(id).style.display == "none"){
        document.getElementById(id).style.display = style;
    }

  },

  //create the add user button
  showAddUser: function() {

    // if the user button already exists, hide it
    this.hideElementbyId("add-user-button");

    // add the add user button
    var addUser = document.createElement("button");
    addUser.id = "add-user-button";
    addUser.className = "list-button";
    addUser.append("+");
    document.getElementById("list").appendChild(addUser);

    addUser.onclick = function() {
      // controller.setCurrentUser(null);
      display.addUserform();
    };

  },

  //create the add user function, hiding all unnecessary dom elements
  addUserform: function() {
    this.hideElementbyId("name");
    this.hideElementbyId("image");
    this.hideElementbyId("info");
    this.hideElementbyId("editButton");
    this.hideElementbyId("deleteButton");
    this.showElementbyId("edit", "block");
    this.showEditForm(null);
    this.fillAllTextInput(null);
  },

  //create the edit button
  showEditButton: function() {

    //if the edit button hasn't been added to the DOM yet, create it. otherwise, just show it
    if(document.getElementById("editButton") === null) {
      var editButton = document.createElement("button");
      editButton.append("Edit User");
      editButton.id = "editButton";
      document.getElementById("edit").append(editButton);

      //when clicked, edit form will show up, edit button will be disabled
      editButton.onclick = function() {
        // display.showEditForm(controller.getCurrentUser());
      };
    }
    else {
      this.showElementbyId("edit", "block");
      this.showElementbyId("editButton", "block");
    }
  },

  //create the form for adding new user or updating existing user
  showEditForm: function(user) {
    this.hideElementbyId("info");
    this.hideElementbyId("editButton");

    //if the form doesn't exist yet in the DOM, create it
    if(document.getElementById("form") === null) {
      var editForm = document.createElement("form");
      editForm.id = "form";
      document.getElementById("edit").append(editForm);

      //create form
      this.createTextInput("name: ", "inputName");
      this.createTextInput("image url: ", "inputUrl");
      this.createTextInput("email: ", "inputEmail");
      this.createTextInput("phone: ", "inputPhone");
      this.createTextInput("role: ", "inputRole");
      this.createTextInput("last login: ", "inputLogin");
      this.createTextInput("actions: ", "inputActions");

      //fill the inputs with the current user
      this.fillAllTextInput(user);

      //create cancel button that removes the form when clicked
      var cancelButton = document.createElement("button");
      cancelButton.id = "cancel";
      cancelButton.type = "button";
      cancelButton.append("Cancel");
      editForm.appendChild(cancelButton);
      cancelButton.onclick = function() {
        display.hideElementbyId("form");
        display.hideElementbyId("submit");
        display.hideElementbyId("cancel");
        display.render();
        return false;
      };

      //create submit button that updates the info of the current User
      //or adds a new user for the new user form
      var submitButton = document.createElement("button");
      submitButton.id = "submit";
      submitButton.type = "button";
      submitButton.append("Submit");
      editForm.appendChild(submitButton);
      submitButton.onclick = function() {
        if(controller.getCurrentUser() != null) {
          controller.updateInfo();
        }
        else {
          if($("#inputName").val() !== "") {
            controller.addUser();
          }
          else {
            window.alert("Please include a name!");
            return false;
          }
        }
        display.render();
        display.renderList();
        return false;
      };

    }
    else {
      this.fillAllTextInput(controller.getCurrentUser());
      this.showElementbyId("form", "inline-block");
      this.showElementbyId("cancel", "block");
      this.showElementbyId("submit", "block");
    }

  },

  //create text input for the forms
  createTextInput: function(labelName, id) {
    var form = document.getElementById("form");

    var label = document.createElement('label');
    label.textContent = labelName;

    var input = document.createElement("input");
    input.setAttribute('type',"text");
    input.id = id;

    form.appendChild(label);
    form.appendChild(input);
  },

  // fill the text input with content
  fillTextInput: function(id, text) {
    document.getElementById(id).value = text;

  },

  // fill all the text inputs in the form
  fillAllTextInput: function(info) {
    if(info!= null) {
      //set default imputs as the current User's info if the user exists
      this.fillTextInput("inputName", info.name);
      this.fillTextInput("inputUrl", info.url);
      this.fillTextInput("inputEmail", info.email);
      this.fillTextInput("inputPhone", info.phone);
      this.fillTextInput("inputRole", info.role);
      this.fillTextInput("inputLogin", info.lastLogin);
      this.fillTextInput("inputActions", info.actions);
    }
    else {
      this.fillTextInput("inputName", "");
      this.fillTextInput("inputUrl", "");
      this.fillTextInput("inputEmail", "");
      this.fillTextInput("inputPhone", "");
      this.fillTextInput("inputRole", "");
      this.fillTextInput("inputLogin", "");
      this.fillTextInput("inputActions", "");
    }
  },

  //updates name of the user on a new button
  updateButton: function(newUserID, newName) {
    document.getElementById(newUserID).textContent = newName;
  },

  //create the delete button
  showDeleteButton: function() {
    //create DOM elements if the delete button doesn't exist yets
    if(document.getElementById("delete") === null) {
      var deleteDiv = document.createElement("div");
      deleteDiv.id = "delete";
      var deleteButton = document.createElement("button");
      deleteButton.append("Delete User");
      deleteButton.id = "deleteButton";
      deleteDiv.append(deleteButton);

      //when clicked, the user will be deleted
      deleteButton.onclick = function() {
        var currentUserID = controller.getCurrentUser().idNo;
        controller.deleteUser(currentUserID);
        display.hideDeletedUser(currentUserID);
      };
      $('#detail').append(deleteDiv);
    }
    else {
      this.showElementbyId("delete", "inline-block");
      this.showElementbyId("deleteButton", "inline-block");
    }

  },

  //hide the deleted user
  hideDeletedUser: function(userID) {
    //remove the button from the list
    document.getElementById(userID).remove();
    //change title to show that the user is deleted
    document.getElementById("name").innerHTML =  "User Deleted!";
    this.hideElementbyId("image");
    this.hideElementbyId("info");
    this.hideElementbyId("edit");
    this.hideElementbyId("delete");
  }

};
