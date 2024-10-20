$(document).ready(function () {
    const apiUrl = 'http://localhost:3000/api/todos';
    const registerUrl = 'http://localhost:3000/api/todos/register';
    const loginUrl = 'http://localhost:3000/api/todos/login';
    let currentUserId = null;

    // Handle login
    $('#login-form').submit(function (e) {
        e.preventDefault();
        const username = $('#username').val().trim(); // Trim the username
        const password = $('#password').val().trim(); // Trim the password

        // Send login request
        $.ajax({
            type: 'POST',
            url: loginUrl,
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify({ username, password }), // Stringify the data
        })
        .done(function (data) {
            currentUserId = data.userId; // Store the user ID
            $('#login-section').hide();
            $('#todo-app').show();
            loadTodos();
        })
        .fail(function (xhr) {
            alert(xhr.responseJSON ? xhr.responseJSON.message : "An error occurred"); // Show the error message
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

    // Add a new todo
    $('#todo-form').submit(function (e) {
        e.preventDefault();
        const todoText = $('#todo-text').val();
        const newTodo = { text: todoText, done: false, user: currentUserId };

        $.post(apiUrl, newTodo, function () {
            $('#todo-text').val('');
            loadTodos();
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
