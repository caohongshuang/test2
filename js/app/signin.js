(function (global) {
    'user strict';
    if (global.dmlite) {
        var form = $('#form-signin');
        //hook submit
        form.on('submit', function (e) {
            if ($('#save-password').prop('checked')) {
                var username = $('#inputUsername').val();
                var password = $('#inputPassword').val();
                if (username && password) {
                    global.localStorage.setItem("username", username);
                    global.localStorage.setItem("password", password);
                }
            }
        });

        var url = global.location.href;
        if (!url) {
            return;
        }
        if (url.endsWith('?error')) {
            var username = global.localStorage.getItem("username");
            if (username) {
                $('#inputUsername').val(username);
            }
        }
        //auto login
        else if (!url.endsWith('?logout')) {
            var username = global.localStorage.getItem("username");
            var password = global.localStorage.getItem("password");
            if (username && password) {
                $('#inputUsername').val(username);
                $('#inputPassword').val(password);
                // form.submit();
            }
        }
    }
})(window);


