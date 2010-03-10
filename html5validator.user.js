// ==UserScript==
// @name           html5validator
// @namespace      http://webtech-walker.com/gm/html5validator
// @description    Auto validate HTML5, using Validator.nu
// @include        http://localhost:5000/
// ==/UserScript==
//
// Auther:  Kazuhito Hokamura
// Version: 0.0.1

var validator_url = 'http://html5.validator.nu/';
var boundary = (function() {
    var n = 50;
    var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    c = c.split('');
    var s = '';
    for (var i = 0; i < n; i++) {
        s += a[Math.floor(Math.random() * a.length)];
    }
    return s;
})();

var get_post_data = function(html) {
    var line_break = "\r\n";
    var get_content = function(key, val) {
        return [
            'Content-Disposition: form-data; name="' + key + '"',
            '',
            val
        ].join(line_break);
    };
    var data = [
        '--' + boundary,
        get_content('out', 'json'),
        '--' + boundary,
        get_content('content', html),
        '--' + boundary + '--'
    ].join(line_break);
};

var execute_validate = function() {
    GM_xmlhttpRequest({
        method: 'GET',
        url:    location.href,
        onload: function(res) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: validator_url,
                data: get_post_data(res.responseText),
                headers: {
                    'Content-type': 'multipart/form-data; boundary=' + boundary,
                },
                onload: function(r) {
                    var data = eval('(' + r.responseText + ')');
                    if (data.messages.length) {
                        console.log('invalid');
                        console.log(data.messages);
                    }
                    else {
                        console.log('valid');
                    }
                }
            });
        },
    });
};

execute_validate();
