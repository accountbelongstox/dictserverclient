import baseHtmlToolCase from "./baseHtmlToolCase.js";
import baseSettingCase from "./baseSettingCase.js";
import translateHtmlCase from "./translateHtmlCase.js";
import baseStoreCase from "./baseStoreCase.js";
import hasreadCase from "./hasreadCase.js";

class Main {
    alreadywordids = []
    playcount_key = `playcount`
    reviewcount_key = `reviewcount`
    glimpsecount_key = `glimpsecount`
    played_key = `played`
    reviewed_key = `reviewed`
    glimpse_key = `glimpsed`

    get_allwordelesandpreload() {
        let we = baseHtmlToolCase.queryElementAll(`div[data-word]`)
        return we
    }

    get_allwordeles() {
        const elements = document.querySelectorAll(`div[${translateHtmlCase.wordcontaner_token}]`);
        const filteredElements = Array.from(elements).filter(element => {
            const isPreload = element.dataset.preload == 'true';
            const isExpired = element.dataset.expired == 'true';
            return !isPreload && !isExpired;
        });
        return filteredElements
    }

    get_allwordelesbypreload() {
        let we = baseHtmlToolCase.queryElementAll(`div[data-preload="true"]`)
        return we
    }

    set_allwordstatus() {
        let alreadyread_wordids = this.get_alreadyread_wordids()
        let alreadyreview_wordids = this.get_alreadyreview_wordids()
        let alreadyglimpse_wordids = this.get_alreadyglimpse_wordids()
        let wordeles = this.get_allwordeles();
        let maxplays = baseSettingCase.get_global_settings('settings.maxplays.value')
        let maxreview = baseSettingCase.get_global_settings('settings.maxreview.value')
        let maxglimpse = baseSettingCase.get_global_settings('settings.glimpse.value')
        wordeles.forEach((ele, index) => {
            let wid = this.get_idbyele(ele)
            ele.setAttribute(`data-${this.playcount_key}`, '0');
            ele.setAttribute(`data-${this.reviewcount_key}`, '0');
            ele.setAttribute(`data-${this.glimpsecount_key}`, '0');

            ele.setAttribute(`data-${this.played_key}`, 'false');
            ele.setAttribute(`data-${this.reviewed_key}`, 'false');
            ele.setAttribute(`data-${this.glimpse_key}`, 'false');
            if (ele.dataset[this.played_key] != 'true') {
                if (alreadyread_wordids.includes(wid)) {
                    ele.setAttribute(`data-${this.played_key}`, 'true');
                    ele.setAttribute(`data-${this.playcount_key}`, maxplays);
                }
            }
            if (ele.dataset[this.glimpse_key] != 'true') {
                if (alreadyglimpse_wordids.includes(wid)) {
                    ele.setAttribute(`data-${this.glimpse_key}`, 'true');
                    ele.setAttribute(`data-${this.glimpsecount_key}`, maxglimpse);
                }
            }
            if (ele.dataset[this.reviewed_key] != 'true') {
                if (alreadyreview_wordids.includes(wid)) {
                    ele.setAttribute(`data-${this.reviewed_key}`, 'true');
                    ele.setAttribute(`data-${this.reviewcount_key}`, maxreview);
                }
            }
        })
    }

    count_playedwords() {
        const elements = document.querySelectorAll(`[data-${this.played_key}="true"]`);
        // console.log(`elements.length`, elements.length)
        return elements.length
    }

    get_idbyele(ele) {
        return ele.dataset.wordid
    }

    get_elementbyid(wid) {
        let selector = translateHtmlCase.create_selectorbywid(wid)
        let ele = document.querySelector(selector)
        return ele
    }

    is_widexists(wid) {
        let selector = translateHtmlCase.create_selectorbywid(wid)
        return baseHtmlToolCase.queryElement(selector)
    }

    wait_allwordstatus(callback) {
        const element = document.querySelector(`div[${translateHtmlCase.wordcontaner_token}]`);
        if (element && element.dataset && element.dataset.loaded_audi) {
            if (callback) callback()
        } else {
            setTimeout(() => {
                this.wait_allwordstatus(callback)
            }, 1000)
        }
    }


    delete_wordstatus(word) {
        let wordstatus = this.get_localwordstatus()
        console.log(wordstatus[word], word)
        if (wordstatus[word]) {
            delete wordstatus[word]
        }
        this.set_localwordstatus(wordstatus)
    }

    surplus_unreviewe() {
        return this.get_allnotreviewed().length
    }


    surplus_unplay() {
        return this.get_allnotread().length
    }

    get_allreaded() {
        const elements = document.querySelectorAll(`[data-${this.played_key}="true"]`);
        return elements
    }

    get_firstele() {
        const element = document.querySelector(`[data-${this.played_key}]`);
        return element
    }

    get_firstreaded() {
        const element = document.querySelector(`[data-${this.played_key}="true"]`);
        return element
    }

    get_lastreaded() {
        let elements = document.querySelectorAll(`[data-${this.played_key}="true"]`);
        const element = elements[elements.length - 1]
        return element
    }

    get_allnotread() {
        const elements = document.querySelectorAll(`[data-${this.played_key}="false"]`);
        return elements
    }

    get_firstnotread() {
        const element = document.querySelector(`[data-${this.played_key}="false"]`);
        return element
    }

    get_firstnotreview() {
        const element = document.querySelector(`[data-${this.reviewed_key}="false"]`);
        return element
    }

    get_allreviewed() {
        const elements = document.querySelectorAll(`[data-${this.reviewed_key}="true"]`);
        return elements
    }

    get_allnotreviewed() {
        const elements = document.querySelectorAll(`[data-${this.reviewed_key}="false"]`);
        return elements
    }

    is_allreviewed() {
        return !this.get_firstnotreview()
    }

    is_allplayed() {
        return !this.get_firstnotread()
    }

    is_glimpsebyele(ele) {
        return ele.dataset[this.glimpse_key] == 'true'
    }

    get_prevread() {
        let lastread = this.get_lastreaded()
        if (lastread && lastread.previousElementSibling) {
            return lastread.previousElementSibling
        } else {
            return null
        }
    }

    set_localwordstatus(wordstatus) {
        baseSettingCase.setLocalStorage('localwordstatus', wordstatus)
    }

    get_alreadyread_wordids() {
        return baseStoreCase.get_alreadyhistorydata(`alreadyread`)
    }

    set_alreadyread_wordids(wid) {
        baseStoreCase.set_alreadyhistorydata(wid, `alreadyread`)
    }

    get_alreadyglimpse_wordids() {
        return baseStoreCase.get_alreadyhistorydata(`alreadyglimpse`)
    }

    set_alreadyglimpse_wordids(wid) {
        baseStoreCase.set_alreadyhistorydata(wid, `alreadyglimpse`)
    }

    get_alreadyreview_wordids() {
        return baseStoreCase.get_alreadyhistorydata(`alreadyreview`)
    }

    set_alreadyreview_wordids(wid) {
        baseStoreCase.set_alreadyhistorydata(wid, `alreadyreview`)
    }

    audiooncanplay(wid, vid) {
        baseHtmlToolCase.replace_class(`[data-playcontrol="${wid}-${vid}"]`, 'disabled', 'btn-warning-light')
        baseHtmlToolCase.set_attr(`[data-wordid="${wid}"]`, 'data-loaded_audi', 'true')
        if (!this.alreadywordids.includes(wid)) {
            this.alreadywordids.push(wid)
        }
        $(`#w${wid}`).attr('data-canplay', 'true');
    }

    audioonerror(wid_vindex) {
        console.log(`${wid_vindex} loaded of errer.`)
    }
}


export default new Main()