$(function() {

/* ------------- CONTROLLER ------------- */

  var controller = {

    //returns info for all Users
    getUserInfo: function() {
      return userData.users;
    },

    //returns info for current User
    getCurrentUser: function() {
      return userData.currentUser;
    },

    //sets currentUser to User with ID in button click
    setCurrentUser: function(id) {
      userData.currentUser = this.getUserInfo()[id];
    },

    // add new user
    addUser: function() {

      var newUserID = userData.users.length;

      //grab inputs from fields
      var newName = $("#inputName").val();
      var newUrl = $("#inputUrl").val();
      var newEmail = $("#inputEmail").val();
      var newPhone = $("#inputPhone").val();
      var newRole = $("#inputRole").val();
      var newLogin = $("#inputLogin").val();
      var newActions = $("#inputActions").val();

      userData.users.push({ idNo: newUserID, name: newName, url: newUrl, email: newEmail, phone: newPhone, role: newRole, lastLogin: newLogin, actions: newActions })
      controller.setCurrentUser(newUserID);

      //update display and buttons
      display.render();
      display.renderList();
    },

    // delete user
    deleteUser: function(id) {
      delete userData.users[id];
    },

    //updates array with new information from edit form
    updateInfo: function() {

      //grab inputs from fields
      var newName = $("#inputName").val();
      userData.currentUser.name = newName;
      var newUrl = $("#inputUrl").val();
      userData.currentUser.url = newUrl;
      var newEmail = $("#inputEmail").val();
      userData.currentUser.email = newEmail;
      var newPhone = $("#inputPhone").val();
      userData.currentUser.phone = newPhone;
      var newRole = $("#inputRole").val();
      userData.currentUser.role = newRole;
      var newLogin = $("#inputLogin").val();
      userData.currentUser.login = newLogin;
      var newActions = $("#inputActions").val();
      userData.currentUser.actions = newActions;

      //update array with inputs from fields
      var updatedUser = userData.currentUser.idNo;
      userData.users[updatedUser].name = newName;
      userData.users[updatedUser].url = newUrl;
      userData.users[updatedUser].email = newEmail;
      userData.users[updatedUser].phone = newPhone;
      userData.users[updatedUser].role = newRole;
      userData.users[updatedUser].lastLogin = newLogin;
      userData.users[updatedUser].actions = newActions;

      //update display and buttons
      display.render();
      display.updateButton(updatedUser, newName);
    }


  }

/* ------------- VIEW ------------- */

  var display = {

    init: function() {

      //add DOM elements
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

      $('body').append(list);
      $('body').append(detail);

      document.getElementById("name").textContent = "Welcome to the directory. Please click on a name in the list to learn more about the user!";

      this.renderList();
    },

    //render the list of buttons
    renderList: function() {
      //if the user buttons already exist, remove them
      if(document.getElementsByClassName("list-button") != null)
      {
        $(".list-button").remove();
      }

      //add User buttons
      var allUsers = controller.getUserInfo();
      for (var i = 0; i < allUsers.length; i++)
      {
          var UserID = allUsers[i].idNo;
          var button = document.createElement("button");
          button.id = UserID;
          button.className = "list-button";
          button.append(allUsers[i].name);
          document.getElementById("list").appendChild(button);
          //when button is clicked
          button.onclick = function() {
            controller.setCurrentUser(this.id);
            display.render();
          }
      }
      this.showAddUser();

    },

    //render the details
    render: function() {

      this.showElementbyId("detail", "inline-block");
      this.showElementbyId("name", "block");
      this.showElementbyId("image", "block");
      this.showElementbyId("info", "block");

      //change names of DOM elements
      if(controller.getCurrentUser() !== undefined) {
        document.getElementById("name").textContent = controller.getCurrentUser().name;
        document.getElementById("email").textContent = "email: " + controller.getCurrentUser().email;
        document.getElementById("phone").textContent = "phone: " + controller.getCurrentUser().phone;
        document.getElementById("role").textContent = "role: " + controller.getCurrentUser().role;
        document.getElementById("lastLogin").textContent = "last login: " + controller.getCurrentUser().lastLogin;
        document.getElementById("actions").textContent = "actions: " + controller.getCurrentUser().actions
        document.getElementById("image").src = controller.getCurrentUser().url;

        this.showEditButton();
        this.showDeleteButton();
      }

      this.hideElementbyId("form");
      this.hideElementbyId("cancel");
      this.hideElementbyId("submit");

    },

    //hides specified element by Id
    hideElementbyId: function(id) {
      if(document.getElementById(id) != null) {
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
      addUser.className = "list-button"
      addUser.append("+");
      document.getElementById("list").appendChild(addUser);

      addUser.onclick = function() {
        controller.setCurrentUser(null);
        display.addUserform();
      }

    },

    //create the add user function
    addUserform: function() {
      this.hideElementbyId("name");
      this.hideElementbyId("image");
      this.hideElementbyId("info");
      this.hideElementbyId("form");
      this.hideElementbyId("editButton");
      this.hideElementbyId("deleteButton");
      this.showElementbyId("edit", "block");
      this.showEditForm(null);
      this.fillAllTextInput(null);
    },

    //create the edit button
    showEditButton: function() {

      if(document.getElementById("editButton") == null) {
        //create DOM elements
        var editButton = document.createElement("button");
        editButton.append("Edit User");
        editButton.id = "editButton"
        document.getElementById("edit").append(editButton);

        //when clicked, edit form will show up, edit button will be disabled
        editButton.onclick = function() {
          display.showEditForm(controller.getCurrentUser());
        }
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
      if(document.getElementById("form") == null) {
        //create DOM elements for edit form
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
          }

        //create submit button that updates the info of the current User
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
          }

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
        //set default imputs as the current User's info
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

    //updates name of the User on the buttons
    updateButton: function(newUserID, newName) {
      document.getElementById(newUserID).textContent = newName;
    },

    //create the delete button
    showDeleteButton: function() {
      //create DOM elements
      if(document.getElementById("delete") == null) {
        var deleteDiv = document.createElement("div");
        deleteDiv.id = "delete";
        var deleteButton = document.createElement("button");
        deleteButton.append("Delete User");
        deleteButton.id = "deleteButton"
        deleteDiv.append(deleteButton);

        //when clicked, user will be deleted
        deleteButton.onclick = function() {
          var currentUserID = controller.getCurrentUser().idNo;
          controller.deleteUser(currentUserID);
          display.hideDeletedUser(currentUserID);
        }
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

  }

  //start everything!
  display.init();

})
