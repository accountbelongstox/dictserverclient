import UserCase from './UserCase.js';
import baseHtmlToolCase from './baseHtmlToolCase.js';
import baseSettingCase from './baseSettingCase.js';
import publicEventCase from './publicEventCase.js';
import translateControlCase from './translateControlCase.js';

class MyDictClass {

    constructor() { }

    init() {

        publicEventCase.load_js([
            "js/pinyin-pro.js",
            "js/JSLINQ.js",
            "js/pako.min.js",
        ])

        this.wait_jsloaded(()=>{
            baseHtmlToolCase.set_window_golbalerror()
            baseHtmlToolCase.add_stylesheet(`
                [data-word-container] {
                    margin-top: 30px;
                    padding-left: 0px;
                    padding-right: 0px;
                }
            `)
            UserCase.set_global_mode()
            baseSettingCase.init_global_settings()
            publicEventCase.listing_init()
            translateControlCase.get_groups()
        })
    }

    wait_jsloaded(callback) {
        if (typeof pinyinPro == 'undefined') {
            setTimeout(() => {
                this.wait_jsloaded(callback)
            }, 500)
        }else{
            if(callback)callback()
        }
    }

    event(name, ...arg) {
        if(publicEventCase[name]){
            publicEventCase[name](...arg)
        }else{
            alert(`${name} event not found by publicEventCase.`)
        }
    }
}
window.MyDict = new MyDictClass()
window.MyDict.init()