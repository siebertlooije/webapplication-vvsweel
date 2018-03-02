/*global WildRydes _config*/

var userSignIn = window.UserSignIn || {};

(function rideScopeWrapper() {

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
}(jQuery));
