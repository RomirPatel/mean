$(document).ready(function () {
    const apiUrl = 'http://localhost:3000/api/todos';
    const registerUrl = 'http://localhost:3000/api/todos/register';
    const loginUrl = 'http://localhost:3000/api/todos/login';
    let currentUserId = null;

    $('#login-form').submit(function (e) {
        e.preventDefault();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        $.ajax({
            type: 'POST',
            url: loginUrl,
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
        })
        .done(function (data) {
            currentUserId = data.userId;  // Ensure this is correctly set
            $('#login-section').hide();
            $('#todo-app').show();
            loadTodos();  // Load the user's todos after login
        })
        .fail(function (xhr) {
            alert(xhr.responseJSON ? xhr.responseJSON.message : "An error occurred");
        });
    });

    $('#register-form').submit(function (e) {
        e.preventDefault();
        const regUsername = $('#reg-username').val();
        const regPassword = $('#reg-password').val();

        console.log('Username:', regUsername); // Log the username
        console.log('Password:', regPassword); // Log the password

        // Send registration request
        $.post(registerUrl, { username: regUsername, password: regPassword })
        $.ajax({
            type: 'POST',
            url: registerUrl,
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify({ username: regUsername, password: regPassword }), // Stringify the data
        })
            .done(function (data) {
                alert(data.message); // Show success message
                $('#register-section').hide();
                $('#login-section').show(); // Show login section after registration
            })
            .fail(function (jqXHR) {
                console.log(jqXHR); // Log the entire response for debugging
                alert(jqXHR.responseJSON ? jqXHR.responseJSON.message : "An error occurred");
            });
    });



    // Load todos for the current user
    function loadTodos() {
        $.get(apiUrl + '?userId=' + currentUserId, function (todos) {
            $('#todo-list').empty();
            todos.forEach((todo, index) => {
                $('#todo-list').append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${todo.text}</td>
                        <td><input type="checkbox" ${todo.done ? 'checked' : ''} onclick="toggleTodo('${todo._id}', this.checked)" /></td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteTodo('${todo._id}')">Delete</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    $('#todo-form').submit(function (e) {
        e.preventDefault();
        const todoText = $('#todo-text').val();

        if (!todoText || !currentUserId) {
            alert("You must be logged in and provide a to-do text");
            return;
        }

        const newTodo = { text: todoText, done: false, userId: currentUserId };

        $.ajax({
            type: 'POST',
            url: apiUrl,
            contentType: 'application/json',
            data: JSON.stringify(newTodo),
            success: function () {
                $('#todo-text').val('');  // Clear the input
                loadTodos();  // Reload the todos after adding
            },
            error: function (xhr) {
                alert("Failed to add to-do");
                console.error(xhr.responseText);
            }
        });
    });


    // Toggle the done status of a todo
    window.toggleTodo = function (id, done) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'PUT',
            data: { done: done },
            success: function () {
                loadTodos();
            }
        });
    };

    // Delete a todo
    window.deleteTodo = function (id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            success: function () {
                loadTodos();
            }
        });
    };

    // Logout
    $('#logout-btn').click(function () {
        currentUserId = null;
        $('#login-section').show();
        $('#todo-app').hide();
    });

    // Toggle to registration
    $('#register-toggle').click(function () {
        $('#login-section').hide();
        $('#register-section').show();
    });

    // Toggle to login
    $('#login-toggle').click(function () {
        $('#register-section').hide();
        $('#login-section').show();
    });
});
