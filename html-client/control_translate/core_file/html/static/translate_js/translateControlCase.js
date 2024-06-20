import UserCase from "./UserCase.js"
import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseSettingCase from "./baseSettingCase.js"
import baseStrArrCase from "./baseStrArrCase.js"
import hasreadCase from "./hasreadCase.js"
import reviewCountCase from "./reviewCountCase.js"
import translateHtmlCase from "./translateHtmlCase.js"
import worddataProvider from "./worddataProvider.js"
import wordsInfoCase from "./wordsInfoCase.js"

class Main {
    origindata = null
    is_getgrouping = false

    get_like(ele) {
        ele = this.get_wordelement(ele)
        let word = this.get_wordbyelement(ele)
        let wordsort = this.get_originwordsort(word)
        let phonetic_ussort = this.get_originphoneticussort(word)
        let phonetic_length = this.get_originphoneticuslength(word)
        if (phonetic_length && phonetic_ussort && wordsort) {
            let wordliky = baseSettingCase.get_global_settings('settings.wordliky.value')
            let phoneticliky = baseSettingCase.get_global_settings('settings.phoneticliky.value')
            console.log(`wordliky`, wordliky)
            console.log(`phonetic_uslength`, phonetic_length)

            let word_length = word.length + Math.ceil((word.length * wordliky) / 100)
            let word_trimlength = Math.ceil((word.length * wordliky) / 100)
            let word_maxlength = word_length + word_length
            let word_trim = word.substr(0, word_trimlength)

            let phonetic_maxlength = phonetic_length + Math.ceil((phonetic_length * phoneticliky) / 100)
            let phonetic_trim = phonetic_ussort.substr(0, phonetic_length)
            let likely = {
                phonetic_length,
                phonetic_maxlength,
                phonetic_trim,
                word_maxlength,
                word_trim,
                word,
            }
            UserCase.authGet('get_likebyphonetic', likely).then((data) => {
                data = translateHtmlCase.get_grouptojson(data)
                console.log('get_likebyphonetic')
                console.log(data)
            })
            UserCase.authGet('get_likebyword', likely).then((data) => {
                data = translateHtmlCase.get_grouptojson(data)
                console.log('get_likebyword')
                console.log(data)
            })
        }
    }

    async get_groups() {
        let project_mode = UserCase.get_project_mode()
        UserCase.set_project_bar(project_mode)

        let result_data = await UserCase.authPost("get_groups", {})
        let groups_data
        try {
            result_data = result_data.data[0]
            groups_data = result_data.groups
        } catch (e) {
            console.log(result_data)
            console.log(e)
            alert("Error of getting groups.")
            result_data = null
            return
        }
        translateHtmlCase.create_groupsHTML(groups_data)
        this.set_groupinfo(groups_data)
        let gid = UserCase.get_currentgid()
        console.log('gid', gid)
        console.log('groups_data')
        console.log(groups_data)
        let useInData = await worddataProvider.getData(gid)
        console.log(`useInData`)
        console.log(useInData)
    }

    get_globalmap() {
        let globalmap = this.get_localstorage(`globalmap`)
        return globalmap
    }

    get_groupmap(globalmap) {
        if (!globalmap) globalmap = this.get_globalmap()
        globalmap = globalmap[13]
        return globalmap
    }

    get_dictionarymap(globalmap) {
        if (!globalmap) globalmap = this.get_globalmap()
        globalmap = globalmap[12]
        return globalmap
    }

    get_groupcursor(gid, globalmap) {
        if (!globalmap) globalmap = this.get_groupmap()
        if (gid) {
            let re = new RegExp(`(?<=[^\\d]${gid}\\|)(\\d+)`, 'g')
            globalmap = globalmap.match(re)
            if (!globalmap) {
                globalmap = 0
            } else {
                globalmap = globalmap[0]
            }
        }
        return globalmap
    }

    is_existgroup(gid) {
        let current_page = baseSettingCase.get_global_settings('group.current_page')
        if (!current_page[gid]) {
            return false
        }
        return true
    }

    get_allgroups() {
        return baseHtmlToolCase.queryElementAll(`[data-groupid]`)
    }

    get_groupelement(gid) {
        return baseHtmlToolCase.queryElement(`[data-groupid='${gid}']`)
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

    get_grouplinkedids(gid) {
        if (!gid) gid = this.get_deraultgid()
        let ele = this.get_groupelement(gid)
        if (ele) {
            let linkedids = ele.querySelector(`.linked_wordids`).innerHTML
            linkedids = linkedids.split(',')
            return linkedids
        } else {
            return []
        }
    }

    get_groupcount(gid) {
        if (!gid) gid = this.get_deraultgid()
        let ele = this.get_groupelement(gid)
        return ele.dataset.groupcount
    }

    get_cursorbymap(gid, groupmap) {
        if (!gid) gid = baseSettingCase.get_global_settings('group.current_id')
        if (!groupmap) groupmap = this.get_groupmap()
        let groupcursor = this.get_groupcursor(gid)
        return groupcursor
    }

    dictionarymap_parse(arr) {
        if (!arr) arr = this.get_dictionarymap()
        if (typeof arr == 'string') {
            arr = arr.split(',')
        }
        arr = arr.map(item => {
            let [id, timestamp] = item.split('|');
            let date = new Date(parseInt(timestamp) * 1000); // 乘以1000将秒转换为毫秒
            let formattedTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            return { id: id, time: formattedTime };
        });
        arr = arr.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        return arr
    }

    async get_wordsbygroup(group_id, limit, preload = false, callback) {
        if (this.is_getgrouping) {
            console.log('get_words by group requisting.')
            return
        }
        this.is_getgrouping = true
        group_id = baseStrArrCase.take_the_value(group_id, baseSettingCase.get_global_settings('group.current_id'))
        limit = baseStrArrCase.take_the_value(limit, this.get_grouplimit(group_id))
        console.log(`get_words by group start`)
        let groupname = this.get_groupname(group_id)
        if (!this.is_existgroup(group_id) || !groupname) {
            this.is_getgrouping = false
            alert('当前组不存在.')
            return
        }
        baseHtmlToolCase.setHtml('.current_group_tab',groupname)
        if (!preload) {
            baseHtmlToolCase.show(`#loader`,0.6)
        }
        let data = await UserCase.authPost("get_wordsbygroup", {
            group_id,
            load_external: group_id,
            // wordids,
            limit,
        })
        if (data.length == 0) {
            this.is_getgrouping = false
            console.log('not more data!')
            if (callback) callback(null)
        } else {
            this.is_getgrouping = false
            console.log(`words-group(gid:${group_id}) data:`)
            console.log(data)
            let group_data = baseStrArrCase.simplify_array(data)
            if (group_data.message == "No user") {
                this.is_getgrouping = false
                baseHtmlToolCase.hide(`#loader`)
                alert('当前用户数据不存在.')
                if (callback) callback(null)
            } else {
                if (preload) {
                    return callback(data)
                } else {
                    this.set_groupwords(data, group_id, preload, callback)
                }
            }
        }
    }

    set_groupwords(data, group_id, preload = false, callback = null) {
        data = baseStrArrCase.simplify_array(data)
        group_id = baseStrArrCase.take_the_value(group_id, baseSettingCase.get_global_settings('group.current_id'))
        baseSettingCase.set_global_settings(`group.current_id`, group_id)
        let group_map = data.group_map
        translateHtmlCase.init_publicgroupmap(group_map)
        let read_count = reviewCountCase.alculate_read_count(group_map)
        translateHtmlCase.create_groupwordsHTML(data, preload)
        baseHtmlToolCase.set_attr(".control-sidebar", "class", 'control-sidebar')
        let gcount = this.get_groupcount()
        reviewCountCase.set_readcount(gcount, read_count)
        wordsInfoCase.get_allwordeles()
        reviewCountCase.set_review_count()
        wordsInfoCase.set_allwordstatus()
        if (data.is_diff) {
            hasreadCase.submitHasread(data.diff)
        }
        // translateHtmlCase.set_pageprogress()
        baseHtmlToolCase.hide(`#loader`)
        if (callback) callback()
    }

    get_deraultgid() {
        return baseSettingCase.get_global_settings(`group.current_id`)
    }

    get_grouplimit(gid) {
        if (!gid) gid = this.get_deraultgid()
        let per_words = baseSettingCase.get_global_settings('settings.per_words.value')
        let page = 0
        if (gid) {
            let current_page = baseSettingCase.get_global_settings('group.current_page')
            page = current_page[gid].page
        }
        page = page * per_words
        return `${per_words},${page}`
    }

    set_groupinfo(data) {
        let group = baseSettingCase.get_global_settings(`group`)
        for (let item of data) {
            let group_id = item.id
                ;
            if (!group.current_id) {
                group.current_id = group_id
            }
            if (!group.current_page) {
                group.current_page = {}
            }
            if (!group.current_page[group_id]) {
                group.current_page[group_id] = {
                    page: 0
                }
            }
        }
        baseSettingCase.set_global_settings(`group`, group)
    }

    set_groupcurrentid(group_id) {
        let group = baseSettingCase.get_global_settings(`group`)
        group.current_id = group_id
        baseSettingCase.set_global_settings(`group`, group)
    }
}

export default new Main()