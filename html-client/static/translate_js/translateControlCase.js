import UserCase from "./UserCase.js"
import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseHttpCase from "./baseHttpCase.js"
import baseSettingCase from "./baseSettingCase.js"
import reviewCountCase from "./reviewCountCase.js"
import translateHtmlCase from "./translateHtmlCase.js"
import worddataProvider from "./worddataProvider.js"

class Main {
    origindata = null
    is_getgrouping = false

    // get_like(ele) {
    //     ele = this.get_wordelement(ele)
    //     let word = this.get_wordbyelement(ele)
    //     let wordsort = this.get_originwordsort(word)
    //     let phonetic_ussort = this.get_originphoneticussort(word)
    //     let phonetic_length = this.get_originphoneticuslength(word)
    //     if (phonetic_length && phonetic_ussort && wordsort) {
    //         let wordliky = baseSettingCase.get_global_settings('settings.wordliky.value')
    //         let phoneticliky = baseSettingCase.get_global_settings('settings.phoneticliky.value')
    //         console.log(`wordliky`, wordliky)
    //         console.log(`phonetic_uslength`, phonetic_length)

    //         let word_length = word.length + Math.ceil((word.length * wordliky) / 100)
    //         let word_trimlength = Math.ceil((word.length * wordliky) / 100)
    //         let word_maxlength = word_length + word_length
    //         let word_trim = word.substr(0, word_trimlength)

    //         let phonetic_maxlength = phonetic_length + Math.ceil((phonetic_length * phoneticliky) / 100)
    //         let phonetic_trim = phonetic_ussort.substr(0, phonetic_length)
    //         let likely = {
    //             phonetic_length,
    //             phonetic_maxlength,
    //             phonetic_trim,
    //             word_maxlength,
    //             word_trim,
    //             word,
    //         }
    //         UserCase.authGet('get_likebyphonetic', likely).then((data) => {
    //             data = translateHtmlCase.get_grouptojson(data)
    //             console.log('get_likebyphonetic')
    //             console.log(data)
    //         })
    //         UserCase.authGet('get_likebyword', likely).then((data) => {
    //             data = translateHtmlCase.get_grouptojson(data)
    //             console.log('get_likebyword')
    //             console.log(data)
    //         })
    //     }
    // }

    async getGroupsByCache(force = false) {
        let group = baseSettingCase.getLocalStorage(`GroupsByCache`)
        if (!group || force) {
            group = await baseHttpCase.getGroups()
            baseSettingCase.setLocalStorage(`GroupsByCache`, group)
        } else {
            console.log(`get Group By Cache.`)
        }
        return group
    }

    async change_group(gid) {
        let groups_data = await this.getGroupsByCache(true);
        if (!gid) {
            console.log(groups_data.data.dictiongroups)
            gid = groups_data.data.dictiongroups.data[0].id
        }
        UserCase.set_currentgid(gid)
        groups_data = groups_data.data.dictiongroups.data
        let project_mode = UserCase.get_project_mode()
        UserCase.set_project_bar(project_mode)
        translateHtmlCase.create_groupsHTML(groups_data)
        this.set_groupinfo(groups_data)
        let gInfo = this.get_groupinfo(gid, groups_data)
        let uid = UserCase.getUID()
        await worddataProvider.initGroupWordMap(uid,gid, gInfo)
        this.set_globalrequest_group(gInfo)
        await worddataProvider.ensureRenderedArrayData()
    }

    // async get_groups(reget = true) {
    //     baseHtmlToolCase.show(`#loader`)
    //     let groups_data = await this.getGroupsByCache(true);
    //     groups_data = groups_data.data
    //     if (!groups_data) {
    //         console.log(groups_data)
    //         alert("Error of getting groups.")
    //         return
    //     }
    //     console.log(groups_data)
    //     groups_data = groups_data.dictiongroups.data
    //     let project_mode = UserCase.get_project_mode()
    //     UserCase.set_project_bar(project_mode)
    //     translateHtmlCase.create_groupsHTML(groups_data)
    //     this.set_groupinfo(groups_data)
    //     let gid = UserCase.get_currentgid()
    //     console.log(`gid ${gid}`)
    //     let gInfo = this.get_groupinfo(gid, groups_data)
    //     let uid = UserCase.getUID()
    //     await worddataProvider.initGroupWordMap(uid, gInfo)
    //     baseHtmlToolCase.hide(`#loader`)
    //     this.set_globalrequest_group(gInfo)
    //     await worddataProvider.getData(gid, reget)
    // }

    set_globalrequest_group(gInfo) {
        let groupMapByGinfoWlinks = worddataProvider.getGroupMapByGinfoWlink()
        let read_count = worddataProvider.getReadStatistics()
        reviewCountCase.set_readcount(groupMapByGinfoWlinks.length, read_count)
        UserCase.set_currentgid(gInfo.id)
        baseHtmlToolCase.hide(`#loader`)
        $('.current_group_tab').text(gInfo.attributes.name)
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
                    page: 0,
                    ginfo: item
                }
            }
        }
        baseSettingCase.set_global_settings(`group`, group)
    }

    get_groupinfo(id, gData) {
        for (let item of gData) {
            if (item.id == id) {
                return item;
            }
        }
        return {};
    }

    set_groupcurrentid(group_id) {
        let group = baseSettingCase.get_global_settings(`group`)
        group.current_id = group_id
        baseSettingCase.set_global_settings(`group`, group)
    }
}

export default new Main()