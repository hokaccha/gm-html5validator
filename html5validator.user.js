// ==UserScript==
// @name           html5validator
// @namespace      http://webtech-walker.com/gm/html5validator
// @description    Auto validate HTML5, using Validator.nu
// @include        http://localhost/
// ==/UserScript==
//
// Auther:  Kazuhito Hokamura
// Version: 0.0.1

var HTML5Vlidator = {
    validator_url: 'http://html5.validator.nu/',
    icon_img: null,
    init: function() {
        var self = this;

        self.icon_img = document.createElement('img');
        self.icon_img.style.position = 'fixed';
        self.icon_img.style.bottom = '10px';
        self.icon_img.style.left = '10px';
        self.icon_img.src = self.images.loading;
        document.body.appendChild(self.icon_img);

        GM_xmlhttpRequest({
            method: 'GET',
            url:    location.href,
            onload: self.on_load_self,
        });
    },
    on_load_self: function(res) {
        var self = HTML5Vlidator;

        var boundary = self._get_boundary();
        var post_data = self._get_post_data(boundary, {
            out:     'json',
            content: res.responseText,
        });
        var headers =  {
            'Content-type': 'multipart/form-data; boundary=' + boundary,
        };
        GM_xmlhttpRequest({
            method:  'POST',
            url:     self.validator_url,
            data:    post_data,
            headers: headers,
            onload:  self.on_load_validate,
        });
    },
    on_load_validate: function(res) {
        var self = HTML5Vlidator;

        var data = eval( '(' + res.responseText + ')' );
        if (data.messages.length) {
            self.icon_img.src = self.images.error;
            console.log(data.messages);
        }
        else {
            self.icon_img.src = self.images.valid;
            document.body.appendChild(self.icon_img);
        }
    },
    _get_boundary: function() {
        var n = 30;
        var c = '0123456789';
        var s = '';
        c = c.split('');
        for (var i = 0; i < n; i++) {
            s += c[Math.floor(Math.random() * c.length)];
        }
        return '---------------------------'+s;
    },
    _get_post_data: function(boundary, data) {
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
    },
    images: {
        valid:   'data:image/png;base64, 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',
        invalid: 'data:image/png;base64, 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',
        loading: 'data:image/gif;base64, R0lGODlhEAAQAPQAAP///wAAAPj4+Dg4OISEhAYGBiYmJtbW1qioqBYWFnZ2dmZmZuTk5JiYmMbGxkhISFZWVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==',
    },
};

HTML5Vlidator.init();
