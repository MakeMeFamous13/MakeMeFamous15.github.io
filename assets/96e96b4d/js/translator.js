/**
 * Translator
 *
 * t\ranslator.t("Edit {0} domain", {'0': '1'})
 *
 * Plural text
 * t\ranslator.t('{n} {n, plural, =1{year} =few{years} =other{years}}', {n: years})
 *
 * @type {{t: translator.t}}
 */
var translator = {
    t: function (v, params) {
        var result = v;
        if (typeof translations != "undefined") {
            if (typeof currentLanguage != 'undefined' && translations.hasOwnProperty(currentLanguage)) {
                if (translations[currentLanguage].hasOwnProperty(v) && translations[currentLanguage][v] != null) {
                    result = translations[currentLanguage][v];
                }
            }
        }
        if (typeof params != "undefined") {
            var regularExp = /{\s*([\d\w]+)\s*,\s*plural\s*,(\s*=?(\d+|zero|one|two|few|many|other)+\{([^}]+)}+)+/gi;
            var res  = '';
            if (regularExp.test(result)) {
                var paramRegEx = /{\s*([\d\w]+)\s*,/;
                var param = paramRegEx.exec(result);
                if (param != null && typeof param[1] != 'undefined') {
                    var plurals = {};
                    var reg = /=?(\d+|zero|one|two|few|many|other)+\{([^}]+)}/gi;
                    var matches = result.match(reg);
                    for (var i in matches) {
                        if (matches[i].match(reg)) {
                            var arr = reg.exec(matches[i]);
                            if (arr != null && typeof arr[1] != 'undefined') {
                                plurals[arr[1]] = arr[2];
                            }
                        }
                    }

                    for (var key in params) {
                        if (param[1] != key) {
                            continue;
                        }

                        switch (params[key]) {
                            case 0:
                                if (plurals.hasOwnProperty(0)) {
                                    res = plurals[0];
                                    break;
                                }
                            case 1:
                                if (plurals.hasOwnProperty(1)) {
                                    res = plurals[1];
                                    break;
                                }
                            case 2:
                            case 3:
                            case 4:
                                if (plurals.hasOwnProperty('few')) {
                                    res = plurals.few;
                                    break;
                                }
                            default:
                                if (plurals.hasOwnProperty('other')) {
                                    res = plurals.other;
                                    break;
                                }
                        }
                    }

                    result = result.replace(regularExp, res);
                }
            }

            for (var key in params) {
                var expr = new RegExp("\\{" + key + "\\}", "i");
                result = result.replace(expr, params[key]);
            }
        }

        return result;
    }
};