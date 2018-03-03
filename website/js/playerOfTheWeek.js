/*global WildRydes _config*/

var userSignIn = window.UserSignIn || {};

(function rideScopeWrapper($) {
    //Check the login of the user
    //check_user_login();

    $(function onDocReady() {
        console.log('print hier!');
        $('#playerOfTheWeekForm').submit(handlePlayerSubmit);
    });


    function check_players(dict_){
        var list_ = ["player1","player2","player3"]
        for (var value in list_) {

            if (!(list_[value] in dict_))
                dict_[list_[value]] = "not-filled"
        }
        return dict_
    }


    function handlePlayerSubmit(event)
    {
        //Check if there is one selected.
        var checkbox_length = $('.player:checkbox:checked').length;
        event.preventDefault();

        if(checkbox_length > 0 && checkbox_length < 4) {

            var dict = {};
            if (typeof cognitoUser === 'undefined')
                window.global_email = "unknown";

            dict["userId"] = window.global_email;
            var counter = 1;
            $('.player:checkbox:checked').each(function () {
                 dict["player"+counter] = $($(this).prop("labels")).text();
                 counter = counter + 1
            });
            dict = check_players(dict);
            var url = _config.api.invokeUrl+"/ApiToDynamoDB";
            console.log(url);
            $.post(url, JSON.stringify(dict), function(){
                console.log("Succeed")
            }).done(function(){
                alert("Met success gestemt");
                console.log("Done")
            }).fail(function(xhr, status, error){
                alert("Het stemmen is mislukt. Probeer het nog eens.")
            })
        }
        else
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

