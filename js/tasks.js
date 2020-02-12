window.ToDoList = {

    API_BASE_URL: "http://localhost:8081/tasks",

    getTasks: function () {
        $.ajax({
            url: ToDoList.API_BASE_URL,
            method: "GET"
        }).done(function (response){
            console.log(response);

            ToDoList.displayTasks(JSON.parse(response))
            })

    },
    deleteTask: function (id) {
        $.ajax({
            url: ToDoList.API_BASE_URL + "?id" + id,
            method: "DELETE"
        }).done(function (){
             ToDoList.getTasks();
        })

    },

    createTask:function() {
        let descriptionValue = $("#description-field").val();
        let deadlineValue = $("#deadline-field").val();

        let requestBody = {
            description: descriptionValue,
            deadline: deadlineValue
        };

        $.ajax({
            url: ToDoList.API_BASE_URL,
            method: "POST",
            // also known as MIME type
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            ToDoList.getTasks();
        })

    },
    updateTask: function(id, done) {
        let requestBody= {
            done: done
        };

        $.ajax( {
            url: ToDoList.API_BASE_URL + "?id=" + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function (){

        }



)},


    getTaskRow: function (task) {
        // spread operator (...)
        let formattedDeadline =
            new Date(...task.deadline).toLocaleDateString ("ro");

        let checkedAttribute = task.done ? " checked" : "";

        //same resoult as with the ternart operator above
        //if (tasks.done) {
        // chackedAttribute = "cheched"
        // } else {
        // checkedAttribute = "";

        return `<tr>
            <td>${task.description}</td>
            <td>${formattedDeadline}</td>
            <td><input type="checkbox" data-id=${task.description} class="mark-done" ${checkedAttribute}/></td>
            <td><a href="#" data-id=${task.description} class="delete-task"><i class="fas fa-trash-alt"></i></a> </td>
        </tr>

        <tr>`

    },

    displayTasks: function (tasks) {
        // week-typed (javascript) vs strong-typed (java)
        var tableBody = '';

        tasks.forEach(task => tableBody +=ToDoList.getTaskRow(task));

        $("#tasks-table tbody").html(tableBody);
    },

    bindEvents: function () {
        // capturing the 'submit from' event to bind our function to it
        $("#new-task-form").submit(function (event) {
            event.preventDefault();

            ToDoList.createTask();
        });

        // delegate is necessary here because  the element .mark-done
        // is not present in the page from the beginning, but injected later on
        $("#tasks-table").delegate(".mark-done", "change", function (event) {

            event.preventDefault();

            let taskID = $(this).data("id");
            let checked = $(this).is(":checked" );
            
            ToDoList.updateTask(taskID, checked)


        });
        $("#tasks-table").delegate(".delete-task", "click", function (event) {
            event.preventDefault();
            let taskID = $(this).data("id");

            ToDoList.deleteTask(taskID);
        });
    }

};

ToDoList.getTasks();
ToDoList.bindEvents();