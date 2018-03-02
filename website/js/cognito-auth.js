var UserSignIn = window.UserSignIn || {};

(function scopeWrapper($) {
    var signinUrl = '/signin.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    UserSignIn.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    UserSignIn.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    /*
     * Cognito User Pool functions
     */

    function register(phonenumber, password, onSuccess, onFailure) {
        var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'phone_number',
            Value: phonenumber
        });

        userPool.signUp(phonenumber, password, [attributePhoneNumber], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function signin(phonenumber, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: phonenumber,
            Password: password
        });

        var cognitoUser = createCognitoUser(phonenumber);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }



    function verify(phonenumber, code, onSuccess, onFailure) {
        createCognitoUser(phonenumber).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(phonenumber) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: phonenumber,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
        $('#ResetPasswordForm').submit(handleResetPassword);
    });

    function handleSignin(event) {
        var phone = $('#phoneInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(phone, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
                //Maybe change this location later
                window.location.href = 'index.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function handleResetPassword(event) {
        var phonenumber = $('#phoneInputReset').val();
        console.log(phonenumber)
        event.preventDefault();

        var cognitoUser = createCognitoUser(phonenumber);

        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log('call result: ' + result);
            },
            onFailure: function (err) {
                alert(err);
            },
            inputVerificationCode() {
                var verificationCode = prompt('Verificatie code', '');
                var newPassword = prompt('Enter nieuwe wachtwoord ', '');
                cognitoUser.confirmPassword(verificationCode, newPassword, this);
            }
        });
    }
    function handleRegister(event) {
        var phonenumber = $('#phoneInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess() {
            var confirmation = ('Registration successful. Please check your phone for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(phonenumber, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerify(event) {
        var phonenumber = $('#phoneInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(phonenumber, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the login page.');
               // Maybe change this one!
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }
}(jQuery));
