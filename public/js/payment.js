/**
 * Created by sonu on 11/7/17.
 */
$(function () {
    var cc = $("input[name=cc]");
    var month = $("input[name=month]");
    var year = $("input[name=year]");
    var cvv = $("input[name=cvv]");
    var email = $("input[name=email]");
    var dni = $("input[name=dni]");
    $('button[type="submit"]').click(function (e) {
        e.preventDefault();
        //little validation just to check username
        if (cc.val() != "" && month.val() != "" && year.val() != "" && cvv.val() != "" && email.val() != "" && dni.val() != "" ) {
            const data = JSON.stringify({
                "card_number": cc.val(),
                "cvv": cvv.val(),
                "expiration_month": month.val(),
                "expiration_year": year.val(),
                "email": email.val(),
                "metadata": {
                  "dni": dni.val()
                }
              });
              
              const xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              
              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                  console.log(this.responseText);
                }
              });
              
              xhr.open("POST", "https://secure.culqi.com/v2/tokens");
              xhr.setRequestHeader("Authorization", "Bearer pk_test_27f4fbc0ddc64976");
              xhr.setRequestHeader("content-type", "application/json");
              
              xhr.send(data);
        } else {
            //remove success mesage replaced with error message
            alert("Please enter all information")
        }

    });
});
