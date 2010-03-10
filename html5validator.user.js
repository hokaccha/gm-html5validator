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

var execute_validate = function() {
    GM_xmlhttpRequest({
        method: 'GET',
        url:    location.href,
        onload: on_load_self,
    });
};

var on_load_self = function(res) {
    var boundary = get_boundary();
    var post_data = get_post_data(boundary, {
        out: 'json',
        content: res.responseText,
    });
    var headers =  {
        'Content-type': 'multipart/form-data; boundary=' + boundary,
    };
    GM_xmlhttpRequest({
        method:  'POST',
        url:     validator_url,
        data:    post_data,
        headers: headers,
        onload:  on_load_validate,
    });
};

var on_load_validate = function(res) {
    var data = eval( '(' + res.responseText + ')' );
    if (data.messages.length) {
        console.log('invalid');
        console.log(data.messages);
    }
    else {
        console.log('valid');
    }
};

// get random boundary string
var get_boundary = function() {
    var n = 50;
    var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var s = '';
    c = c.split('');
    for (var i = 0; i < n; i++) {
        s += c[Math.floor(Math.random() * c.length)];
    }
    return s;
};

// get multipart/form-data post data
var get_post_data = function(boundary, data) {
    var lb = "\r\n"; // line_break
    var separator = '--' + boundary;
    var content = [];
    for (key in data) {
        content.push([
            'Content-Disposition: form-data; name="' + key + '"',
            '',
            data[key],
        ].join(lb));
    }
    return [
        separator,
        content.join(lb + separator + lb),
        separator + '--',
    ].join(lb);
};

execute_validate();
