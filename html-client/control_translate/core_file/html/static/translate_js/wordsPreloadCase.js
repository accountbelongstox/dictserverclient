import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseSettingCase from "./baseSettingCase.js"
import baseStrArrCase from "./baseStrArrCase.js"
import translateControlCase from "./translateControlCase.js"
import translateHtmlCase from "./translateHtmlCase.js"
import wordsInfoCase from "./wordsInfoCase.js"

class Main {
    preloading = null
    downhalf_preloadgroupdata = null
    top_half_data = null
    lower_half_data = null
    waitrealrender = false

    percent_diffvalues(val1, val2) {
        let preload = baseSettingCase.get_global_settings(`settings.${val1}.value`)
        let per_words = baseSettingCase.get_global_settings(`settings.${val2}.value`)
        let preload_precen = preload / 100
        let remain_prewords = per_words * preload_precen
        return remain_prewords
    }

    is_lower_rendering() {
        let surplus = wordsInfoCase.surplus_unreviewe()
        console.log(`下半段渲染判断:`,surplus,surplus == 0)
        if (surplus == 1) {
            return true
        }
        return false
    }

    is_half_prerender() {
        let surplus = wordsInfoCase.surplus_unreviewe()
        let remain_prewords = this.percent_diffvalues("pre_load", "per_words")
        if (surplus <= remain_prewords) {
            return true
        }
        return false
    }

    top_half_rendering(callback) {
        if (this.top_half_data) {
            console.log(`开始上半段渲染`,this.top_half_data)
            this.show_preloadwordeles()
            translateHtmlCase.remove_already_reviewed()
            translateControlCase.set_groupwords(this.top_half_data, null, true, () => {
                this.top_half_data = null
                console.log(`上半段渲染结束`,this.top_half_data)
                if (callback) callback()
            })
        } else {
            console.log(`上半段渲,没有数据`)
        }
    }

    lower_half_rendering(callback) {
        if (this.lower_half_data) {
            console.log(`开始下半段渲染`)
            translateHtmlCase.remove_already_reviewed()
            this.show_preloadwordeles()
            translateControlCase.set_groupwords(this.lower_half_data, null, true, () => {
                console.log(`lower_half_rendering`)
                this.lower_half_data = null
                this.waitrealrender = false
                if (callback) callback()
            })
        } else {
            console.log(`上半段渲,没有数据`)
        }
    }

    slice_halfworddata(data) {
        if (data.data) {
            if (Array.isArray(data.data)) {
                let group_data = data.data[0]
                let group_words = group_data.group_words
                let halfdata = baseStrArrCase.split_array_half(group_words)
                this.top_half_data = {
                    data: [
                        {
                            group_map: group_data.group_map,
                            group_words: halfdata[0]
                        }
                    ]
                }
                this.lower_half_data = {
                    data: [
                        {
                            group_map: group_data.group_map,
                            group_words: halfdata[0]
                        }
                    ]
                }
                console.log(`this.top_half_data`, this.top_half_data)
                console.log(`this.lower_half_data`, this.lower_half_data)
            }
        }
    }

    is_preload() {
        let surplus = wordsInfoCase.surplus_unplay()
        let remain_prewords = this.percent_diffvalues("pre_load", "per_words")
        if (surplus <= remain_prewords && !this.top_half_data && !this.lower_half_data && !this.preloading) {
            return true
        }
        return false
    }

    preload() {
        this.preloading = true
        console.log(`开始预请求`)
        let per_words = baseSettingCase.get_global_settings('settings.per_words.value')
        let limit = `${per_words},${per_words}`;
        translateControlCase.get_wordsbygroup(null, limit, true, (data) => {
            this.preloading = null
            this.waitrealrender = true
            this.slice_halfworddata(data)
            this.slice_halfworddata(data)
            console.log(`预请求成功, preloading ${this.preloading},`)
            console.log(`top_half_data`,this.top_half_data)
            console.log(`lower_half_data`,this.lower_half_data)
        })
    }

    show_preloadwordeles() {
        let preloadwordeles = baseHtmlToolCase.queryElementAll(`[data-preload="true"]`)
        preloadwordeles.forEach((ele) => {
            ele.setAttribute('data-preload', false)
            console.log(`ele`, ele)
            ele.setAttribute('style', '')
        })
        console.log(`preloadwordeles`, preloadwordeles)
    }
}


export default new Main()