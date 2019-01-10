
var tasks = [];



function initializenotes() {

    var backup = JSON.parse(localStorage.getItem("tasks"));
    if (backup.length > 0) {
        tasks = backup;
    }
    console.log(backup);
    console.log(tasks);
    document.getElementById("totalnotes").innerHTML = " " + tasks.length;
    for (var i = 0; i < backup.length; i++) {
        var container = document.getElementById("taskcontainer");
        var card = document.createElement("div");

        card.className = "taskcard";
        card.innerHTML = "<span class='taskstyle'>" + backup[i].task + "</span>" + "<span class='datestyle'>" + backup[i].date + "</span>" + "<span class='timestyle'>" + backup[i].time + "</span>" + "<i class='fas fa-times iconstyle' onclick='deletenote(" + backup[i].id + ',this' + ")'></i>" + "<i class='far fa-edit editstyle' onclick='editnote(this)'></i>";

        container.append(card);
    }
}
initializenotes();



function add() {
    var checkeditactive = document.getElementById("saveedit");
    if (checkeditactive !== null) {
        window.scroll(0, 0);
        document.getElementById("errormsg").innerHTML = "Save/cancel to exit edit mode";
    }
    else {
        var task = document.forms["inputform"]["task"].value;
        var date = document.forms["inputform"]["date"].value;
        var time = document.forms["inputform"]["time"].value;
        var id = Math.floor(Math.random() * 1000000);

        if (idvalidation(id) == true) {
            if (validation(task, date) == true) {
                tasks.push(createobj(task, date, time, id));
                localStorage.setItem("tasks", JSON.stringify(tasks));
                var taskindex = tasks.length - 1;

                var card = document.createElement("div");
                var container = document.getElementById("taskcontainer");

                card.className = "taskcard";
                card.innerHTML = "<span class='taskstyle'>" + tasks[taskindex].task + "</span>" + "<span class='datestyle'>" + tasks[taskindex].date + "</span>" + "<span class='timestyle'>" + tasks[taskindex].time + "</span>" + "<i class='fas fa-times iconstyle' onclick='deletenote(" + tasks[taskindex].id + ',this' + ")'></i>" + "<i class='far fa-edit editstyle' onclick='editnote(this)'></i>";

                container.append(card);
                document.getElementById("totalnotes").innerHTML = " " + tasks.length;
                document.getElementById("errormsg").innerHTML = "";
                document.forms["inputform"]["task"].value = "";
                document.forms["inputform"]["date"].value = "";
                document.forms["inputform"]["time"].value = "";
            }
        }
    }
}

function deletenote(id, icon) {
    var checkeditactive = document.getElementById("saveedit");
    if (checkeditactive !== null) {
        window.scroll(0, 0);
        document.getElementById("errormsg").innerHTML = "Save/cancel to exit edit mode";
    }
    else {
        icon.parentElement.remove();
        var taskindex = tasks.findIndex(function (tasks) {
            return tasks.id == id;
        })
        if (taskindex !== -1) {
            tasks.splice(taskindex, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            document.getElementById("totalnotes").innerHTML = " " + tasks.length;
        }
        else {
            console.log("didnt find id");
        }
    }
}

function clearform() {
    var checkeditactive = document.getElementById("saveedit");
    if (checkeditactive !== null) {
        window.scroll(0, 0);
        document.getElementById("errormsg").innerHTML = "Save/cancel to exit edit mode";
    }
    else {
        document.forms["inputform"]["task"].value = "";
        document.forms["inputform"]["date"].value = "";
        document.forms["inputform"]["time"].value = "";
    }
}

function clearallnotes() {
    var checkeditactive = document.getElementById("saveedit");
    if (checkeditactive !== null) {
        window.scroll(0, 0);
        document.getElementById("errormsg").innerHTML = "Save/cancel to exit edit mode";
    }
    else {
        if (confirm('Are you sure you want to clear all notes?')) {
            document.getElementById("taskcontainer").innerHTML = "";
            tasks.splice(0, tasks.length);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            document.getElementById("totalnotes").innerHTML = " " + tasks.length;
            document.forms["inputform"]["task"].value = "";
            document.forms["inputform"]["date"].value = "";
            document.forms["inputform"]["time"].value = "";
        }
    }
}

function editnote(icon) {
    document.getElementById("errormsg").innerHTML = "Edit mode";
    var checkeditactive = document.getElementById("saveedit");
    if (checkeditactive !== null) {
        window.scroll(0, 0);
        document.getElementById("errormsg").innerHTML = "Save/cancel to exit edit mode";
    }
    else {
        window.scroll(0, 0);

        document.forms["inputform"]["task"].value = icon.parentElement.children[0].innerHTML;
        document.forms["inputform"]["date"].value = icon.parentElement.children[1].innerHTML;
        document.forms["inputform"]["time"].value = icon.parentElement.children[2].innerHTML;


        var editbuttons = document.getElementById("editcontainer");
        var saveedit = document.createElement("button");

        saveedit.type = "button";
        saveedit.id = "saveedit";
        saveedit.className = "btn btn-success btn-lg mr-3";
        saveedit.innerHTML = "Save edit";
        saveedit.addEventListener('click', function () {
            savechanges(icon);
        });

        var canceledit = document.createElement("button");

        canceledit.type = "button";
        canceledit.id = "canceledit";
        canceledit.className = "btn btn-secondary btn-lg mr-3";
        canceledit.innerHTML = "Cancel edit";
        canceledit.addEventListener('click', function () {
            discardchanges(icon);
        });

        editbuttons.append(saveedit);
        editbuttons.append(canceledit);
    }

    function savechanges(icon) {
        var oldtask = icon.parentElement.children[0].innerHTML;
        // var olddate = icon.parentElement.children[1].innerHTML;
        // var oldtime = icon.parentElement.children[2].innerHTML;

        var editedtask = document.forms["inputform"]["task"].value;
        var editeddate = document.forms["inputform"]["date"].value;
        var editedtime = document.forms["inputform"]["time"].value;

        if (validation(editedtask, editeddate) == true) {
            icon.parentElement.children[0].innerHTML = editedtask;
            icon.parentElement.children[1].innerHTML = editeddate;
            icon.parentElement.children[2].innerHTML = editedtime;

            taskindex = tasks.findIndex(function (task) {
                return task.task == oldtask;

            });
            tasks[taskindex].task = editedtask;
            tasks[taskindex].date = editeddate;
            tasks[taskindex].time = editedtime;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            document.forms["inputform"]["task"].value = "";
            document.forms["inputform"]["date"].value = "";
            document.forms["inputform"]["time"].value = "";

            var editcontrols = document.getElementById("editcontainer");

            editcontrols.removeChild(editcontrols.children[1]);
            editcontrols.removeChild(editcontrols.children[0]);
            document.getElementById("errormsg").innerHTML = "";

        }
        else {
            document.getElementById("errormsg").innerHTML = "Task/Date can't be empty";
        }

    }

    function discardchanges(icon) {
        console.log("discard");
        document.forms["inputform"]["task"].value = "";
        document.forms["inputform"]["date"].value = "";
        document.forms["inputform"]["time"].value = "";
        document.getElementById("errormsg").innerHTML = "";

        var editcontrols = document.getElementById("editcontainer");

        editcontrols.removeChild(editcontrols.children[1]);
        editcontrols.removeChild(editcontrols.children[0]);
    }

}


function createobj(task, date, time, id) {
    var obj = {
        task: task,
        date: date,
        time: time,
        id: id
    }
    return obj;
}

function validation(task, date) {
    if (task == "") {
        document.getElementById("errormsg").innerHTML = "Task empty";
        return false;
    }
    else if (date == "") {
        document.getElementById("errormsg").innerHTML = "Date required";
        return false;
    }
    else {
        return true;
    }
}

function idvalidation(id) {
    if (tasks.length > 0) {
        for (var i = 0; i < tasks.length; i++) {
            if (id == tasks[i].id) {
                id = Math.floor(Math.random() * 1000000);
                tasks[i].id = id;
                idvalidation(tasks[i].id);
            }
            else {
                return true;
            }
        }
    }
    else {
        return true;
    }
}