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
}


export default  new Main()