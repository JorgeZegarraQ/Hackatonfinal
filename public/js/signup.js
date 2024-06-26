
$(function () {
    var textfield = $("input[name=user]");
    var passwordfield = $("input[name=password]");
    $('button[type="submit"]').click(function (e) {
        e.preventDefault();
        //little validation just to check username
        if (textfield.val() != "" && passwordfield.val() != "" ) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/signup")
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
            const body = JSON.stringify({
                "user": textfield.val(),
                "password": passwordfield.val()
            })
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText)
                    console.log(JSON.parse(xhr.responseText));
                    if(response.success){
                        alert(response.message)
                        sessionStorage.setItem("user", JSON.stringify(response.user));
                        window.location.replace("index.html")
                    }
                    else{
                        alert(response.message)
                    }
                } else {
                    console.log(JSON.stringify(xhr.status));
                }
            };
            xhr.send(body);
        } else {
            //remove success mesage replaced with error message
            alert("Please enter a username and password")
        }

    });
});
