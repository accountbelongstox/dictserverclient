import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseSettingCase from "./baseSettingCase.js"
import translateControlCase from "./translateControlCase.js"
import worddataProvider from "./worddataProvider.js"

class Main{
    disabletouchmovetoken = false

    previou_page_group() {
        let gid = translateControlCase.get_deraultgid()
        let page = this.get_currentpage(gid)
        if (page == 0) {
            alert(`already is the first page`)
            return
        }
        baseSettingCase.set_global_settings(`group.current_page.${gid}.page`, --page)
        worddataProvider.getData(gid,true)
    }

    next_page_group() {
        let gid = translateControlCase.get_deraultgid()
        let page = this.get_currentpage(gid)
        let per_words = worddataProvider.get_per_words()
        let max_page = translateControlCase.get_groupcount()
        max_page = max_page / baseSettingCase.get_global_settings('settings.per_words.value')
        max_page = Math.ceil(max_page)
        if (page >= max_page) {
            alert(`already is the last page`)
            return
        }
        baseSettingCase.set_global_settings(`group.current_page.${gid}.page`, ++page)
        worddataProvider.getData(gid,true)
    }

    get_currentpage(gid) {
        if (!gid) gid = translateControlCase.get_deraultgid()
        let current_page = baseSettingCase.get_global_settings(`group.current_page.${gid}`)
        let page = current_page.page
        if (!page) page = 0
        return page
    }

    set_currentpage(page = 0, gid) {
        if (!gid) gid = translateControlCase.get_deraultgid()
        baseSettingCase.set_global_settings(`group.current_page.${gid}`, page)
    }
    
    reloadjs() {
        if (!confirm('reload js')) {
            return false
        }
        this.reloadjstoken = true
        document.querySelectorAll('script').forEach(script => {
            if (script.src.endsWith('main.js')) {
                script.src = null
                script.remove()
            }
        })
        let js_url = `translate_js/main.js`
        baseHtmlToolCase.load_js(js_url, () => {
            setTimeout(() => {
                this.reloadjstoken = null
            }, 3000)
        })
    }

    disable_touchmove() {
        this.disabletouchmovetoken = !this.disabletouchmovetoken
        if (this.disabletouchmovetoken) {
            document.body.addEventListener('touchmove', this.listner_touchmove, { passive: false });
        } else {
            document.body.removeEventListener('touchmove', this.listner_touchmove, { passive: true });
        }
    }
}


export default  new Main()