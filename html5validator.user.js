// ==UserScript==
// @name           html5validator
// @namespace      http://webtech-walker.com/gm/html5validator
// @description    Auto validate HTML5, using Validator.nu
// @include        http://localhost:5000/
// ==/UserScript==
//
// Auther:  Kazuhito Hokamura
// Version: 0.0.1
//

GM_xmlhttpRequest({
    method: 'GET',
    url:    location.href,
    onload: function(res) {
        var lb = "\r\n";
        var boundary = '---------------------------separator';
        var ct = function(c) { return 'Content-Disposition: form-data; name="'+c+'"' };
        var data = '--' + boundary + lb + ct('out') + lb + lb + 'json' + lb + '--' + boundary + lb + ct('content') + lb + lb + res.responseText + lb + '--' + boundary + '--';
        var url = 'http://html5.validator.nu/';
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: data,
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
