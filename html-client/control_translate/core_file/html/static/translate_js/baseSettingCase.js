//本类不导入其他类
class Main {
    init_global_settingstoken = false
    global_config = {
        group: {
            current_id: null,
            current_page: {
                //id:0
            },
        },
        settings: {
            per_words: { name: "每页词数", value: 100 },
            per_dayreads: { name: "每天阅读", value: 2000 },
            maxplays: { name: "播放", value: 1 },
            maxreview: { name: "复习", value: 1 },
            glimpse: { name: "闪读", value: 0 },
            interval_seconds: { name: "间隔秒数", value: 2.5 },
            pre_delay: { name: "前置等待", value: 0.5 },
            reviewday: { name: "复习天数", value: 60 },
            wordliky: { name: "单词相似(%)", value: 30 },
            phoneticliky: { name: "音标相似(%)", value: 30 },
            show_maxphonetic: { name: "音标显示数", value: 1 },
            show_maximages: { name: "图片显示数", value: 2 },
            pre_load: { name: "预加载余词(%)", value: 50 },
            pre_render: { name: "预渲染余词(%)", value: 50 },
        }
        ,
        reviewlist: {
            time: "value"
        },
        daily_readed: [],
        autoplay: false,
    }
    get_query_selector(selector) {
        selector = selector.trim();
        return selector;
    }
    queryElement(selector) {
        selector = this.get_query_selector(selector);
        let ele = document.querySelector(selector);
        return ele
    }
    queryElementAll(selector) {
        selector = this.get_query_selector(selector);
        let eles = [];
        document.querySelectorAll(selector).forEach(ele => {
            eles.push(ele)
        });
        return eles
    }

    insertSettingsFormHTML() {
        let settings = this.get_global_settings(`settings`)
        let html = ``
        for (let key in settings) {
            let item = settings[key]
            let name = item.name
            if (!name || name == 'undefined') {
                continue
            }
            let value = item.value
            let val_type = typeof value === 'number' ? "number" : "text"
            html += `<li style="padding: 0; display: flex; flex-direction: row;">
                <div style="width: 50%;"><span class="text-line" style="text-align: right;line-height: 27px;float: right;padding-right: 5%;">${name} : </span></div>
                <div style="width: 50%;" ><input style="width: 100%; padding: 0;" data-settingkey="${key}" type="${val_type}" value="${value}" onchange="window.MyDict.event('change_setting',this);"></div>
            </li>`
        }
        this.queryElement("#control-sidebar-settings-tab ul").innerHTML = html
    }

    change_setting(ele) {
        let key = ele.getAttribute('data-settingkey')
        let value = ele.value
        let is_number = /^\d+$/.test(value)
        if (is_number) value = parseFloat(value)
        this.set_global_settings(`settings.${key}.value`, value)
    }


    set_global_settings(keys, value, safe = false) {
        this.init_global_settings()
        let global_settings = this.get_global_settings()
        if (safe) {
            global_settings = this.get_global_settings(keys);
            if (global_settings) {
                return global_settings
            }
        }
        keys = keys.split('.')
        let code
        let keystr = ``
        keys.forEach((key, index) => {
            keystr += `['${key}']`
            if (index < keys.length - 1) {
                code = `
                if(!global_settings${keystr}){
                    global_settings${keystr} = {};
                }
                `
            } else {
                if (typeof value === 'string') {
                    value = '`' + value + '`'
                } else {
                    value = JSON.stringify(value)
                }
                code = `global_settings${keystr} = ${value}`
            }
            // console.log(global_settings, code, keystr)
            try {
                eval(code)
            } catch (e) {
                console.log(global_settings)
                console.log(code)
                console.log(e.message)
            }
        })
        this.setLocalStorage("global_settings", global_settings)
        return global_settings
    }

    init_global_settings() {
        if (this.init_global_settingstoken) {
            return
        }
        let global_settings = this.get_global_settings("global_settings")
        let original_global_settings = this.get_global_settings();
        if (!global_settings) {
            global_settings = original_global_settings
        } else {
            for (let key in original_global_settings) {
                if (!global_settings[key]) {
                    global_settings[key] = original_global_settings[key]
                }
                if (typeof global_settings[key] == "object") {
                    for (let keyseconde in original_global_settings) {
                        if (!global_settings[key][keyseconde]) {
                            global_settings[key][keyseconde] = original_global_settings[key][keyseconde]
                        }
                    }
                }
            }
        }
        this.setLocalStorage("global_settings", global_settings)
        this.init_global_settingstoken = true
    }

    setLocalStorage(key, value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    getLocalStorage(key) {
        let val = localStorage.getItem(key);
        if (val == 'false') {
            val = false;
        } else if (val == 'true') {
            val = true;
        } else if (val == 'null') {
            val = null;
        } else {
            try {
                val = JSON.parse(val);
            } catch (e) {
                // value is not JSON, so return it as is
            }
        }
        return val;
    }

    get_global_settings(keys) {
        let global_settings = this.getLocalStorage("global_settings")
        if (!global_settings) {
            global_settings = this.global_config;
        }
        if (!keys) return global_settings
        keys = keys.split('.')
        let result = undefined
        keys.forEach(key => {
            if (!result) result = global_settings
            result = result[key]
            if (!result) {
                result = null
                return
            }
        })
        return result
    }

    set_localstorage(key, value) {
        let local_storage = this.get_localstorage()
        local_storage[key] = value
        this.queryElement('#localstorage').value = JSON.stringify(local_storage)
    }

    get_localstorage(key) {
        let ele = this.queryElement('#localstorage')
        let localstorage = ele.value
        if (!localstorage) {
            localstorage = {}
        } else {
            localstorage = JSON.parse(localstorage)
        }
        if (key) {
            return localstorage[key]
        } else {
            return localstorage
        }
    }

    clear_global_settings() {
        this.setLocalStorage("global_settings", null)
    }

}


export default new Main()