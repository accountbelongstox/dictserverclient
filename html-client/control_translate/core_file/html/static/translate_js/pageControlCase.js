import baseHtmlToolCase from "./baseHtmlToolCase.js"
import baseSettingCase from "./baseSettingCase.js"
import translateControlCase from "./translateControlCase.js"

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
        translateControlCase.get_wordsbygroup()
    }

    next_page_group() {
        let gid = translateControlCase.get_deraultgid()
        let page = this.get_currentpage(gid)
        let max_page = translateControlCase.get_groupcount()
        max_page = max_page / baseSettingCase.get_global_settings('settings.per_words.value')
        max_page = Math.ceil(max_page)
        if (page >= max_page) {
            alert(`already is the last page`)
            return
        }
        baseSettingCase.set_global_settings(`group.current_page.${gid}.page`, ++page)
        translateControlCase.get_wordsbygroup()
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

    reset_touchmove() {
        let contentTop = 0; // 记录要滚动元素的top值，默认情况为0，因为默认显示时，内容的头部时紧挨着容器的
        const getTouchObj = (event) => ((touches) => ('0' in touches ? touches[0] : null))(event.targetTouches || event.originalEvent.targetTouches);
        const windowHeight = window.innerHeight * 0.8 * 0.786; // 滚动元素的可显示部分的高度，这个值通常都比滚动部分的高度小，不然就不需要滚动显示了。
        const getPos = (touchObj) => ({ x: touchObj.pageX, y: touchObj.pageY, time: new Date() });
        const getOffsetY = (start, endPos) => endPos.y - start;
        const getScrollEl = baseHtmlToolCase.queryElement('.current_group_tab')
        const getContentHeight = () => getScrollEl.height(); // 滚动元素的高度
        const getRealOffset = (offset, top) => {
            if (offset > 0) { // 处理下滑
                if (offset + top <= 0) return offset; // 下滑的距离没有超出顶部
                return -top; // 下滑的距离超出了顶部
            }
            if (offset < 0) { // 处理上滑
                if (Math.abs(offset) + Math.abs(top) + windowHeight <= getContentHeight()) return offset; // 上滑的距离没有超出底部
                return -(getContentHeight() - Math.abs(top) - windowHeight); // 上滑的距离超出了底部
            }
            return 0;
        };
        let startY = 0;
        getScrollEl.on('touchstart', (e) => { // 监听记录滑动的开始Y坐标
            startY = getPos(getTouchObj(e)).y;
        });
        getScrollEl.on('touchmove', (e1) => {
            ((offsetY) => {
                const offset = getRealOffset(offsetY, contentTop);
                if (Math.abs(offset) > 1) {
                    contentTop += offset;
                    getScrollEl.css('transform', `matrix(1, 0, 0, 1, 0, ${contentTop})`);
                }
            })(getOffsetY(startY, getPos(getTouchObj(e1))));
            startY = getPos(getTouchObj(e1)).y; // 更新当前的滑动Y坐标
        });
    }
}


export default  new Main()