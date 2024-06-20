import UserCase from "./UserCase.js";
import baseSettingCase from "./baseSettingCase.js";
import baseHtmlToolCase from "./baseHtmlToolCase.js";
import baseStrArrCase from "./baseStrArrCase.js";
import translateHtmlCase from "./translateHtmlCase.js";
import baseHttpCase from "./baseHttpCase.js";

class Main {
    wordDataInAscendingOrderOfTime = null
    groupMapByGinfoWlinks = []
    tempWordMap = null
    readStatistics = 0
    _preloadArray = [];
    _prerenderArray = [];
    _renderedArray = [];

    constructor() {
        this.preloadThreshold = this.getpreloadThreshold();
        this.dataInUse = [];
        this.dataInUseCache = [];//使用数据备份/假删备份
        this.renderedData = [];
        this.preloadData = [];
        this.dataPrepared = []
    }

    get per_words() {
        return baseSettingCase.get_global_settings(`settings.per_words.value`)
    }

    getpreloadThreshold() {
        let preloadThreshold = this.per_words / 2
        if (preloadThreshold < 1) preloadThreshold = 1
        return preloadThreshold
    }

    async fetchData(limit) {
        if (this.is_getgrouping) {
            console.log('get_words by group requisting.')
            return this.fetchingDataPromise;
        }
        let gid = UserCase.get_currentgid()
        console.log(`fetchData group_id ${gid}`)
        this.is_getgrouping = true
        limit = baseStrArrCase.take_the_value(limit, this.get_grouplimit(gid))
        let groupWordMap = this.getGroupWordMap(limit)
        let requestIds = this.extractIdsByMap(groupWordMap)
        let data = await baseHttpCase.fetchDictionariesByIds(requestIds)
        data = data.data.dictionaries
        let classificationWords = this.filterOutWordsByRequest(data)
        this.is_getgrouping = false
        return classificationWords.valid
    }

    async getDataAndConsum(id, force = false) {
        if (id) {
            if (force) {
                this.dataInUse = baseHtmlToolCase.removeEleOfArrayById(this.dataInUse, id, true)
                this.dataInUseCache = baseHtmlToolCase.removeEleOfArrayById(this.dataInUseCache, id, true)
            } else {
                let { arr, removedItem } = baseHtmlToolCase.removeArrayByIdAndReturn(this.dataInUse, id)
                this.dataInUse = arr
                this.dataInUseCache.push(removedItem)
            }
            console.log(`consumption id:${id},this.dataInUse.length${this.dataInUse}`)
        }
        if (this.dataInUse.length >= this.preloadThreshold) {
            return this.dataInUse
        }
        if (this.renderedData.length >= this.preloadThreshold) {
            this.dataInUse = this.dataInUse.concat(this.renderedData);
            this.renderedData = [];
            return this.dataInUse
        }
        if (this.preloadData.length >= this.preloadThreshold) {
            let renderedData = this.preloadData.slice(0, this.preloadThreshold);
            this.preloadData = this.preloadData.slice(this.preloadThreshold);
            await this.renderAndLoadImages(renderedData);
            this.dataInUse = this.dataInUse.concat(this.dataPrepared);
            this.dataPrepared = []
            return this.dataInUse
        }
        let limit = this.per_words + ',' + this.dataInUse.length + this.dataInUseCache.length + this.preloadData.length
        console.log(`limit `, limit)
        await this.getData(null, false, limit)
        return this.dataInUse
    }

    async getData(gid, force = false, limit) {
        console.log(`getData`)
        baseHtmlToolCase.show(`#loader`)
        this.ensureRenderedArrayData()
        baseHtmlToolCase.hide(`#loader`)
        return
        if (force) {
            this.dataInUse = baseHtmlToolCase.clearArrayAndRemoveElements(this.dataInUse)
            this.dataInUseCache = baseHtmlToolCase.clearArrayAndRemoveElements(this.dataInUseCache)
            this.renderedData = []
            $(translateHtmlCase.get_word_contianername()).html(``)
        }

        if (this.is_getgrouping) {
            return []
        }
        this.preloadData = await this.fetchData(gid, limit);
        await this.handleNewData();
        this.dataInUse = this.dataInUse.concat(this.dataPrepared);
        this.dataPrepared = []
        baseHtmlToolCase.hide(`#loader`)
        return this.dataInUse;
    }

    async checkAndUpdatePersonMap(wordByTime, gInfo, gid) {
        if (!Array.isArray(wordByTime.data) || wordByTime.data.length === 0) {
            try {
                let data = await baseHttpCase.fetchDictionariesByWords(gInfo.winclude, true);
                let classificationWords = this.filterOutWordsByRequest(data);
                let updateGroupMap = await baseHttpCase.createGroupMap(uid, gid, classificationWords.valid);
                return updateGroupMap;
            } catch (error) {
                console.error(error);
                return null;
            }
        } else {
            wordByTime = {
                data: wordByTime.data[0]
            }
            return wordByTime;
        }
    }

    consumeSingleData(wid) {
        console.log(`consumeSingleData ${this.dataInUse.length}`)
        this.dataInUse = baseHtmlToolCase.remoteEleOfArrayById(this.dataInUse, `w${wid}`, true)
        console.log(`dataInUse ${this.dataInUse.length}`)
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
            if (current_page[gid]) {
                page = current_page[gid].page
            }
        }
        page = page * this.per_words
        return `${this.per_words},${page}`
    }

    get_groupcount(gid) {
        if (!gid) gid = this.get_deraultgid()
        let ele = this.get_groupelement(gid)
        return ele.dataset.groupcount
    }

    async handleNewData() {
        let renderedLength = this.per_words - translateHtmlCase.getShowWordEles().length;
        if (renderedLength > this.preloadData.length) renderedLength = this.preloadData.length
        let renderedData = this.preloadData.slice(0, renderedLength);
        this.preloadData = this.preloadData.slice(renderedLength);
        console.log(`Preload data length after prerendering ${this.preloadData.length} as use ${renderedLength}`)
        await this.renderAndLoadImages(renderedData);
    }
    /**
     * 请完成，传入uid,gid, gInfo
     * 获取gInfo.attributes.wlink
     * 判断this.wordDataInAscendingOrderOfTime是否有值 ，如果没有获取baseSettingCase.getLocalStorage(`wordDataInAscendingOrderOfTime`)半赋值
     * 判断this.wordDataInAscendingOrderOfTime.gidCache 是否包含gid，如果不包含，调用 await baseHttpCase.getGroupMap(uid)为 gMap; 如何gMap.data为空，调用await baseHttpCase.createGroupMap(uid, gInfo)为gMap
     */
    async initGroupWordMap(uid, gid, gInfo) {
        let wlink = gInfo.attributes.wlink;
        if (!this.wordDataInAscendingOrderOfTime) {
            this.wordDataInAscendingOrderOfTime = baseSettingCase.getLocalStorage('wordDataInAscendingOrderOfTime');
        }
        if (!this.wordDataInAscendingOrderOfTime.gidCache.includes(gid)) {
            let gMap = await baseHttpCase.getGroupMap(uid);
            if (!gMap.data) {
                gMap = await baseHttpCase.createGroupMap(uid, gInfo);
            }
            this.setGroupMapToCache(gMap,gid)
        }
    }

    async initGroupWordMap(uid, gid, gInfo) {



        let wlink = gInfo.attributes.wlink

        let wordByTime = baseSettingCase.getLocalStorage(`wordDataInAscendingOrderOfTime`)


        if (!wordByTime || typeof wordByTime != 'object' || !wordByTime.group_map) {
            if (!this.wordDataInAscendingOrderOfTime) {
                let wordByTime = await baseHttpCase.getGroupMap(uid);
                if (!wordByTime.data) {
                    wordByTime = await baseHttpCase.createGroupMap(uid, gInfo);
                }
                this.setGroupMapToCache(wordByTime)
                this.setGroupMapByGinfoWlink(wlink)
            }
        } else {
            console.log('wordByTime By Cache')
            this.wordDataInAscendingOrderOfTime = wordByTime
        }
        let group_map = this.groupMapByGinfoWlinks
        let wids = this.extractIdsByMap(group_map)
        const widDiff = wlink.filter(item => !wids.includes(item));
        if (widDiff.length != 0) {
            wordByTime = await baseHttpCase.updateGroupMap(this.wordDataInAscendingOrderOfTime.id, group_map, widDiff);
            this.setGroupMapToCache(wordByTime.data.updateDictiongroupmap)
        }
        this.setGroupMapByGinfoWlink(wlink)
    }

    setGroupMapToCache(wordByTime,gid) {
        let group_all_map = this.sortByByReadTime(wordByTime.data.attributes.group_map)
        wordByTime = {
            id: wordByTime.data.id,
            group_all_map
        }
        this.wordDataInAscendingOrderOfTime = wordByTime
        baseSettingCase.setLocalStorage(`wordDataInAscendingOrderOfTime`, wordByTime)
    }

    async updateGroupMap() {
        let update = 0
        for (let i = 0; i < this.wordDataInAscendingOrderOfTime.group_all_map.length; i++) {
            let subArray = this.wordDataInAscendingOrderOfTime.group_all_map[i];
            let id = subArray[0];
            for (let j = 0; j < this.groupMapByGinfoWlinks.length; j++) {
                let targetSubArray = this.groupMapByGinfoWlinks[j];
                if (targetSubArray[0] == id) {
                    if (targetSubArray[1] != subArray[1]) {
                        update++
                        this.wordDataInAscendingOrderOfTime.group_all_map[i] = [...targetSubArray];
                    }
                    break;
                }
            }
        }
        // this.wordDataInAscendingOrderOfTime.group_all_map = this.sortByByReadTime(this.wordDataInAscendingOrderOfTime.group_all_map)
        let wordByTime = await baseHttpCase.updateGroupMap(this.wordDataInAscendingOrderOfTime.id, this.wordDataInAscendingOrderOfTime.group_all_map);
        console.log(`updateGroupMap : ${update}`)
        console.log(wordByTime)
        baseSettingCase.setLocalStorage(`wordDataInAscendingOrderOfTime`, this.wordDataInAscendingOrderOfTime)
        return wordByTime
    }

    getReadStatistics() {
        return this.readStatistics
    }

    setGroupMapByGinfoWlink(wlink) {
        this.readStatistics = 0
        let group_map = this.wordDataInAscendingOrderOfTime.group_all_map.filter(subArray => {
            if (subArray[1] > 0) {
                this.readStatistics++
            }
            return wlink.includes(subArray[0])
        });
        this.groupMapByGinfoWlinks = group_map
    }

    getGroupMapByGinfoWlink() {
        return this.groupMapByGinfoWlinks
    }

    sortByByReadTime(groupMap) {
        groupMap.sort((a, b) => a[1] - b[1]);
        return groupMap;
    }

    updateWordReadCount(id) {
        // id = parseInt(id)
        let queryAt = false
        for (let i = 0; i < this.groupMapByGinfoWlinks.length; i++) {
            let subArray = this.groupMapByGinfoWlinks[i];
            if (subArray[0] == id) {
                subArray[1] = baseStrArrCase.create_timestamp();
                subArray[2]++;
                this.groupMapByGinfoWlinks.splice(i, 1);
                this.groupMapByGinfoWlinks.push(subArray);
                queryAt = true
                return
            }
        }
        if (!queryAt) {
            this.groupMapByGinfoWlinks.push(
                [
                    id, baseStrArrCase.create_timestamp(), 1
                ]
            );
        }
    }

    searchWordReadCount(id) {
        id = parseInt(id)
        for (let subArray of this.groupMapByGinfoWlinks) {
            if (subArray[0] == id) {
                return subArray
            }
        }
        return [id, 0, 0]
    }

    extractIdsByMap(groupMap) {
        return groupMap.map(subArray => subArray[0]);
    }

    getGroupWordMap(limit) {
        this.groupMapByGinfoWlinks = this.sortByByReadTime(this.groupMapByGinfoWlinks)
        if (limit) {
            limit = limit.split(/[\,\.]+/)
            const startIndex = parseInt(limit[1], 10);
            let length = parseInt(limit[0], 10) + startIndex;
            if (length > this.groupMapByGinfoWlinks.length - 1) {
                length = this.groupMapByGinfoWlinks.length - 1
            }
            if (startIndex >= length) {
                return [this.groupMapByGinfoWlinks[startIndex]]
            }
            let newArr = [];
            for (let i = startIndex; i < length; i++) {
                newArr.push(this.groupMapByGinfoWlinks[i]);
            }
            return newArr;
        }
        return this.groupMapByGinfoWlinks
    }

    filterOutWordsByCurGroupMap(wordMap) {
        this.tempWordMap = wordMap;
        const wordsArray = [];
        for (let i = 0; i < wordMap.length; i++) {
            wordsArray.push(wordMap[i].word);
        }
        return wordsArray;
    }

    filterOutWordsByRequest(wordMap) {
        let result = {
            valid: [],
            invalid: []
        }
        wordMap.data.map(obj => {
            if (!obj.attributes.is_delete && !obj.attributes.namespace) {
                result.valid.push(obj)
            } else {
                result.invalid.push(obj)
            }
        });
        return result;
    }

    extractGroupMap(groups_map) {
        if (Array.isArray(groups_map)) {
            let result = groups_map.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
            return result;
        } else {
            console.log('groups_map.data is not an array or is empty');
            return []
        }
    }

    async renderAndLoadImages(data) {
        console.log(`data`, data)
        data.forEach(item => {
            item.attr = this.searchWordReadCount(item.id);
        });
        let renderedData = translateHtmlCase.create_groupwordsHTML(data);
        let promises = renderedData.map((item, index) => {
            let element = $(item.selector);
            return new Promise(resolve => {
                let audio = element.find('audio[data-index="0"]');
                if (audio.length) {
                    let infoString = audio.data('audioid');
                    let infoArray = infoString.split(/[\-\,]+/);
                    let wid = infoArray[0];
                    let iid = infoArray[1];
                    audio.find('source').on('error', () => {
                        this.showWordEle(element, wid);
                        console.log('error', audio);
                        resolve();
                    });
                    audio.on('canplay', () => {
                        this.showWordEle(element, wid, true);
                        this.audiooncanplay(wid, iid);
                        resolve();
                    });
                } else {
                    console.log(element);
                    this.showWordEle(element);
                    resolve();
                }
            });
        });
        this._prerenderArray.concat(renderedData)
        return await Promise.all(promises);
    }

    audiooncanplay(wid, iid) {
        $(`[data-playcontrol="${wid}-${iid}"] i`).addClass(`text-danger`)
    }

    showWordEle(item, wid, isCanPlay = false) {
        if (translateHtmlCase.checkWordDisplayThreshold()) {
            item.removeAttr('style');
            if (isCanPlay) {
                let { arr, removedItem } = baseHtmlToolCase.removeArrayByIdAndReturn(this.renderedData, wid)
                this.renderedData = arr
                this.dataPrepared.push(removedItem);
            }
        }
    }

    async ensurePreloadArrayData(requiredAmount) {
        const shortage = this.per_words - this._preloadArray.length;
        const len = requiredAmount + shortage
        if (len) {
            const limit = `${requiredAmount + shortage}.0`;
            let data = await this.fetchData(limit);
            this._preloadArray = this._preloadArray.concat(data.slice(0, shortage + requiredAmount));
        }
        return this._preloadArray.splice(0, requiredAmount)
    }

    async renderAndLoadImagesToPrerender(len) {
        const data = await this.ensurePreloadArrayData(len)
        await this.renderAndLoadImages(data);
    }

    updatePreloadArray() {

        console.log(this._prerenderArray)
        this._prerenderArray.forEach((item, index) => {
            console.log(item)
            const element = $(item.selector);
            element.attr('data-prerender', 'false');
            this._prerenderArray[index] = null;
            this._renderedArray.push(item)
        });
        this._prerenderArray = this._prerenderArray.filter(item => item !== null);
    }

    async ensureRenderedArrayData() {
        const shortage = this.getRenderedAvailableSpace() - this._prerenderArray.length;
        if (shortage <= 0) {
            this.updatePreloadArray();
        } else {
            console.log(`renderAndLoadImagesToPrerender ${shortage}`)
            await this.renderAndLoadImagesToPrerender(shortage);
            this.updatePreloadArray();
        }
        return this._prerenderArray
    }

    async fillPrerenderArray() {
        if (this.per_words <= this.per_words / 2) {
            const requiredAmount = this.getPrerenderAvailableSpace();
            await this.renderAndLoadImagesToPrerender(requiredAmount);
        }
    }

    getRenderedWords() {
        let container = $('#wordbox_contents_html');
        let nonPrerenderedDivs = container.children('div[data-prerender=false]');
        return nonPrerenderedDivs;
    }

    getPreenderedWords() {
        let container = $('#wordbox_contents_html');
        let nonPrerenderedDivs = container.children('div[data-prerender=true]');
        return nonPrerenderedDivs;
    }

    getLoadActualSum() {
        return this._preloadArray.length + this._prerenderArray.length + this._renderedArray.length;
    }

    getLoadDefaultSum() {
        return this.per_words + (this.per_words / 2) + this.per_words;
    }

    isPreloadFull() {
        return this._preloadArray.length >= this.per_words;
    }

    isPrerenderFull() {
        return this._prerenderArray.length >= (this.per_words / 2);
    }

    isRenderedFull() {
        return this._renderedArray.length >= this.per_words;
    }

    getPreloadAvailableSpace() {
        return this.per_words - this._preloadArray.length;
    }

    getPrerenderAvailableSpace() {
        return (this.per_words / 2) - this._prerenderArray.length;
    }

    getRenderedAvailableSpace() {
        return this.per_words - this._renderedArray.length;
    }
}

export default new Main()
