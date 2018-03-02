/*global WildRydes _config*/

var userSignIn = window.UserSignIn || {};

(function rideScopeWrapper($) {
    //Check the login of the user
    //check_user_login();

    $(function onDocReady() {
        $('#playerOfTheWeekForm').submit(handlePlayerSubmit);
    });

    function handlePlayerSubmit()
    {
        //Check if there is one selected.
        var checkbox_length = $('.player:checkbox:checked').length;
        console.log(checkbox_length);
        if(checkbox_length > 0 && checkbox_length < 4) {
            var boxes = $('.player:checkbox:checked');
            boxes.each(function () {
                console.log($(this).val())
            });

            var data ={};
            var url = "";
            $.post(url, data, function(){
                console.log("Succeed")
            }).done(function(){
                console.log("Done")
            }).fail(function(){
                console.log("fail")
            })

        } else
        {
            console.log("checkbox is zero or more then 4 :", checkbox_length)
        }
    }

    function check_user_login(){
        if (typeof userSignIn.authToken === 'undefined')
            window.location.href = 'signin.html';

        var authToken;
        userSignIn.authToken.then(function setAuthToken(token) {
            if (token) {
                authToken = token;
            } else {
                window.location.href = 'signin.html';
            }
        }).catch(function handleTokenError(error) {
            alert(error);
            window.location.href = 'signin.html';
        });
    }
}(jQuery));
