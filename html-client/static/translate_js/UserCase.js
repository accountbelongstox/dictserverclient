import baseHtmlToolCase from './baseHtmlToolCase.js';
import baseSettingCase from './baseSettingCase.js';
import baseHttpCase from './baseHttpCase.js';

class Main {
    request_compress = true
    global_mode = 'normal'

    login() {
        const userId = document.querySelector('#user').value;
        const password = document.querySelector('#pwd').value;
        const agreement = document.querySelector('#basic_checkbox_1').checked;
        if (!userId || !password) {
            alert('输入可用的用户名/密码.');
            return false;
        }
        if (!agreement) {
            alert('请先勾选同意选项.');
            return false;
        }
        return baseHttpCase.loginAndStoreToken(userId, password, (result) => {
            if(result.user){
                console.log(result.user.id)
                this.setUID(result.user.id)
            }
        })
    }

    async register() {
        var username = document.querySelector("#username");
        var email = document.querySelector("#mail");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            alert("请输入有效的邮箱地址");
            return false;
        }

        var password1 = document.querySelector("#pwd");
        var password2 = document.querySelector("#pwd_verification");
        var agreeCheckbox = document.querySelector("#basic_checkbox_1");

        try {
            if (!email.value || !username.value || !password1.value || !password2.value || !agreeCheckbox) {
                alert("请填写所有必填字段");
                return false;
            }
        } catch (e) {
            alert("请填写所有必填字段");
            return false
        }

        if (password1.value !== password2.value) {
            alert("两次输入的密码不一致，请重新输入");
            return false;
        }

        if (!agreeCheckbox.checked) {
            alert("请勾选同意复选框");
            return false;
        }

        var registrationData = {
            username: username.value,
            email: email.value,
            password: password1.value
        };

        let result = await baseHttpCase.registerAndLogin(registrationData);
        if (result.jwt) {
            alert(`注册成功: 用户名${result.user.username}`)
            baseHttpCase.setJWT(result.jwt)
            baseHttpCase.useJWT()
        } else {
            alert(`注册失败: ${result.message}`);
        }
    }

    getUID() {
        return localStorage.getItem('UserUid');
    }

    setUID(uid) {
        return localStorage.setItem('UserUid', uid);
    }

    authenticate(request_data) {
        let userid = this.get_currentuserid();
        let username = this.get_currentusername();
        let group_id = this.get_currentgid();
        if (!userid || !username) {
            alert("登陆已过期,请重新登陆")
            window.location.href = '/login'
            return null
        }
        if (!request_data) {
            request_data = {}
        }
        request_data.userid = userid
        request_data.group_id = group_id
        request_data.username = username
        request_data.compress = this.request_compress
        return request_data
    }

    get_currentuserid() {
        let userinfo = baseHtmlToolCase.queryCookie('userinfo')
        let userid = baseHtmlToolCase.queryCookie('userid', userinfo)
        return userid
    }

    get_currentusername() {
        let userinfo = baseHtmlToolCase.queryCookie('userinfo')
        let userid = baseHtmlToolCase.queryCookie('username', userinfo)
        return userid
    }

    get_currentgid() {
        let gid = baseSettingCase.get_global_settings('group.current_id')
        console.log(`gid ${gid}`)
        return gid
    }

    set_currentgid(gid) {
        baseSettingCase.set_global_settings('group.current_id',gid)
    }

    set_global_mode() {
        let pathname = window.location.pathname.replaceAll(/^\/+/g, ``)
        if (pathname.startsWith('dict_test')) {
            this.global_mode = 'test'
        }
        if (this.is_testmode()) { }
    }

    is_testmode() {
        return this.global_mode == 'test'
    }

    testmode_submit() {
        let right_select = 0
        const selectedRadioEl = document.querySelectorAll('input[type="radio"]:checked');
        selectedRadioEl.forEach(ele => {
            const word = ele.getAttribute('data-word');
            if (word) {
                right_select++
            }
        })
        alert(`正确 ${right_select} 个.`)
    }

    get_project_mode() {
        let mx = 750
        let mn = 740
        let w = window.innerWidth
        if (w > mn && w < mx) {
            return true
        }
        let project_mode = baseSettingCase.getLocalStorage(`project_mode`)
        return project_mode
    }

    set_project_mode() {
        let project_mode = this.get_project_mode()
        project_mode = !project_mode
        let word_title = `.box-header-translate .box-title`
        let word_subtitle = `.box-header-translate .word_subtitle`
        if (project_mode) {
            baseHtmlToolCase.add_class(word_title, `project_title`)
            baseHtmlToolCase.add_class(word_subtitle, `project_subtitle`)
        } else {
            baseHtmlToolCase.remove_class(word_title, `project_title`)
            baseHtmlToolCase.remove_class(word_subtitle, `project_subtitle`)
        }
        this.set_brief_mode(project_mode, null)
        this.set_project_bar(project_mode)
        baseSettingCase.setLocalStorage(`project_mode`, project_mode)
    }

    get_project_mode() {
        let project_mode = baseSettingCase.getLocalStorage(`project_mode`)
        return project_mode
    }

    set_brief_show(brief_mode) {
        let customvtab = `.box-body .customvtab`
        if (brief_mode) {
            baseHtmlToolCase.add_class(customvtab, `project_hide`)
        } else {
            baseHtmlToolCase.remove_class(customvtab, `project_hide`)
        }
    }

    set_project_bar(project_mode) {
        let chat_box_body = `#chat-box-body`
        let sticky_toolbar_bar = `.sticky-toolbar-bar`
        let sticky_toolbar_left = `sticky-toolbar-left`
        let sticky_toolbar_left_toggle = `sticky-toolbar-project-screen`
        // let sticky_toolbar_left_bar = `sticky-toolbar-left-bar`
        // let sticky_toolbar_screen = `sticky-toolbar-screen`
        // let sticky_toolbar = `sticky-toolbar`
        let main_header = `main-header`
        let main_header_app_menu = `${main_header} .app-menu`

        if (project_mode) {
            // baseHtmlToolCase.add_class(chat_box_body, `project_hide`)
            baseHtmlToolCase.add_class(sticky_toolbar_bar, sticky_toolbar_left_toggle)
            baseHtmlToolCase.remove_class(sticky_toolbar_bar, sticky_toolbar_left)
            // baseHtmlToolCase.add_class(sticky_toolbar_left_bar, sticky_toolbar_screen)
            // baseHtmlToolCase.remove_class(sticky_toolbar_left_bar, sticky_toolbar)
            baseHtmlToolCase.add_class(main_header, `main-header-screen`)
            baseHtmlToolCase.add_class(main_header_app_menu, `project_visible`)
        } else {
            // baseHtmlToolCase.remove_class(chat_box_body, `project_hide`)
            baseHtmlToolCase.add_class(sticky_toolbar_bar, sticky_toolbar_left)
            baseHtmlToolCase.remove_class(sticky_toolbar_bar, sticky_toolbar_left_toggle)
            // baseHtmlToolCase.add_class(sticky_toolbar_left_bar, sticky_toolbar)
            // baseHtmlToolCase.remove_class(sticky_toolbar_left_bar, sticky_toolbar_screen)
            baseHtmlToolCase.remove_class(main_header, `main-header-screen`)
            baseHtmlToolCase.remove_class(main_header_app_menu, `project_visible`)
        }
    }

    get_brief_mode() {
        let brief_mode = baseSettingCase.get_global_settings(`group.brief_mode`)
        return brief_mode
    }

    set_brief_mode(brief_mode = undefined, notice = true) {
        if (notice) {
            if (!confirm('是否设置简洁模式')) {
                return false
            }
        }
        if (brief_mode === undefined || brief_mode.tagName) {
            brief_mode = this.get_brief_mode()
            brief_mode = !brief_mode
            baseSettingCase.set_global_settings(`group.brief_mode`, brief_mode)
        }
        this.set_brief_show(brief_mode)
    }

}

export default new Main()