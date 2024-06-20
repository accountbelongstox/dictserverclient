import UserCase from "./UserCase.js"
import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseSettingCase from "./baseSettingCase.js"
import baseStrArrCase from "./baseStrArrCase.js"
import translateHtmlCase from "./translateHtmlCase.js"

class Main{
    alculate_read_count(group_map) {
        let read_count = 0
        group_map = baseStrArrCase.take_the_value(group_map , translateHtmlCase.get_publicgroupmap())
        for (let key in group_map) {
            let map = group_map[key]
            if (map.read_time) {
                read_count++
            }
        }
        return read_count
    }

    set_reviewscount(counts) {
        if (!counts) counts = baseSettingCase.get_global_settings(`reviewlist.count`)
        let count_num = 0
        for (let read_time in counts) {
            let count = counts[read_time]
            count_num += count
        }
        baseHtmlToolCase.queryElement('#reviews-count').innerHTML = `(${count_num})`
    }

    set_reviewhtmlall(counts) {
        if (!counts) counts = baseSettingCase.get_global_settings(`reviewlist.count`)
        let html = ``
        for (let time in counts) {
            let count = counts[time]
            let review_html = this.add_reviewhtml(count, time, true)
            if (review_html) {
                html += review_html
            }
        }
        if (html){
            baseHtmlToolCase.insertElement(html,'.review-list')
        }
        this.set_reviewscount(counts)
    }

    clear_reviewhtml() {
        baseHtmlToolCase.setHtml('.review-list',``)
    }

    add_reviewhtml(count, time, return_html = false) {
        let review_class = `review-${time}`
        let reviewtime_class = `reviewtime-${time}`
        let review_item = baseHtmlToolCase.queryElement(`.${review_class}`)
        if (review_item) {
            if (!count) {
                baseSettingCase.set_global_settings(`reviewlist.count.${time}`, count)
                review_item.remove()
                return null
            }
            baseHtmlToolCase.queryElement(`.${reviewtime_class}`).innerHTML = `[${count}]`
            baseHtmlToolCase.queryElement(`.${review_class}`).style.display = 'block'
            return null
        }
        if (!count) {
            return null
        }
        let count_text = ' - '
        let display = 'none'
        if (count) {
            count_text = `[${count}]`
            display = 'block'
        }
        let html = `<li class="${review_class}" style='display:${display}'>
                <a href="javascript:;" data-readtime="${time}" onclick="window.MyDict.get_reviewgroup(this.dataset.readtime)">
                    <i class="fa fa-users text-info"></i> ${time} <span style="color:red;" class="${reviewtime_class}">${count_text}</span>
                </a>
            </li>`
        if (return_html) {
            return html
        }
        baseHtmlToolCase.insertElement(html,'.review-list')
    }

    set_readcount(count,read_count) {
        let read_allrate = 0
        let unread_count = count - read_count
        if (read_count < 0) read_count = 0
        if (read_count > count) read_count = count
    
        let ele = baseHtmlToolCase.queryElement(`.allreadedcount`)
        if (ele) {
            ele.style.width = `${read_allrate}%`
        }
        ele = baseHtmlToolCase.queryElement(`.word_count`)
        if (ele) {
            ele.innerHTML = count
        }
        ele = baseHtmlToolCase.queryElement(`.unread_count`)
        if (ele) {
            ele.innerHTML = unread_count
        }
    }

    get_reviewgroup(read_time) {
        let limit = this.get_grouplimit()
        UserCase.authGet(`get_review`, { read_time, limit }).then((data) => {
            let group_id = baseSettingCase.get_global_settings("group.current_id")
            let count
            try {
                count = data.data.length
            } catch (e) {
                console.log(e)
            }
            if (!count) count = 0
            this.add_reviewhtml(count, read_time)
            this.set_groupwords(data, group_id)
            this.scroll_top()
        })
    }


    set_review_count() {
        let gid = baseSettingCase.get_global_settings("group.current_id")
        let c_timastamp = baseStrArrCase.date_totimestamp()
        let day = 60 * 60 * 24 * 1000
        let max_reviewday = c_timastamp - day * baseSettingCase.get_global_settings(`settings.reviewday.value`)
        let counts = {}

        let request = 0
        let response = 0

        this.set_reviewhtmlall()
        let continue_getreviewcount = () => {
            if (c_timastamp <= max_reviewday || this.is_getgrouping) {
                return
            }
            c_timastamp -= day
            let read_time = baseStrArrCase.timestamp_todate(c_timastamp, 'Y-M-D')
            let is_noreview = baseSettingCase.get_global_settings(`reviewlist.noreview.${read_time}`)
            let count = baseSettingCase.get_global_settings(`reviewlist.count.${read_time}`)
            if (is_noreview || count) {
                this.add_reviewhtml(count, read_time)
                continue_getreviewcount()
            }else{
                request++
                UserCase.authGet("get_review_count", {
                    gid,
                    read_time,
                }).then((result_data) => {
                    result_data = result_data.data
                    console.log(`result_data`,result_data)
                    let count = 0
                    if (Array.isArray(result_data)) {
                        count = result_data[0]
                    }
                    this.add_reviewhtml(count, read_time)
                    baseSettingCase.set_global_settings(`reviewlist.count.${read_time}`, count)
                    if (count > 0) {
                        counts[read_time] = count
                    } else {
                        baseSettingCase.set_global_settings(`reviewlist.noreview.${read_time}`, true)
                    }
                    response++
                    if (response == request) {
                        baseSettingCase.set_global_settings(`reviewlist.count`, null)
                        Object.keys(counts).sort((a, b) => {
                            
                            b = baseStrArrCase.date_totimestamp(b)
                            a = baseStrArrCase.date_totimestamp(a)
                            return b - a
                        })
                        baseSettingCase.set_global_settings(`reviewlist.count`, counts)
                        this.set_reviewhtmlall(counts)
                    }
                    if (c_timastamp > max_reviewday && !this.is_getgrouping) {
                        setTimeout(() => {
                            continue_getreviewcount()
                        }, 200)
                    }
                })
            }
        }
        continue_getreviewcount()
    }

}


export default  new Main()