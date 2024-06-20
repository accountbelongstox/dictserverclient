//本类不导入其他类
class Main {

    getElementTop(el, target_ele) {
        if (!target_ele) target_ele = document.querySelector('html')
        let parent = el.offsetParent;
        let top = el.offsetTop;
        return parent && parent !== target_ele ? this.getElementTop(parent, target_ele) + top : top;
    }

    isWebObject(element) {
        return element instanceof HTMLElement;
    }

    isJSONObject() {
        try {
            JSON.parse(JSON.stringify(this.obj));
            return true;
        } catch (e) {
            return false;
        }
    }

    toScroll(selector, top = 10) {
        $("html, body").animate({ scrollTop: $(selector).offset().top - top }, 10);

    }

    insertAdjacent(tag, types, callback) {
        let ele = document.createElement(tag)
        for (let key in types) {
            let val = types[key]
            ele[key] = val
        }
        document.querySelector(`body`).insertAdjacentElement('beforeEnd', ele)
        if (callback) callback()
    }

    insertElement(html, selector = "body") {
        selector = this.queryElement(selector)
        if (selector) {
            selector.insertAdjacentHTML('beforeEnd', html)
        }
    }

    replaceClass(selector, oldClass, newClass) {
        console.log(selector)
        console.log(`${oldClass} to ${newClass}`)
        console.log($(selector))
        $(selector).removeClass(oldClass).addClass(newClass);
    }

    replaceClassByJs(selector, oldClass, newClass) {
        var elements = document.querySelectorAll(selector);

        elements.forEach(function (element) {
            element.classList.remove(oldClass);
            element.classList.add(newClass);
        });
    }

    remoteEleOfArrayByData(arr, data_set, val) {
        arr = arr.filter((item) => {
            return $(item).data(data_set) != val;
        });
        return arr
    }

    setHtml(selector, html) {
        if (typeof selector == 'string') {
            selector = document.querySelector(selector)
        }
        if (selector) {
            selector.innerHTML = html
        }
    }

    addHtml(selector, $html) {
        $(selector).append($html);
    }

    htmlDecode(input) {
        var div = document.createElement('div');
        div.innerHTML = input;
        return div.textContent;
    }

    create_ele(tag, types, callback) {
        this.insertAdjacent(tag, types, callback)
    }

    //给添加的元素添加监听事件
    listing(element, event, callback) {
        if (typeof element == 'string') {
            element = document.querySelector(element)
        }
        if (element) {
            element.addEventListener(event, (target) => {
                callback(target)
            })
        }
    }


    set_window_golbalerror() {
        window.onerror = (message, url, line, column, error) => {
            alert("Error: " + message + "\nURL: " + url + "\nLine: " + line + "\nColumn: " + column + "\nStackTrace: " + error.stack);
            return true;
        }
    }

    listner_touchmove(e) {
        e.preventDefault();
    }

    message(msg, user = "system", icon = "") {
        // console.log(user, msg)
        let chat_msg = this.queryElement(`#chat-box-body .chat-msg`)
        let prev_class = "self"
        if (chat_msg) {
            prev_class = chat_msg.getAttribute('class')
        }
        let message_type = 'user'
        let message_body_class = ''
        if (prev_class.endsWith('user')) {
            message_type = 'self'
            message_body_class = `justify-content-end`
        }
        if (!msg) return
        let send_time = this.create_time()
        switch (icon) {
            case 'women':
                icon = `static/picture/2.jpg`
                break
            case 'man':
                icon = `static/picture/3.jpg`
                break
            default:
                icon = `static/picture/002-google.svg`
                break
        }
        let msg_html = `<div class="chat-msg ${message_type}">
            <div class="d-flex align-items-center ${message_body_class}">
                <span class="msg-avatar">
                    <img src="${icon}" class="avatar avatar-lg">
                </span>
                <div class="mx-10">
                    <a href="#" class="text-dark hover-primary font-weight-bold">${user}</a>
                    <p class="text-muted font-size-12 mb-0" data-time="${send_time}">${send_time}</p>
                </div>
            </div>
            <div class="cm-msg-text">
                ${msg}
            </div>
        </div>`
        this.add_message(msg_html)
    }

    simple_message(msg) {
        if (!msg) return
        let msg_html = `<div class="chat-msg user">
            <div class="cm-msg-text">
                ${msg}
            </div>
        </div>`
        this.add_message(msg_html)
    }

    add_message(html) {
        let chat_logs = this.queryElement(`#chat-box-body .chat-logs`)
        chat_logs.insertAdjacentHTML("afterbegin", html)
        let chats = this.queryElementAll(`#chat-box-body .chat-msg`)
        let max_chat = 10
        if (chats.length > max_chat) {
            let diference_l = max_chat - chats.length
            chats.forEach((chat, index) => {
                if (index < diference_l) {
                    chat.remove()
                }
            })
        }
    }

    message_trim(msg, max = 50) {
        if (typeof msg != "string") {
            try {
                msg = JSON.stringify(msg)
            } catch (e) {
                msg = "" + msg
            }
        }
        if (msg && msg.length > max) {
            msg.substr(0, max)
        }
        return msg
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
                    format = `yyyy - MM - dd hh: mm: ss`
                } else {
                    format = `yyyy - MM - dd`
                }
            }
        } else {
            format = `yyyy - MM - dd hh: mm: ss`
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
    scroll_top() {
        window.scrollTo(document.body.scrollHeight, 0)
    }

    scroll_bottom() {
        window.scrollTo(0, document.body.scrollHeight)
    }

    scroll_to(top) {
        if (typeof top == "string") {
            top = this.queryElement(top).offsetTop
        }
        else if (typeof top == "object") {
            top = top.offsetTop
        }
        top = top + 10
        window.scrollTo(document.body.scrollHeight, top)
    }

    next_element(ele, safe = false) {
        if (ele && ele.nextElementSibling) {
            return ele.nextElementSibling
        }
        if (safe) {
            return ele
        }
        return null
    }

    prev_element(ele, safe = false) {
        if (ele && ele.previousElementSibling) {
            return ele.previousElementSibling
        }
        if (safe) {
            return ele
        }
        return null
    }

    split_html(html) {
        html = html.replaceAll(/<.+?>/g, '');
        return html
    }

    get_removeclassandaddclasselements(ele) {
        if (typeof ele == 'string') {
            ele = this.queryElementAll(ele)
        }
        if (!ele.length) {
            ele = [ele]
        }
        return ele
    }
    get_query_selector(selector) {
        selector = selector.trim();
        /*console.log(`selector ${selector}`); */
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
    get_parameter(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2])
        }
        return null
    }
    add_class(ele, class_name) {
        ele = this.get_removeclassandaddclasselements(ele);
        for (let i = 0; i < ele.length; i++) {
            let child = ele[i];
            let class_names = child.className;
            if (!class_names) {
                class_names = ``
            }
            class_names = class_names.split(/\s+/);
            if (!class_names.includes(class_name)) {
                class_names.push(class_name)
            }
            child.className = class_names.join(` `)
        }
    }
    remove_class(ele, class_name) {
        ele = this.get_removeclassandaddclasselements(ele);
        for (let i = 0; i < ele.length; i++) {
            let child = ele[i];
            let class_names = child.className;
            if (!class_names) {
                class_names = ``
            }
            class_names = class_names.split(/\s+/);
            class_names = this.array_remove(class_names, class_name);
            child.className = class_names.join(` `)
        }
    }

    replace_class(ele, original_class, target_class) {
        this.remove_class(ele, original_class);
        this.add_class(ele, target_class);
    }

    is_class(selector, className) {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(className)) {
                return true;
            }
        }
        return false;
    }

    htmlEncode(str) {
        let textNode = document.createTextNode(str);
        let div = document.createElement('div');
        div.appendChild(textNode);
        let text = div.innerHTML
        div.remove()
        return text;
    }

    queryCookie(name, cookies) {
        let separater = '\\='
        var pattern
        if (!name || name == 'token') {
            name = 'token';
            pattern = new RegExp(name + '\\s*' + separater + "\\s*([^;]+)");
        } else {
            separater = '\\:'
            pattern = new RegExp(name + '\\s*' + separater + "\\s*([a-zA-Z0-9]+)");
            cookies = this.queryCookie()
        }
        if (!cookies) {
            cookies = this.readCookie();
        } else {
            cookies = this.htmlEncode(cookies)
        }
        cookies = cookies.replaceAll('\\"', "")
        var match = pattern.exec(cookies);
        let v = null
        if (match) {
            v = match[1];
        }
        return v;
    }

    add_stylesheet(stylesheet) {
        const styleElement = document.createElement('style');
        const styleRule = stylesheet;
        styleElement.textContent = styleRule;
        document.head.appendChild(styleElement);
    }

    readCookie(key = 'thousands_of_days') {
        const cookies = document.cookie.split(';');
        // 查找名为key的cookie
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 如果该cookie以key=开头，则返回key的值
            if (cookie.startsWith(`${key}=`)) {
                const value = cookie.substring(`${key}=`.length, cookie.length);
                return value
            }
        }
        return ""
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

    set_attr(ele, key, val) {
        if (typeof ele == 'string') {
            ele = document.querySelector(ele)
        }
        if (ele) {
            ele.setAttribute(key, val)
        }
    }
    attr(ele, data, val) {
        $(ele).attr(`data-${data}`, val);
    }

    getattr(ele, data, defaultval) {
        let val = $(ele).attr(`data-${data}`);
        if (!val) val = defaultval
    }
    getAttr(ele, data, defaultval) {
        return this.getattr(ele, data, defaultval)
    }

    show(selector, opacity) {
        if (typeof selector == 'string') {
            selector = document.querySelector(selector)
        }
        if (selector) {
            selector.style.display = 'block'
            if (opacity) {
                selector.style.opacity = opacity
            }
        }
    }
    hide(selector, opacity) {
        if (typeof selector == 'string') {
            selector = document.querySelector(selector)
        }
        if (selector) {
            selector.style.display = 'none'
            if (opacity) {
                selector.style.opacity = 0
            }
        }
    }
}

export default new Main()