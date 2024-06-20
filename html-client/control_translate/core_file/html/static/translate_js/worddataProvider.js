import UserCase from "./UserCase.js";
import baseSettingCase from "./baseSettingCase.js";
import baseHtmlToolCase from "./baseHtmlToolCase.js";
import baseStrArrCase from "./baseStrArrCase.js";
import translateHtmlCase from "./translateHtmlCase.js";
import reviewCountCase from "./reviewCountCase.js";
import wordsInfoCase from "./wordsInfoCase.js";

class Main {
    constructor() {
        this.preloadThreshold = this.getpreloadThreshold();
        this.dataInUse = [];
        this.renderedData = [];
        this.preloadData = [];
        this.dataPrepared = []
    }

    get_per_words() {
        return baseSettingCase.get_global_settings(`settings.per_words.value`)
    }

    getpreloadThreshold() {
        let preloadThreshold = this.get_per_words() / 2
        if (preloadThreshold < 1) preloadThreshold = 1
        return preloadThreshold
    }

    async fetchData(group_id, limit) {
        if (this.is_getgrouping) {
            console.log('get_words by group requisting.')
            return this.fetchingDataPromise;
        }
        if (!group_id) {
            group_id = UserCase.get_currentgid()
        }
        this.is_getgrouping = true
        group_id = baseStrArrCase.take_the_value(group_id, baseSettingCase.get_global_settings('group.current_id'))
        limit = baseStrArrCase.take_the_value(limit, this.get_grouplimit(group_id))
        console.log(`fetchData start`)
        let groupname = this.get_groupname(group_id)
        if (!this.is_existgroup(group_id) || !groupname) {
            this.is_getgrouping = false
            alert('当前组不存在.')
            return {}
        }
        baseHtmlToolCase.setHtml('.current_group_tab', groupname)

        this.fetchingDataPromise = (async () => {
            // fetchData 的主体代码...
            let data = await UserCase.authPost("get_wordsbygroup", { group_id, load_external: group_id, limit });
            this.is_getgrouping = false;
            this.fetchingDataPromise = null;  // 重置 Promise 变量
            return data;
        })();
        return this.fetchingDataPromise;
    }

    async getData() {
        if (this.dataInUse.length < this.preloadThreshold) {
            if (this.renderedData.length >= this.preloadThreshold) {
                this.dataInUse = this.dataInUse.concat(this.renderedData);
                this.renderedData = [];
            } else if (this.preloadData.length >= this.preloadThreshold) {
                let renderedData = this.preloadData.slice(0, this.preloadThreshold);
                this.preloadData = this.preloadData.slice(this.preloadThreshold);
                await this.renderAndLoadImages(renderedData);
            } else {
                if (this.is_getgrouping) {
                    return null
                }
                const newData = await this.fetchData();
                let data = newData.data;
                data = data[0];
                this.preloadData = data.group_words;
                let group_map = data.group_map;
                this.set_group_maps(group_map);
                await this.handleNewData();
            }
        }
        this.dataInUse = this.dataInUse.concat(this.dataPrepared);
        this.dataPrepared = []
        return this.dataInUse;
    }

    consumeSingleData(wid) {
        this.dataInUse = baseHtmlToolCase.remoteEleOfArrayByData(this.dataInUse, `wordid`, wid)
        console.log(`consumeSingleData`,wid)
        console.log(this.dataInUse)
        this.getData()
    }

    is_existgroup(gid) {
        let current_page = baseSettingCase.get_global_settings('group.current_page')
        if (!current_page[gid]) {
            return false
        }
        return true
    }

    get_groupname(gid) {
        if (!gid) gid = this.get_deraultgid()
        let ele = this.get_groupelement(gid)
        if (ele) {
            let group_name = ele.querySelector(`.hover-primary`).innerHTML
            return group_name
        } else {
            return null
        }
    }

    get_deraultgid() {
        return baseSettingCase.get_global_settings(`group.current_id`)
    }

    get_groupelement(gid) {
        return baseHtmlToolCase.queryElement(`[data-groupid='${gid}']`)
    }

    get_grouplimit(gid) {
        if (!gid) gid = this.get_deraultgid()
        let page = 0
        if (gid) {
            let current_page = baseSettingCase.get_global_settings('group.current_page')
            page = current_page[gid].page
        }
        page = page * this.get_per_words()
        return `${this.get_per_words()},${page}`
    }

    set_group_maps(group_map) {
        translateHtmlCase.init_publicgroupmap(group_map)
        let read_count = reviewCountCase.alculate_read_count(group_map)
        let gcount = this.get_groupcount()
        reviewCountCase.set_readcount(gcount, read_count)
    }

    get_groupcount(gid) {
        if (!gid) gid = this.get_deraultgid()
        let ele = this.get_groupelement(gid)
        return ele.dataset.groupcount
    }

    async handleNewData() {
        console.log(`handleNewData`)
        let renderedLength = this.get_per_words() - translateHtmlCase.getShowWordEles().length;
        console.log(`renderedLength`, renderedLength)
        if (renderedLength > this.preloadData.length) renderedLength = this.preloadData.length
        let renderedData = this.preloadData.slice(0, renderedLength);
        this.preloadData = this.preloadData.slice(renderedLength);
        await this.renderAndLoadImages(renderedData);
    }

    async renderAndLoadImages(data) {
        const dataeles = translateHtmlCase.create_groupwordsHTML(data)
        this.renderedData = [...dataeles];
        const promises = dataeles.map((item, index) => {
            return new Promise(resolve => {
                let audio = item.find('audio[data-index="0"]')
                let infoString = audio.data('audioid');
                let infoArray = infoString.split(/[-,]+/);
                let wid = infoArray[0]
                let iid = infoArray[1]
                audio.find('source').on('error', () => {
                    console.log('error', audio)
                    resolve();
                });
                audio.on('canplay', () => {
                    if (translateHtmlCase.checkWordDisplayThreshold()) {
                        item.removeAttr('style');
                        this.renderedData = baseHtmlToolCase.remoteEleOfArrayByData(this.renderedData, 'wordid', wid)
                        this.dataPrepared.push(item);
                    }
                    wordsInfoCase.audiooncanplay(wid, iid)
                    resolve();
                });
            });
        });
        await Promise.all(promises);
    }

    prerender_to_render() {
        const dataeles = [...this.renderedData];
        let alreadyWords = translateHtmlCase.getShowWordEles()
        dataeles.map((item, index) => {
        });
    }
}

export default new Main()
