//本类不导入其他类
const base_remote_url = window.location.origin
class Main {
    com_module = 'com_dictionary'
    qurest_key = `9LrQN0~14,dSmoO^`
    base_remote_url = ""
    remote_resourceurl(suffix) {
        return `${this.get_remove_url()}/static/${suffix}`;
    }

    get_methodname(methodstr) {
        const hasColon = methodstr.includes(":");
        let module, method;

        if (hasColon) {
            const splitArray = method.split(":");
            module = splitArray[0];
            method = splitArray[1];
        } else {
            module = this.com_module
            method = methodstr
        }
        return {
            module,
            method
        }
    }

    get_api_url() {
        let url = `${this.get_remove_url()}/api`;
        return url;
    }

    get_remove_url() {
        if (typeof base_remote_url == 'string') {
            this.base_remote_url = base_remote_url;
        }
        if (!this.base_remote_url) {
            this.base_remote_url = window.location.origin;
        }
        this.base_remote_url = this.base_remote_url.replace(/\/+$/, '');
        return this.base_remote_url;
    }

    parse_data(method,data){
        if (!data) {
            data = {}
        }
        let methodname = this.get_methodname(method)
        data["method"] = methodname.method
        data["module"] = methodname.module
        data["key"] = this.qurest_key
        return data
    }

    async get(method, data) {
        data = this.parse_data(method,data)
        let url = this.get_api_url();

        const params = new URLSearchParams(data).toString();
        url += '?' + params;

        const response = await fetch(url, { mode: 'cors' });
        data = await response.json();
        return this.toJSON(data);
    }

    async post(method, data) {
        data = this.parse_data(method,data)
        let url = this.get_api_url();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        });

        const responseData = await response.json();
        return this.toJSON(responseData);
    }

    uploadImage() {
        // 选择图片
        var image = document.getElementById("your-image");

        // 读取图片文件
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        var dataURL = canvas.toDataURL("image/png");

        // 将图片文件转换为二进制代码
        var binary = atob(dataURL.split(",")[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], { type: "image/png" });

        // 上传二进制代码
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://your-remote-url.com/upload");
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(blob);
    }

    get_imagetobinary(image_url) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', image_url, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            if (this.status == 200) {
                var arrayBufferView = new Uint8Array(this.response);
                var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
                var binaryData = new Uint8Array(blob);
            }
        };

        xhr.send();
    }

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

}


export default new Main()