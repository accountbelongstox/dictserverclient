// ==UserScript==
// @name         文档词典统计工具
// @namespace 	 accountbelongstox@163.com
// @version      0.4
// @description  将文档整理成词典，并展示。
// @author       accountbelongstox@163.com
// @match        *://*.*/*
// @match        *://*.*.*/*
// @match        *://*/*
// @exclude      *://*.12gm.com
// @license      AGPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// ==/UserScript==
(function () {
    'use strict';
    const base_remote_url = "https://dict.12gm.com:888/"

    class MyDict {
        base_remote_url = "https://api.12gm.com/"
        module_name = 'dictionary'
        local_tokenname = 'doc_dict_username'
        new_words = []
        filterwords = []
        refurls = [
            // `https://unpkg.com/element-ui/lib/theme-chalk/index.css`,
            // `https://unpkg.com/vue@2/dist/vue.js`,
            // `https://unpkg.com/element-ui/lib/index.js`,
            // `https://unpkg.com/axios/dist/axios.min.js`,
        ]

        constructor() {
            if (base_remote_url) {
                this.base_remote_url = base_remote_url
            }
        }

        queryjson2querystring(queryjson) {
            var arr = [];
            for (var k in queryjson) {
                arr.push(k + "=" + encodeURIComponent(json[k]));
            }
            return arr.join("&");
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

        async get(method, request_data) {
            let url = this.remote_url(method)
            if (this.keys_len(request_data) > 0) {
                let querystring = this.queryjson2querystring(request_data);
                let joiner = url.includes('?') ? "&" : "?"
                querystring = joiner + querystring
                url = url + querystring
            }
            return await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
                .then(async response => await this.get_data(response))
        }

        async post(method, data) {
            let url = this.remote_url(method)
            return await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            })
                .then(async response => await this.get_data(response))
        }

        async to_json(json_str) {
            if (json_str instanceof Uint8Array) {
                json_str = new TextDecoder().decode(json_str);
            }
            if (typeof json_str != 'string') {
                if ('json' in json_str) {
                    json_str = await json_str.json()
                }
                return json_str;
            }
            json_str = json_str.trim();
            if (json_str.length === 0) {
                return json_str;
            }
            const first_char = json_str[0];
            if (!['{', '"', '['].includes(first_char)) {
                return json_str;
            }
            try {
                json_str = JSON.parse(json_str);
            } catch (e) {
                console.log(json_str, e);
            }
            return json_str;
        }

        async get_data(data) {
            data = await this.to_json(data)
            if (typeof data == 'string') {
                return data
            }
            if (data && data.data) {
                data = data.data
            }
            if (Array.isArray(data)) {
                data = data[0]
            }
            return data
        }


        init() {
            if (this.exclude()) {
                return
            }
            this.add_init_html()
            this.listing_buttom()
            this.get_session()
            this.add_refurls(this.refurls)
            this.count_pagewords()
        }

        get_session() {
            let userinfo = this.get_localuserinfo()
            if (!userinfo.username) {
                this.post("user:get_userinfobysession")
                    .then((data) => {
                        if (data && data.data) {
                            data = data.data
                        }
                        if (Array.isArray(data)) {
                            data = data[0]
                        }
                        this.set_localuserinfo(data)
                        this.get_readcountandset()
                    })
            }else{
                this.get_readcountandset()
            }
        }


        info(message) {
            let id = "#WordToNoteBookButton"
            let note = document.querySelector(id)
            if (note) {
                note.querySelector('span').innerHTML = message
                note.style.display = 'block'
                setTimeout(() => {
                    note.style.display = 'none'
                }, 1500)
            }
        }

        is_mobile_browser() {
            let mobile_match = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
            if (mobile_match) {
                this.get_trans_word_index = 2
                this.mobile_browser = 1
            } else {
                this.get_trans_word_index = 3
                this.mobile_browser = 0
            }
        }

        exclude() {
            let is_frame = (window.self === window.top) == false
            let is_exclude = false
            if (is_frame) {
                return true
            }
            let exclude_hosts = [
                "12gm.com",
                `127.0.0.1`,
                `localhost`
            ]
            let hostname = window.location.hostname
            exclude_hosts.forEach(exclude_host => {
                if (hostname.endsWith(exclude_host)) {
                    console.log(`exclude url ${hostname}`)
                    is_exclude = true
                    return
                }
            })
            return is_exclude
        }

        add_init_html() {
            let up_html = this.get_init_html()
            document.querySelector('body').insertAdjacentHTML("afterBegin", up_html);
        }

        set_readprecentage(words_text) {
            let readwords = words_text.split(',')
            let words = this.get_documentwords()
            let unread_words = words.filter(item => readwords.includes(item));
            let precent = ((unread_words.length / words.length) * 100).toFixed(2);
            let userinfo = this.get_localuserinfo()
            // let precent = parseInt(( (words.length - unread_words.length) / words.length )) * 100
            document.querySelector('.badge_chat-number').innerHTML = `[已登陆] ${precent}%阅读率`
        }

        listin_documentalive() {

        }

        remove(selector) {
            let ele = document.querySelector(selector)
            if (ele) {
                ele.remove()
            }
        }

        get_documentwords() {
            let words = [...(
                new Set(
                    document.documentElement.textContent.split(/[^a-zA-Z]/)
                        .join(" ").split(/(?<=[a-z])\B(?=[A-Z])/)
                        .join(" ").split(/\s+/)
                )
            )]
            let is_notword = /^[a-z]+[A-Z]$/
            for (let word of words) {
                if (is_notword.test(word) || word.length < 3) {
                    this.add_filterwords(word)
                } else {
                    this.add_newwords(word)
                }
            }
            return this.new_words
        }

        add_newwords(word) {
            if (!this.new_words.includes(word)) {
                this.new_words.push(word)
            }
        }

        add_filterwords(word) {
            if (!this.filterwords.includes(word)) {
                this.filterwords.push(word)
            }
        }

        split_html(html) {
            html = html.replaceAll(/<.+?>/g, '')
            return html
        }

        put_to_remote_local_vocabulary(callback) {
            let doc = document.documentElement.outerHTML;
            if (doc) {
                let url = this.remote_url('put_translate_words')
                $.post(url, {
                    "doc": doc,
                    "t_group": location.hostname
                }, (data) => {
                    if (callback) {
                        callback(data)
                    }
                })
            }
        }

        local_storage(key, value) {
            if (value) {
                localStorage.setItem(key, value)
            } else {
                return localStorage.getItem(key)
            }
        }

        set_groupname() {
            this.local_storage("group_name", window.location.hostname)
        }

        get_groupname() {
            let group_name = this.local_storage("group_name")
            if (!group_name) {
                group_name = this.get_defaultgroupname()
            }
            return group_name
        }

        get_defaultgroupname() {
            let href = window.location.href
            if (href.startsWith("http")) {
                href = window.location.hostname
            } else if (href.startsWith("file")) {
                href = href.split(/\/+/).pop()
            }
            return href
        }

        remote_url(method) {
            let methods = method.split(':')
            let module_name = null
            if (methods.length > 1) {
                module_name = methods[0]
                method = methods[1]

            }
            if (!module_name) {
                module_name = this.module_name
            }
            if (!module_name.startsWith('com_')) {
                module_name = `com_${module_name}`
            }
            this.base_remote_url = this.base_remote_url.replace(/\/+$/, '')
            let url = `${this.base_remote_url}/api?method=${method}&key=9LrQN0~14,dSmoO^&module=${module_name}`;
            return url
        }

        translate_wordtotran() {
            let trans_target = document.querySelector("#outlined-multiline-static")
            setInterval(function () {
                let text = window.getSelection().toString()
                let trans_target_text = trans_target.value
                if (text && text != trans_target_text) {
                    trans_target.value = trans_target_text
                }
            }, 500)
        }

        //给添加的元素添加监听事件
        listing(selector, event, callback) {
            let ele = document.querySelector(selector)
            if (ele) {
                ele.addEventListener(event, () => {
                    callback()
                })
            }
        }

        get_saladict_panel(selector) {
            let saladict_panel = document.querySelector('#saladict-dictpanel-root .saladict-panel')
            if (!saladict_panel) {
                console.log('not found #saladict-dictpanel-root .saladict-panel')
                return null
            }
            let shadow_root = saladict_panel.shadowRoot
            if (!shadow_root) {
                console.log('not found saladict_panel > shadowRoot')
                return null
            }
            //document.querySelector('#saladict-dictpanel-root .saladict-panel').shadowRoot.querySelectorAll('.dictItem-BodyMesure > div:last-child')
            let shadow_roots = shadow_root.querySelectorAll('.dictItem-BodyMesure > div:last-child')
            if (!shadow_roots.length) {
                console.log('not found .dictItem-BodyMesure > div:last-child')
                return null
            }
            for (let i = 0; i < shadow_roots.length; i++) {
                let shadowitem = shadow_roots[i]
                if (shadowitem.shadowRoot) {
                    shadow_root = shadowitem.shadowRoot
                    if (selector) {
                        shadow_root = shadow_root.querySelector(selector)
                        if (shadow_root) {
                            break
                        }
                    }
                }
            }

            if (!shadow_root) {
                console.log('not found .dictItem > shadow_root')
                return null
            }
            return shadow_root
        }

        play_bingvoice() {
            //document.querySelector('#saladict-dictpanel-root .saladict-panel').shadowRoot.querySelector('.dictItem-BodyMesure > div:last-child').shadowRoot.querySelector('.saladict-Speaker')
            let us_voice = this.get_saladict_panel('.saladict-Speaker')
            if (!us_voice) {
                console.log('not found saladict-Speaker')
                return
            }
            let css_class = us_voice.getAttribute('class')
            if (css_class.indexOf('isActive') == -1) {
                us_voice.click()
            }
        }

        put_word(e) {
            let those = window.MyDict
            if (e.key == ',') {
                let dictBing_Title = those.get_saladict_panel('.dictBing-Title')
                if (!dictBing_Title) {
                    dictBing_Title = those.get_saladict_panel('.MachineTrans-lang-en span')
                }
                if (!dictBing_Title) {
                    console.log('not found dictBing-Title')
                    return
                }
                let word = dictBing_Title.innerHTML
                if (word) {
                    console.log(`add ${word} to notebook.`)
                    those.get("put_word", {
                        group: "eudic默认生词本",
                        word,
                        reference_url: window.location.href
                    }).then((data) => {
                        let notebook_count = data.data[0].notebook_count
                        those.set_notebook_count(notebook_count)
                        those.info(`${word}添加到生词本.`)
                    })
                }
            } else if (e.key == '.') {
                those.play_bingvoice()
            }
        }

        add_refurls(urls) {
            // 遍历URL数组，创建新的link或script元素，并将它们添加到HTML文档头部
            urls.forEach(url => {
                if (url.endsWith('.css')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = url;
                    document.head.appendChild(link);
                } else if (url.endsWith('.js')) {
                    const script = document.createElement('script');
                    script.src = url;
                    document.head.appendChild(script);
                }
                console.log(`add url ${urls}`)
            });
        }

        async login() {
            let user = document.querySelector(`[name=thousandsofday_app_username]`).value
            let pwd = document.querySelector(`[name=thousandsofday_app_password]`).value
            if (!user && !pwd) {
                alert("请填入账号名和密码!")
                return false
            }
            
            return await this.post("user:login", {
                user,
                pwd,
                json: true,
            }).then(data => {
                console.log('data',data)
                if(typeof data == 'string'){
                    alert(data)
                    return {}
                }else{
                    var element = document.querySelector(".thousandsofday_app_login");
                    // 显示元素
                    element.style.display = "none";
                    this.set_localuserinfo(data)
                    this.get_readcountandset()
                    return data
                }
            })
        }

        count_pagewords() {
            let key = 'thousands_of_day_lasturl'
            localStorage.setItem(key, '');
            setInterval(() => {
                let lastUrl = localStorage.getItem(key);
                if (lastUrl != window.location.href) {
                    let words = this.get_documentwords()
                    document.querySelector('.articleword_count').innerHTML = words.length
                    localStorage.setItem(key, window.location.href);
                }
            }, 500)
        }

        get_readcountandset() {
            this.readcount((words_text) => {
                this.set_readprecentage(words_text)
            })
        }

        readcount(callback) {
            let userinfo = this.get_localuserinfo()
            if (userinfo.username) {
                let words_text = this.local_storage('readcount')
                if (!words_text) {
                    this.post('get_readcount', {
                        userid: userinfo.userid,
                        username: userinfo.username,
                    }).then((data) => {
                        if (data && data.read_map) {
                            let read_map = data.read_map
                            let words = []
                            for (let word in read_map) {
                                words.push(word)
                            }
                            words_text = words.join(',')
                            this.local_storage('readcount', words_text)
                            if (callback) callback(words_text)
                        }
                    })
                } else {
                    if (callback) callback(words_text)
                }
            }
        }

        get_localuserinfo() {
            let userinfo = localStorage.getItem(self.local_tokenname)
            if (!userinfo || userinfo == 'null') {
                userinfo = {}
            }
            if (typeof userinfo == 'string') {

                try {
                    userinfo = JSON.parse(userinfo)
                } catch (e) {
                    userinfo = {}
                }
            }
            if (!userinfo.username) {
                document.querySelector('.badge_chat-number').innerHTML = `请先登陆：千语单词`
            }
            return userinfo
        }

        set_localuserinfo(userinfo) {
            let origin_userinfo = this.get_localuserinfo()
            console.log('origin_userinfo', origin_userinfo)
            for (const key in userinfo) {
                origin_userinfo[key] = userinfo[key]
            }
            localStorage.setItem(self.local_tokenname, JSON.stringify(origin_userinfo))
        }


        //给添加的元素添加监听事件
        listing_buttom(classname) {
            let Doc
            if (classname) {
                Doc = document.querySelector(classname);
            } else {
                Doc = document
            }
            var allElements = Doc.getElementsByTagName("*");

            // 遍历所有元素并判断是否具有"data-click"属性
            for (var i = 0; i < allElements.length; i++) {
                if (allElements[i].hasAttribute("data-click")) {
                    let ele = allElements[i]
                    let click_name = ele.getAttribute("data-click")
                    ele.addEventListener("click", () => {
                        this[click_name](ele)
                    })
                }
            }
        }

        put_group() {
            let userinfo = this.get_localuserinfo()
            if (!userinfo.username) {
                // 获取元素
                var element = document.querySelector(".thousandsofday_app_login");
                // 显示元素
                element.style.display = "block";
                alert('请先设置千语单词用户名.')
                return false
            }
            let group_name = this.get_defaultgroupname()
            this.set_groupname(group_name)
            let words = this.new_words
            console.log(userinfo, words)
            if (confirm(`文档名：'${group_name}'\n词数：${words.length} 个词\n用户名：${userinfo.username}\nApi Url：${this.base_remote_url}\n已排除：${this.filterwords.length} 个词`)) {
                this.post("put_group", {
                    doc: this.new_words.join(" "),
                    group_name: group_name,
                    incremental: true,
                    user_id: userinfo.userid,
                    username: userinfo.username,
                }).then((result) => {
                    console.log(result)
                })

            }
            window.onkeydown = this.put_word
        }

        get_init_html() {
            let html = `
            <style>
            .add_wordtodocument{
                display: block;
                z-index: 1050;position: fixed;
                right: 7px;
                top: 130px;
                height: 55px;
                font-weight: 900;
                background: -webkit-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                -moz-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                -ms-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                color: transparent;
                /*设置字体颜色透明*/
                /*背景裁剪为文本形式*/
                animation: ran 10s linear infinite;
                /*动态10s展示*/
                border-radius: 25px;
                padding: 0 10px;
            }
            .add_worddiv{
                float: left;
                width: 200px;
                display:none;
            }
            .add_wordinput{
                width: 200px;
                height: 30px;
                line-height: 30px;
                border-radius: 10px;
                color: #333333;
            }
            .add_worddivbutton{
                height: 60px;
                width: 60px;
                position: fixed;
                right: 100px;
                bottom: 25px;
                background: #20a53a;
                border-radius: 2px;
                /* box-shadow: 0 0 8px 1px #aeaeae; */
                text-align: center;
                line-height: 60px;
                cursor: pointer;
                z-index: 99999996;
                border-radius: 50%;
                color: #fff;
                background-image: initial;
                background-color: rgb(26, 132, 46);
                box-shadow: rgb(70 76 78) 0px 0px 8px 1px;
                color: rgb(232, 230, 227);
            }
			.add_worddivbutton span{
                color: #fff;
			}
            .add_worddiv ul{
                margin: 0;
                float: left;
                padding: 0px;
            }
            .add_worddiv ul li{
                float: left;
            }
            .add_worddiv ul li .group_span{
                color: #000;
                font-size: 12px;
                line-height: 20px;
                /* height: 20px; */
                padding-left: 5px;
            }
            .add_worddiv ul .grouptitle{
                height: 14px;
            }
            .add_wordbutton{    
                width: 100%;
                float: left;
                font-weight: bold;
                text-align: center;
                color: #fff;
                display: inline-block;
                vertical-align: middle;
                font-size: 12px;
                text-align: center;
                line-height: 15px;
                padding-top: 15px;
                height: 45px;
            }
            .worddiv_iframediv{
                display: block;
                width: 100%;
                float: left;
                font-weight: bold;
                font-size: 30px;
                line-height: 55px;
                text-align: center;
                color: indianred;
            }
            .worddiv_iframediv{
                display: none;
                width: 100%;
                float: left;
                font-weight: bold;
                font-size: 30px;
                line-height: 55px;
                text-align: center;
                color: indianred;
            }
            .worddiv_iframe{
                display: block;
                width: 100%;
                height: 800px;
            }

            .tip {
                position: relative;
                margin-left: 20px;
                margin-top: 20px;
                width: 200px;
                background: #8b1a02;
                padding: 10px;
                position: fixed;
                top: 0;
                left: 40%;
                /*设置圆角*/
                z-index: 2100000000;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                display:none;
            }

            /*提示框-左三角*/
            .tip-trangle-left {
                position: absolute;
                bottom: 15px;
                left: -10px;
                width: 0;
                height: 0;
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-right: 15px solid #8b1a02;
            }

            /*提示框-右三角*/
            .tip-trangle-right {
                position: absolute;
                top: 15px;
                right: -10px;
                width: 0;
                height: 0;
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-left: 15px solid #8b1a02;
            }

            /*提示框-上三角*/
            .tip-trangle-top {
                position: absolute;
                top: -10px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-bottom: 15px solid #8b1a02;
            }

            /*提示框-下三角*/
            .tip-trangle-bottom {
                position: absolute;
                bottom: -10px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 15px solid #8b1a02;
            }

            .badge_chat-number{    
                position: fixed;
                right: 35px;
                z-index: 99999999;
                bottom: 75px;
                padding: 2px 7px;
                font-size: 14px;
                background-color: rgb(170, 3, 3);
                height: 12px;
                line-height: 12px;
                border-radius: 10px;
                color: #fff;
                width: 120px;
                text-align: left;
                overflow: hidden;
                white-space: nowrap;
            }

            .thousandsofday_app_login {
                position: fixed;
                width: 200px;
                right: 30px;
                height: 30%;
                bottom: 20px;
                z-index: 2000000000;
                display: none;
                justify-content: center;
                align-items: center;
              }
              .thousandsofday_function{
                
                position: fixed;
                width: 100px !important;
                right: 80px;
                height: 20px;
                bottom: 0px;
                z-index: 2000000000;
                line-height: 0px;
              }
              /* 登录框样式 */
              .thousandsofday_app_login-box {
                width: 100%;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              }
              .thousandsofday_app_login-box label{
                font-size: 10px;
              }
              .thousandsofday_app_login-box h2 {
                margin: 0;
                text-align: center;
                font-size: 14px;
                padding: 0;
              }
              .thousandsofday_app_login-input{
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: none;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              }
              .thousandsofday_app_login-button {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                background-color: #4caf50;
                color: #fff;
                cursor: pointer;
              }
            </style>

            <div class="tip" style="background-color: #8b1a02;" id="WordToNoteBookButton">
                <div class="tip-trangle-bottom"></div>
                单词添加成功提示:<br/>
                <span></span>
            </div>

            <div class="add_worddivbutton">
                <span class="badge_chat-number"></span>
                <a href="javascript:void(0)" data-click="put_group" class="add_wordbutton">
                    <span>提交本页<br><font class='articleword_count'>-</font><br>个词</span>
                </a>
                <input type="button" class="thousandsofday_app_login-button thousandsofday_function" data-click="check_local_user" value="打开菜单">
            </div>

            <div class="thousandsofday_app_login">
                <div class="thousandsofday_app_login-box">
                <h2>千语单词 - 登录窗口</h2>
                <label>Username</label>
                <input type="text" class="thousandsofday_app_login-input" name="thousandsofday_app_username" required>
                <label>Password</label>
                <input type="password" class="thousandsofday_app_login-input" name="thousandsofday_app_password" required>
                <input type="button" class="thousandsofday_app_login-button" data-click="login" value="登录账号">
                </div>
            </div>
            
            `
            return html
        }
    }
    window.MyDict = new MyDict()
    window.MyDict.init()
})();