
//本类不导入其他类
const base_remote_url = window.location.origin
class Main {
    apiUrl = `https://api.local.12gm.com:888/graphql`
    com_module = 'com_dictionary'
    qurest_key = `9LrQN0~14,dSmoO^`
    base_remote_url = ""
    remote_resourceurl(suffix) {
        return `${this.get_remove_url()}/static/${suffix}`;
    }

    async sendGraphQLNotAuto(query, variables = {}) {
        let data = this.sendGraphQLAuth(query, variables, false);
        return data;
    }

    async sendGraphQLAuth(query, variables = {}, auth = true) {
        const body = {
            query,
            variables,
        };
        let header = {
            'Content-Type': 'application/json'
        }
        if (auth) {
            let jwt = this.useJWT()
            header['Authorization'] = `Bearer ${jwt}`
        }
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('error', response.statusText);
            return {};
        }
        let data = await response.json();
        return data;
    }

    async getGroups(pageSize = 20) {
        const query = `
        query{
          dictiongroups(
            pagination: {
              pageSize: ${pageSize}
            }
          )
          {
            data{
              id
              attributes{
                name
                namespace
                wlink
                publishedAt
                wcount
              }
            }
          }
        } 
        `;
        let data = await this.sendGraphQLAuth(query);
        return data;
    }


    async fetchDictionGroupMapsByUid(uid) {
        const query = `
            query GetDictionGroupMapsByUid($uid: Int!) {
                dictiongroupmaps(
                    filters: { uid: { eq: $uid } },
                    publicationState: LIVE
                ) {
                    data {
                        id
                        uid
                        gid
                        group_map
                        createdAt
                        updatedAt
                        publishedAt
                    }
                }
            }
        `;
        const variables = {
            uid
        };
        const data = await this.sendGraphQLAuth(query, variables);
        return data;
    }

    async fetchDictionariesByIds(ids) {
        const data = await this.fetchDictionaries(ids, 'id', true);
        return data;
    }

    async fetchDictionariesByWords(words) {
        const data = await this.fetchDictionaries(words, 'word', true);
        return data;
    }

    async fetchDictionaries(input, mode = 'word', valid = true) {
        valid = valid ? `{ is_delete: { eq: false } },` : ``;
        let filterCondition, inputType;
        switch (mode) {
            case 'word':
                inputType = `String`
                filterCondition = `{ word: { in: $input } }`;
                break;
            case 'id':
                inputType = `ID`
                filterCondition = `{ id: { in: $input } }`;
                break;
            default:
                console.error('Invalid mode. Use either "word" or "id"');
        }
        const query = `
            query GetDictionaries($input: [${inputType}!], $pagination: PaginationArg) {
                dictionaries(
                    filters: {
                        and: [
                            ${valid}
                            ${filterCondition}
                        ]
                    },
                    pagination: $pagination
                ) {
                    data {
                        id
                        attributes {
                            word
                            is_delete
                            word_sort
                            phonetic_us
                            phonetic_us_sort
                            phonetic_us_length
                            phonetic_uk
                            phonetic_uk_sort
                            phonetic_uk_length
                            word_length
                            translation
                        }
                    }
                }
            }
        `;
        const pagination = {
            limit: input.length
        };
        const variables = {
            input,
            pagination
        };
        const data = await this.sendGraphQLAuth(query, variables);
        return data;
    }


    async fetchDictionariesByStartLimit(start, limit) {
        const query = `
            query GetDictionaries($start: Int!, $limit: Int!) {
              dictionaries(
                pagination: { start: $start, limit: $limit },
                publicationState: LIVE,
                sort: ["updatedAt:asc"]
              ) {
                data {
                  id
                  attributes {
                    word
                  }
                }
              }
            }
        `;
        const variables = { start, limit };
        const data = await this.sendGraphQLAuth(query, variables);
        return data;
    }

    async getGroupMap(uid) {
        const query = `
            query GetDictionGroupMap($uid: Int!) {
                dictiongroupmaps(
                    filters: {
                        uid: { eq: $uid }
                    }
                ) {
                    data {
                        id
                        attributes{
                            uid
                            group_map
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        `;
        const variables = {
            uid: parseInt(uid, 10)
        };
        const result = await this.sendGraphQLAuth(query, variables);
        if (result.data) {
            return {
                data: result.data.dictiongroupmaps.data[0]
            }
        }
        return result
    }

    async createGroupMap(uid, gInfo) {
        const newGroupMap = gInfo.attributes.wlink.map(id => {
            return [id, 0, 0];
        });
        const mutation = `
            mutation CreateDictionGroupMap($uid: Int,$group_map: JSON, $publishedAt: DateTime) {
                createDictiongroupmap(
                    data: {
                        uid: $uid,
                        group_map: $group_map,
                        publishedAt: $publishedAt
                    }
                ) {
                    data {
                        id
                        attributes{
                            uid
                            group_map
                            updatedAt
                        }
                    }
                }
            }
        `;
        const variables = {
            uid: parseInt(uid, 10),
            group_map: newGroupMap,
            publishedAt: new Date().toISOString()
        };
        const result = await this.sendGraphQLAuth(mutation, variables);
        return result.data.createDictiongroupmap
    }

    async updateGroupMap(id, oldWlink, newWlink = []) {
        let newGroupMap = newWlink.map(id => {
            return [id, 0, 0];
        });
        newGroupMap = oldWlink.concat(newGroupMap)
        newGroupMap = this.sortByByMap(newGroupMap)
        const mutation = `
        mutation UpdateDictionGroupMap($id: ID!, $group_map: JSON) {
            updateDictiongroupmap(
                id: $id,
                data: {
                    group_map: $group_map
                }
            ) {
                data {
                    id
                    attributes{
                        uid
                        group_map
                        updatedAt
                    }
                }
            }
        }
    `;
        const variablesMutation = {
            id,
            group_map: newGroupMap,
        };
        console.log(variablesMutation)
        const result = await this.sendGraphQLAuth(mutation, variablesMutation);
        return result;
    }

    sortByByMap(groupMap) {
        groupMap.sort((a, b) => a[1] - b[1]);
        return groupMap;
    }

    async loginAndStoreToken(identifier, password, callback) {
        const query = `
            mutation Login($identifier: String!, $password: String!) {
                login(
                    input: {
                        identifier: $identifier,
                        password: $password,
                        provider: "local"
                    }
                ) {
                    jwt
                    user {
                        id
                    }
                }
            }
        `;
        const variables = {
            identifier,
            password
        };
        const result = await this.sendGraphQLNotAuto(query, variables);
        if (result && result.data && result.data.login && result.data.login.jwt) {
            if (callback) callback(result.data.login)
            alert(`登陆成功:即将跳转`)
            this.setJWT(result.data.login.jwt)
            this.useJWT()
        } else {
            let err = ''
            if (result.errors) {
                if (Array.isArray(result.errors)) {
                    err = result.errors[0]
                    err = err.message
                }
            } else if (result.message) {
                err = result.message
            }
            alert(`登陆失败: ${err}`);
        }
    }

    async registerAndLogin(registrationData) {
        const registrationQuery = `
            mutation Register($input: UsersPermissionsRegisterInput!) {
                register(input: $input) {
                    jwt
                    user {
                        id
                        username
                        email
                    }
                }
            }
        `;
        const variables = {
            input: {
                username: registrationData.username,
                email: registrationData.email,
                password: registrationData.password
            }
        };

        const registrationResponse = await this.sendGraphQLNotAuto(registrationQuery, variables);
        return registrationResponse
    }

    findDataKey(json) {
        if (json.hasOwnProperty('data')) {
            const dataValue = json.data;
            if (Array.isArray(dataValue) && dataValue.length > 0) {
                return dataValue[0];
            } else if (typeof dataValue === 'object' && dataValue !== null) {
                const firstKey = Object.keys(dataValue)[0];
                return dataValue[firstKey];
            } else {
                return dataValue
            }
        }
        for (const key in json) {
            if (typeof json[key] === 'object' && json[key] !== null) {
                const result = this.findDataKey(json[key]);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }

    isPage(page) {
        const parsedUrl = new URL(window.location.href);
        const pathParts = parsedUrl.pathname.split(/[\/\.\?]+/);
        return pathParts.includes(page);
    }

    redirectToLogin() {
        window.location.href = '/login.html';  // 根据您的路由库和设置进行调整
    }

    redirectToHome() {
        window.location.href = '/index.html';  // 根据您的路由库和设置进行调整
    }

    setJWT(jwt) {
        localStorage.setItem('jwt', jwt)
    }

    useJWT() {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            if (this.isPage('login') || this.isPage('register')) {
                this.redirectToHome()
            }
            return jwt;
        } else {
            if (!this.isPage('login') && !this.isPage('register')) {
                this.redirectToLogin()
            }
            return null
        }
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

    parse_data(method, data) {
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
        data = this.parse_data(method, data)
        let url = this.get_api_url();

        const params = new URLSearchParams(data).toString();
        url += '?' + params;

        const response = await fetch(url, { mode: 'cors' });
        data = await response.json();
        return this.toJSON(data);
    }

    async post(method, data) {
        data = this.parse_data(method, data)
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