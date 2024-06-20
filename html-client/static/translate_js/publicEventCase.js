import UserCase from "./UserCase.js"
import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseHttpCase from "./baseHttpCase.js"
import baseSettingCase from "./baseSettingCase.js"
import pageControlCase from "./pageControlCase.js"
import playControlNewCase from "./playControlNewCase.js"
import translateControlCase from "./translateControlCase.js"

class Main {
    reloadjstoken = null
    test_network_status = 0
    showpinyin(ele) {
        if (ele) {
            ele = ele.parentElement.nextElementSibling
            if (ele) {
                let display = 'block'
                if (ele.style.display == "block") {
                    display = 'none'
                }
                ele.style.display = display
            }
        }
    }
    updateNetworkStatus() {
        this.test_network_status += 1
        let rating = "unknown";
        let code = 0;
        if (navigator.connection) {
            const { downlink, effectiveType, rtt } = navigator.connection;
            if (effectiveType === "4g" && downlink >= 5 && rtt <= 50) {
                rating = "excellent";
                code = 5;
            } else if (effectiveType === "4g" && downlink >= 3 && rtt <= 100) {
                rating = "good";
                code = 4;
            } else if (effectiveType === "3g" && downlink >= 1 && rtt <= 150) {
                rating = "average";
                code = 3;
            } else {
                rating = "poor";
                code = 2;
            }
        }
        console.log(`Network status: ${rating}`);
        return code
    }
    submit_haveread(wid){
        hasreadCase.submitHasread(wid)
    }
    listing_init() {
        baseSettingCase.insertSettingsFormHTML()
        let allElements = document.querySelectorAll('[class]');
        let elements = Array.from(allElements).filter(element =>
            Array.from(element.classList).some(className => className.includes('event-'))
        );
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const event_token = Array.from(element.classList).filter(className => className.startsWith('event-')).pop();
            const event_parse = event_token.split(`-`)
            const event_type = event_parse[1]
            const event_name = event_parse[2]
            let is_add_event = true
            switch (event_type) {
                case "click":
                    element.addEventListener('click', (event) => {
                        this[event_name](event)
                    });
                    break;
                case "mouseover":
                    element.addEventListener('mouseover', (event,element) => {
                        this[event_name](event)
                    });
                    break;
                default:
                    is_add_event = false
                    console.log(`未知的事件类型:${event_type}`);
                    break;
            }
            if (is_add_event) {
                console.log(`bind ${event_name} of ${event_type}`);
            }
        }
    }
    load_js(jssrc, callback) {
        if (typeof jssrc === 'string') {
            jssrc = [jssrc]
        }
        jssrc.forEach(src => {
            if (!src.startsWith('http')) {
                src = baseHttpCase.remote_resourceurl(src)
            }
            baseHtmlToolCase.insertAdjacent('script', {
                src: src,
                type: "text/javascript"
            }, callback)
        })
    }
    change_group(gid) {
        console.log('change gid',gid)
        translateControlCase.change_group(gid)
    }
    previou_word() {
        playControlNewCase.previou_word()
    }
    next_word() {
        playControlNewCase.next_word()
    }
    playbackSwitch() {
        playControlNewCase.playbackSwitch()
    }
    set_review() {
        UserCase.set_review(true)
    }
    set_brief_mode() {
        UserCase.set_brief_mode()
    }
    set_project_mode() {
        UserCase.set_project_mode()
    }
    trans_refresh() {
        if (!confirm('是否刷新')) {
            return false
        }
        window.location.reload()
        this.scroll_top()
    }
    reloadjs() {
        pageControlCase.reloadjs()
    }
    previou_page_group() {
        pageControlCase.previou_page_group()
    }
    next_page_group() {
        pageControlCase.next_page_group()
    }
    disable_touchmove() {
        pageControlCase.disable_touchmove()
    }
    change_setting(ele) {
        baseSettingCase.change_setting(ele)
    }
    play_voice(wid_vid) {
        if (typeof wid_vid == 'string') {
            wid_vid = wid_vid.split('-')
            let wid = wid_vid[0]
            let vid = wid_vid[1]
            let ele = baseHtmlToolCase.queryElement(`[data-wordid="${wid}"]`)
            playControlNewCase.play_voice(ele)
        } else {
            baseHtmlToolCase.message(`${wid_vid} play not found.`)
        }
    }
    register(event){
        UserCase.register(event)
    }

    login(event) {
        UserCase.login(event)
    }
}

export default new Main()