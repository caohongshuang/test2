(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        $.post(
            this.action,
            $(this).serialize(),
            function (data) {
                if (data.code !== 0) {
                    $(".help-block").text("");
                    for (var property in data.data) {
                        if (data.data.hasOwnProperty(property)) {
                            $('#alert-' + property).text(data.data[property]);
                        }
                    }
                }
                else {
                    location.href = location.origin + location.pathname + '/success';
                }
            });
    });
})();