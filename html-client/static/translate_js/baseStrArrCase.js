class Main {

    tounicode(obj) {
        if (this.is_array(obj)) {
            obj = this.arraytounicode(obj)
        } else if (this.is_str(obj)) {
            obj = this.strtounicode(obj)
        }
        return obj
    }

    arraytounicode(arr) {
        for (let i = 0; i <= arr.length - 1; i++) {
            if (this.is_array(arr[i])) {
                arr[i] = this.arraytounicode(arr[i])
            } else if (this.is_str(arr[i])) {
                arr[i] = this.strtounicode(arr[i])
            }
        }
        return arr
    }

    strtounicode(str) {
        if (this.is_array(str)) {
            str = this.arraytounicode(str)
        } else if (this.is_str(str) && str.indexOf("\\") == -1) {
            const pattern = /[\da-fA-F]{4}/g;
            const hasUnicode = pattern.test(str);
            if (hasUnicode) {
                str = this.plainstrtounicode(str)
            }
        }
        return str
    }

    plainstrtounicode(inputString) {
        if (inputString.indexOf("\\") != -1) {
            return inputString
        }
        const isUnicode = /^[a-zA-Z0-9]{4}$/i;
        let outputString = "";
        let i = 0;
        while (i < inputString.length) {
            const unicodeStr = inputString.substr(i + 1, 4);
            if (inputString[i] == "u" && isUnicode.test(unicodeStr)) {
                const unicodeCode = parseInt(unicodeStr, 16);
                outputString += String.fromCharCode(unicodeCode);
                i += 5;
            } else {
                outputString += inputString[i];
                i += 1;
            }
        }
        return outputString;
    }


    wait(m = 1000, callback = null) {
        if (!callback) return
        if (typeof callback == "number") {
            let temp_m = callback
            callback = m
            m = temp_m
        }
        setTimeout(() => {
            if (callback) callback()
        }, m)
    }

    is2DArray(arr) {
        // 检查数组是否是一个数组
        if (!Array.isArray(arr)) {
            return false;
        }

        // 检查数组中的每个元素是否也是一个数组
        for (let i = 0; i < arr.length; i++) {
            if (!Array.isArray(arr[i])) {
                return false;
            }
        }

        // 如果所有元素都是数组，则这是一个二维数组
        return true;
    }

    take_the_value(vala, valb) {
        if (vala) {
            return vala;
        } else {
            return valb;
        }
    }


    simplify_array(data) {
        if (data.data) {
            data = data.data
            if (this.is_array(data)) {
                if (this.is2DArray(data)) {
                    return data
                }
                data = data[0]
            }
        }
        return data
    }

    keys(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return []
        }
        const keys = [];
        for (const key in obj) {
            keys.push(key);
        }
        return keys;
    }

    keys_len(obj) {
        return this.keys(obj).length
    }

    is_array(a) {
        if (typeof a === 'object' && Array.isArray(a)) {
            return true
        }
    }

    is_obj(a) {
        if (typeof a === 'object' && !Array.isArray(a)) {
            return true
        }
    }

    is_str(a) {
        if (typeof a === 'string') {
            return true
        }
    }

    uncompress(a) {
        if (this.is_str(a)) {
            a = this.uncompress_string(a)
        } else if (this.is_array(a)) {
            a = this.uncompress_array(a)
        } else if (this.is_obj(a)) {
            a = this.uncompress_obj(a)
        }
        return a
    }
    uncompress_array(l) {
        for (var i = 0; i < l.length; i++) {
            let item = l[i]
            if (this.is_str(item)) {
                l[i] = this.uncompress_string(item)
            } else if (this.is_array(item)) {
                l[i] = this.uncompress_array(item)
            } else if (this.is_obj(item)) {
                l[i] = this.uncompress_obj(item)
            }
        }
        return l
    }

    uncompress_obj(l) {
        for (var i in l) {
            let item = l[i]
            if (this.is_str(item)) {
                l[i] = this.uncompress_string(item)
            } else if (this.is_array(item)) {
                l[i] = this.uncompress_array(item)
            } else if (this.is_obj(item)) {
                l[i] = this.uncompress_obj(item)
            }
        }
        return l
    }

    is_base64head(base64str) {
        if (typeof base64str == 'string' && base64str.startsWith('base64:')) {
            return true
        }
        return false
    }

    get_base64string(base64str) {
        base64str = base64str.replace(/^base64:/, '')
        return base64str
    }

    uncompress_base64str(base64str, unverify = false) {
        base64str = this.get_base64string(base64str)
        var bytes = atob(base64str);
        var byteNumbers = new Array(bytes.length);
        for (var i = 0; i < bytes.length; i++) {
            {
                byteNumbers[i] = bytes.charCodeAt(i);
            }
        }
        base64str = new Uint8Array(byteNumbers);
        return base64str
    }

    uncompress_string(base64str, unverify = false) {
        if (unverify || this.is_base64head(base64str)) {
            base64str = this.get_base64string(base64str)
            base64str = this.uncompress_base64str(base64str, true)
            base64str = pako.inflate(base64str, { to: 'string' })
        }
        return base64str
    }


    replaceValue(arr, key, value) {
        // 遍历数组中的每一个元素
        for (let i = 0; i < arr.length; i++) {
            // 将元素按照“|”进行分割
            const [k, v] = arr[i].split("|");
            // 判断当前元素的key是否等于要替换的key
            if (k === key) {
                // 如果是，则替换该元素的value为新的value，并保留原来的key
                arr[i] = `${key}|${value}`;
                // 替换完成后，直接返回结果
                return arr;
            }
        }
        // 如果遍历完整个数组都没有找到要替换的key，则直接将新的key和value添加到数组中
        arr.push(`${key}|${value}`);
        return arr;
    }

    find_list_from_obj(ids, obj) {
        let objs = obj.filter((obj) => ids.includes(obj.id)); // 查找数据B中的对象集
        return objs
    }

    find_middle_values(arr, value, n) {
        let startIndex = arr.indexOf(value);
        if (startIndex === -1) {
            return []; // 如果数组中不存在该值，返回 null
        }
        n = parseInt(n)
        startIndex = startIndex + 1
        let find_end = startIndex + n
        let endIndex = (find_end) % arr.length; // 取模操作以支持循环查找
        if (startIndex < endIndex) {
            return arr.slice(startIndex, endIndex);
        } else if (startIndex > endIndex) {
            return [...arr.slice(startIndex + 1), ...arr.slice(0, endIndex)];
        } else {
            return [];
        }
    }

    csort() {
        // Given time in milliseconds
        const givenTime = 1676577188674;

        // Example array
        const array = [
            { 'Alice': { time: 1676577188674, price: 86 }, 'Bob': { time: 1676577188674, price: 86 } },
            { 'Alice': { time: 1676577198674, price: 88 }, 'Bob': { time: 1676577198674, price: 88 } },
            { 'Alice': { time: 1676577208674, price: 90 }, 'Bob': { time: 1676577208674, price: 90 } }
        ];

        // Find the first array that has a time earlier than xx seconds ago
        const xxSecondsAgo = Date.now() - (xx * 1000);
        const firstArray = array.find(item => item['Alice'].time < xxSecondsAgo);

        console.log(firstArray);

    }

    obj_tolistandsort(obj) {
        obj = this.obj_tolist(obj)
        obj = this.list_sortbytime(obj)
        return obj
    }

    obj_tolist(obj) {
        var newArray = [];
        for (var key in obj) {
            let val = obj[key]
            newArray.push({
                id: key,
                read_time: val,
            });
        }
        return newArray
    }

    trim(str, char, type) {
        if (char) {
            if (type == 'left') {
                return str.replace(new RegExp('^\s*\\' + char + '+', 'g'), '');
            } else if (type == 'right') {
                return str.replace(new RegExp('\\' + char + '+\s*$', 'g'), '');
            }
            return str.replace(new RegExp('^\s*\\' + char + '+|\\' + char + '+\s*$', 'g'), '');
        }
        return str.replace(/^\s+|\s+$/g, '');
    };

    toJSON(obj) {
        if (typeof obj === 'string') {
            obj = this.uncompress_string(obj)
            if (this.is_json_str(obj)) {
                try {
                    obj = JSON.parse(obj);
                } catch (e) {
                    return obj;
                }
            } else {
                return obj;
            }
        }
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                obj[key] = this.toJSON(obj[key]);
            }
        } else {
            return obj
        }
        return obj;
    }

    is_json_str(str) {
        let is_json_reg = /^\s*[\{\[]/
        if (is_json_reg.test(str)) {
            return true
        }
        return false
    }
    create_id(word) { if ($ && $.md5 && word) { word = word.toString(); word = $.md5(word); word = `id${word}` } return word }
    unescape(str) { return str }
    list_sortbytime(arr) {
        arr.sort((a, b) => {
            let timeA = a[1] ? a[1] : '1970-01-01'
            let timeB = b[1] ? b[1] : '1970-01-01'
            timeA = Date.parse(timeA);
            timeB = Date.parse(timeB);
            return timeA - timeB;
        });
        return arr
    }

    create_random_number(max = 10000) {
        const randomInt = Math.floor(Math.random() * max);
        return randomInt
    }

    array_remove(array, val) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                array.splice(i, 1);
                i--
            }
        }
        return array
    }


    gen_randomstring(len = 32) {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
        var result = '';
        for (var i = len; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)]
        }
        return result
    }
    get_array_value(array, index) {
        if (array.length >= index + 1) {
            return array[index]
        }
        return null
    }
    timestamp_todate(time, format = 'Y-M-D h:m:s') {
        let date;
        if (typeof time == 'object') {
            date = time
        } else {
            if (this.numeric(time)) {
                time = parseInt(time);
                if (`$ {
                    time
                }`.length < 11) {
                    time = time * 1000
                }
            }
            date = new Date(time)
        }
        let Y = date.getFullYear();
        let M = this.fill_alphabet(date.getMonth() + 1, 2, '0');
        let D = this.fill_alphabet(date.getDate(), 2, '0');
        let h = this.fill_alphabet(date.getHours(), 2, '0');
        let m = this.fill_alphabet(date.getMinutes(), 2, '0');
        let s = this.fill_alphabet(date.getSeconds(), 2, '0');
        format = format.replace('Y', Y);
        format = format.replace('M', M);
        format = format.replace('D', D);
        format = format.replace('h', h);
        format = format.replace('m', m);
        format = format.replace('s', s);
        return format
    }
    date_totimestamp(time) {
        if (!time) {
            time = new Date()
        } else if (typeof time == 'string' || typeof time == 'number') {
            time = new Date(time)
        }
        let timesdamp = Date.parse(time);
        return timesdamp
    }
    numeric(n) {
        let numbric = /^\d+$/;
        if (numbric.test(n)) {
            return true
        }
        return false
    }
    fill_alphabet(s, l, fill_s = "0") {
        s = s + "";
        s = s.padStart(l, fill_s);
        return s
    }
    create_time(format, index = 0) {
        let dateTime = new Date();
        if (typeof format === 'string') {
            let date_format = format.split(' ');
            date_format = date_format[0];
            date_format = date_format.split('-');
            let year = date_format[0];
            let month = date_format[1];
            let day = date_format[2];
            let is_int = /^\d+$/;
            if (is_int.test(year) && is_int.test(month) && is_int.test(day)) {
                year = parseInt(year);
                month = parseInt(month);
                day = parseInt(day);
                dateTime.setFullYear(year, month, day);
                if (date_format.length > 1) {
                    format = `yyyy-MM-dd hh:mm:ss`
                } else {
                    format = `yyyy-MM-dd`
                }
            }
        } else {
            format = `yyyy-MM-dd hh:mm:ss`
        }
        var z = {
            y: dateTime.getFullYear(),
            M: dateTime.getMonth() + 1,
            d: dateTime.getDate() + index,
            h: dateTime.getHours(),
            m: dateTime.getMinutes(),
            s: dateTime.getSeconds()
        };
        return format.replace(/(y+|M+|d+|h+|m+|s+)/g,
            function (v) {
                return ((v.length > 1 ? "0" : "") + eval("z." + v.slice(- 1))).slice(- (v.length > 2 ? v.length : 2))
            })
    }
    create_timestamp(){
        return Math.floor(Date.now() / 1000);
    }

    is_number(s) {
        if (typeof s === "number" || typeof s === "float") {
            return true;
        }
        if (typeof s !== "string") {
            return false;
        }
        s = s.trim();
        if (/^\d+$/.test(s)) {
            return true;
        }
        return false;
    }

    array_toint(arr) {
        return arr.map(function (element) {
            return parseInt(element);
        });
    }


    split_array_half(arr) {
        var midIndex = Math.floor(arr.length / 2);
        var firstHalf = arr.slice(0, midIndex);
        var secondHalf = arr.slice(midIndex);
        return [firstHalf, secondHalf];
    }

}

export default new Main()