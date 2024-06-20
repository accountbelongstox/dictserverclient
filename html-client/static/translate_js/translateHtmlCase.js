import UserCase from "./UserCase.js";
import baseHtmlToolCase from "./baseHtmlToolCase.js";
import baseSettingCase from "./baseSettingCase.js";
import baseStrArrCase from "./baseStrArrCase.js";
const NASSTATICURL = `https://nas.static.local.12gm.com:999/static_src/dictionary`
class Main {
    current_group_id = null
    public_groupmap = {}
    wordcontaner_token = `data-word-container`
    pre_render_height = 1

    create_groupsHTML(groups_data) {
        let group_html = "";
        for (let item of groups_data) {
            let group_id = item.id;
            if (!$(`[data-groupid="${group_id}"]`).length) {
                let
                    group_name = item.attributes.name,
                    group_language = 'En',
                    group_last_time = item.attributes.publishedAt,
                    group_count = item.attributes.wcount,
                    linked_wordids = item.id;
                group_html += `
                    <div class="media px-0" data-groupid="${group_id}" data-groupcount="${group_count}"  data-lasttime="${group_last_time}" data-languge="${group_language}" onclick="window.MyDict.event('change_group',${group_id})" >
                      <span class="linked_wordids" style="display:none;">${linked_wordids}</span>
                        <a class="avatar avatar-sm" style="margin:0px;" href="javascript:">
                        <img src="static/picture/cor-logo-3.png" alt="${group_name}">
                      </a>
                      <div class="media-body"  style="margin:0 0 0 0">
                        <p class="font-size-12">
                          <a class="hover-primary" href="javascript:">${group_name}</a>
                        </p>
                        <p>
                        <p class="font-size-10"><code>${group_language}</code>, <code>${group_count}</code> <span class="font-size-10">${group_last_time}</span></p>
                      </div>
                    </div>
                    `;
            }
        }
        $('.group_list_loader').remove()
        baseHtmlToolCase.addHtml('.group_list_contianer',group_html)
    }

    get_word_contianername() {
        return "#wordbox_contents_html"
    }

    create_groupwordsHTML(data, pre_render) {
        let project_mode = UserCase.get_project_mode()
        let brief_mode = UserCase.get_brief_mode()

        let container_selector = this.get_word_contianername()
        let wordTheGroupEles = []
        let wordelehtml = ``
        data.forEach((item, index) => {
            wordelehtml += this.create_translationHTML(pre_render, item, index, project_mode, brief_mode)
            wordTheGroupEles.push({
                id: parseInt(item.id),
                selector: `#w${item.id}`
            })
        })
        baseHtmlToolCase.addHtml(container_selector, wordelehtml)
        return wordTheGroupEles
    }

    create_translationHTML(pre_render, item, index, project_mode, brief_mode) {
        let
            id = item.id,
            attr = item.attr,
            attributes = item.attributes,
            word = attributes.word,
            read_time = attr[1] ? baseStrArrCase.timestamp_todate(attr[1]) : ``,
            word_id = baseStrArrCase.create_id(id),
            // read = item.read,
            word_json = attributes.translation,
            word_index = index + 1
            ;
        let advanced_translate = this.get_word_propertytounicode(word_json, "advanced_translate"),
            advanced_translate_type = this.get_word_propertytounicode(word_json, "advanced_translate_type"),
            phonetic_symbol = this.get_word_propertytounicode(word_json, "phonetic_symbol"),
            plural_form = this.get_word_propertytounicode(word_json, "plural_form"),
            sample_images = this.get_word_propertytounicode(word_json, "sample_images"),
            synonyms = this.get_word_propertytounicode(word_json, "synonyms"),
            synonyms_type = this.get_word_propertytounicode(word_json, "synonyms_type"),
            voice_files = this.get_word_propertytounicode(word_json, "voice_files"),
            word_translation = this.get_word_propertytounicode(word_json, "word_translation", "translate_text", [])
            ;
        word = this.is_webtranslate(word, word_translation)
        word = baseHtmlToolCase.htmlDecode(word)
        let translation_html = ""
        if (!UserCase.is_testmode()) {
            translation_html = this.create_translation_html(word, word_translation)
        } else {
            let test_translation_htmls = this.get_test_alternatives_anser(word, group_data, word_id)
            let anser_translation_html = this.create_testtranslation_html(word, word_translation, word_id)
            test_translation_htmls.push(anser_translation_html)
            test_translation_htmls = test_translation_htmls.sort(() => Math.random() - 0.5);
            translation_html = test_translation_htmls.join("")
            translation_html = `
                <div class="demo-radio-button">
                ${translation_html}
                </div>
                `
        }
        let phonetic_symbol_html = this.create_phonetic_symbol_html(id, voice_files)
        let sampleimages_html = this.create_sampleimages_html(word, sample_images)
        let haveread_html = this.create_haveread_html(word, id, word_translation, read_time)
        let advanced_translate_html = ``
        let synonyms_html = ``
        let plural_html = ``
        if (!brief_mode && !project_mode) {
            // haveread_html = this.create_haveread_html(word, word_translation)
            advanced_translate_html = this.create_advanced_html(word, word_id, advanced_translate_type, advanced_translate)
            synonyms_html = this.create_synonyms_html(word, word_id, synonyms_type, synonyms)
            plural_html = this.create_plural_html(plural_form)
        }
        return this.create_wordbox_html(
            word,
            word_id,
            phonetic_symbol_html,
            translation_html,
            sampleimages_html,
            advanced_translate_html,
            synonyms_html,
            plural_html,
            haveread_html,
            word_index,
            id,
            pre_render,
        )
    }

    get_test_alternatives_anser(word, group_data, word_id) {
        let other_words = this.get_wordsbyrandom(3, group_data, word)
        let translation_html = []
        other_words.forEach((worditem, index) => {
            let word_json = worditem.translate_bing
            let other_translation = this.get_word_propertytounicode(word_json, "word_translation", "translate_text", [])
            let one_translation = this.get_wordsbyrandom(1, other_translation)
            let other_html = this.create_testtranslation_html(null, one_translation, word_id)
            translation_html.push(other_html)
        })
        return translation_html
    }

    get_wordsbyrandom(n, arr, targetWord) {
        let result = [];
        if (arr.length == 0) {
            return result
        }

        while (result.length < n) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            const randomObj = arr[randomIndex];
            if (!result.includes(randomObj)) {
                if (targetWord) {
                    if (randomObj.word !== targetWord) {
                        result.push(randomObj);
                    }
                } else {
                    result.push(randomObj);
                }
            }
        }
        return result
    }

    create_wordid(wid) {
        return `w${wid}`
    }

    getShowWordEles() {
        var filteredElements = $('.data-word-container').filter(function () {
            return $(this).height() <= 2;
        });
        return filteredElements
    }

    checkWordDisplayThreshold() {
        let per_words = baseSettingCase.get_global_settings(`settings.per_words.value`)
        // console.log(`this.getShowWordEles().length`)
        // console.log(this.getShowWordEles().length)
        return per_words > this.getShowWordEles().length
    }

    create_wordbox_html(
        word,
        word_id,
        phonetic_symbol_html,
        translation_html,
        sampleimages_html,
        advanced_translate_html,
        synonyms_html,
        plural_html,
        haveread_html,
        word_index,
        id,
        pre_render
    ) {
        if (
            !phonetic_symbol_html &&
            !translation_html &&
            !sampleimages_html &&
            !advanced_translate_html &&
            !synonyms_html &&
            !plural_html &&
            !haveread_html
        ) {
            //advanced_translate_html = `No translations found`
        }
        let preload_style = `style="height:${this.pre_render_height}px;overflow:hidden;margin:0;padding:0;"`
        let preload_data = false
        if (pre_render) {
            preload_data = true
        }
        let title_class = this.get_wordtitleclass()
        let contaner_id = this.create_wordid(id)
        let html = `
        <div class="col-12" id="${contaner_id}" ${this.wordcontaner_token} data-word="${word}" data-index="${word_index}" data-wordid="${id}" data-prerender="true" ${preload_style}>
          <div class="box box-default">
            <div class="box-header-translate">
              <h5 class="${title_class} word_h5">${word}</h5>
              ${phonetic_symbol_html}
              ${translation_html}
              ${plural_html}
            </div>
            <!-- /.box-header -->
            <div class="box-body">
                ${sampleimages_html}
                ${synonyms_html}
                ${advanced_translate_html}
                ${haveread_html}
                <!-- Nav tabs -->
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->
        </div>
        `
        return html
    }

    create_haveread_html(word, id, word_translation, last_readtime) {
        let html = ``
        if (UserCase.is_testmode()) {
            return html
        }
        if (!last_readtime || last_readtime.startsWith('1970')) {
            last_readtime = ''
        }
        if (last_readtime) {
            last_readtime = `<p style="color: #737373;">last-read-time: ${last_readtime}</p>`
        }
        html += `
            <div class="box-footer" style="padding:0px;">
                <button onclick="window.MyDict.event('submit_haveread','${id}')" class="btn btn-success btn-flat"><i class="fa fa-check-circle" aria-hidden="true"></i> </button>
                <!-- <button onclick="window.MyDict.event('submit_haveread','${id}')" class="btn btn-flat btn-secondary"><i class="fa fa-coffee" aria-hidden="true"></i> </button> -->
                <button onclick="window.MyDict.event('get_like',this)" class="btn btn-flat btn-secondary"><i class="fa fa-external-link-square" aria-hidden="true"></i>Like</button>
                ${last_readtime}
            </div>
            `
        return html
    }

    create_plural_html(plural_form) {
        let html_tab = ""
        let html = ""

        if (UserCase.is_testmode()) {
            return html
        }
        let plural_html = ""

        plural_form.forEach((item, index) => {
            let delimiter = item.indexOf("Form") != -1
            if (delimiter) {
                if (plural_html) {
                    html_tab += `
                    <code >${plural_html}</code> 
                    `
                    plural_html = ""
                }
                plural_html = `<span class="text-muted">${item}</code>`
            } else {
                plural_html += ` ${item}`
            }
        })
        if (html_tab) {
            html = `
            <h6 class="box-subtitle">
                ${html_tab}
            </h6>
            `
        }
        return html
    }

    create_synonyms_html(word, word_id, advanced_translate_type, advanced_translate) {
        let html_tab = ""
        let html = ""
        if (UserCase.is_testmode()) {
            return html
        }
        let tab_content_html = ""
        advanced_translate_type.forEach((item, index) => {
            let random_string = baseStrArrCase.gen_randomstring(32)
            word_id = `tab_${word_id}${random_string}`
            item = baseHtmlToolCase.split_html(item)
            let active_class = ""
            if (index == 0) {
                active_class = "active"
            }
            html_tab += `
                    <li class="nav-item"> <a class="nav-link ${active_class}" data-toggle="tab" href="#${word_id}" role="tab">
                        <span class="hidden-sm-up">
                        </span> <span class="">${item}</span></a> 
                    </li>
            `
            let advanced_translate_item = advanced_translate[index]
            if (!advanced_translate_item) {
                advanced_translate_item = []
            }
            let advanced_translate_html = this.analyze_advanced_translate(advanced_translate_item, "", "code", word)
            tab_content_html += `
                    <div class="tab-pane ${active_class}" id="${word_id}" role="tabpanel">
                        <div class="p-0">
                                ${advanced_translate_html}
                        </div>
                    </div>
            `
        })
        if (html_tab) {
            html = `
                <div class="customvtab">
                    <ul class="nav nav-tabs customtab2" role="tablist">
                        ${html_tab}
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content">
                        ${tab_content_html}
                    </div>
                </div>
            `
        }
        return html
    }

    create_advanced_html(word, word_id, advanced_translate_type, advanced_translate) {
        let html_tab = ""
        let html = ""
        if (UserCase.is_testmode()) {
            return html
        }
        let tab_content_html = ""
        advanced_translate_type.forEach((item, index) => {
            item = baseHtmlToolCase.split_html(item)
            let random_string = baseStrArrCase.gen_randomstring(32)
            word_id = `tab_${word_id}${random_string}`
            let active_class = ""
            if (index == 0) {
                active_class = "active"
            }
            html_tab += `
                    <li class="nav-item">
                    <a class="nav-link ${active_class}" data-toggle="tab" href="#${word_id}" role="tab">
                        <span class="hidden-sm-up">
                        </span> <span class="">${item}</span></a> 
                    </li>
            `
            let advanced_translate_html = this.analyze_advanced_translate(advanced_translate[index], "<br />", "w_css", word)
            tab_content_html += `
                    <div class="tab-pane ${active_class}" id="${word_id}" role="tabpanel">
                        <div class="p-0">
                            <p>
                                ${advanced_translate_html}
                            </p>
                        </div>
                    </div>
            `
        })
        if (html_tab) {
            html = `
                <div class="customvtab">
                    <ul class="nav nav-tabs customtab2" role="tablist">
                        ${html_tab}
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content">
                        ${tab_content_html}
                    </div>
                </div>
            `
        }
        return html
    }

    analyze_advanced_translate(advanced_translate, br = "", tag_class = "w_css", word) {
        let html = ``
        if (UserCase.is_testmode()) {
            return html
        }
        let continuous = null
        let explanation_html = null
        let code_content_html = `<div class="de_co"><div class="def_pa">`
        let code_content_close = `</div></div>`
        if (tag_class == "code") {
            code_content_html = `<span>`
            code_content_close = `</span><br />`
            br = ",&nbsp;"
        }
        if (!advanced_translate) {
            advanced_translate = []
        }
        advanced_translate.forEach((trans_item, index) => {
            if (this.is_word_self(index, word, trans_item)) {
                html += `<div class="word-title">${trans_item}${br}</div>`
            } else if (this.is_word_redandancy(trans_item)) {

            } else if (this.is_word_type(trans_item)) {
                continuous = null
                if (explanation_html) {
                    explanation_html = null
                    html += code_content_close
                }
                if (tag_class == "code") {
                    html += `
                    <code>${trans_item}</code>
                    `
                } else {
                    html += `
                    <div class="pos_lin">
                    <div class="pos pull-left ">${trans_item}</div>
                    </div>
                    `
                }
            } else if (this.is_word_number(trans_item)) {
                continuous = null
                if (explanation_html) {
                    explanation_html = null
                    html += code_content_close
                }
                html += `<div class="se_n_d">${trans_item}</div>`
            } else if (this.is_word_notes(trans_item)) {
                html += `<code>${trans_item}</code>`
            } else {
                if (!continuous) {
                    explanation_html = code_content_html
                    html += explanation_html
                    continuous = true
                }
                html += `${trans_item}${br}`
            }
        })
        if (explanation_html && continuous) {
            explanation_html = null
            html += code_content_close
        }
        return html
    }

    create_sampleimages_html(word, sample_images) {
        let html = ""
        if (UserCase.is_testmode()) {
            return html
        }
        let image_index = 0
        let show_maximages = baseSettingCase.get_global_settings('settings.show_maximages.value')
        if (!show_maximages) {
            show_maximages = 1
        }
        for (let item in sample_images) {
            if (image_index >= show_maximages) {
                break
            }
            image_index++
            let item_term = sample_images[item]
            let src = item_term.save_filename
            if (src.split(/\./).pop().toLowerCase() != 'none') {
                html += `
                <a href="javascript:;" class="bg-warning-light rounded text-center overflow-hidden">
                    <img  src="${NASSTATICURL}${item_term.save_filename}" class="align-self-end" alt="" style="max-height:100%;">
                </a>
                `
            }
        }
        if (html) {
            html = `
            <div class="d-flex box-bottom-10px">
                <div class="d-flex-image" style="display:flex;">
                    ${html}
                </div>
            </div>
            `
        }
        return html
    }

    create_voicehtml(src, wid, vid) {
        let voice_html = `<audio data-audioid="${wid}-${vid}" data-index="${vid}" class="phoneticvoice" preload="auto" >
            <source src="${NASSTATICURL}${src}" type="audio/mp3" >
        </audio>`
        return voice_html
    }

    create_testtranslation_html(word, word_translation, wordid) {
        let html = ""
        if (word_translation.length == 0) {
            return html
        }
        // let subtitleclassname = this.get_wordsubtitleclass()
        word_translation.forEach((item, index) => {
            if (word && index > 0) {
                return
            }
            let trans_type = baseStrArrCase.get_array_value(item, 0)
            let trans_info
            try {
                trans_info = item.slice(1).join("")
            } catch (e) {
                trans_info = item
                console.log(e, trans_info)
            }
            let html_item = ""
            let html_css = "bg-primary-light"
            if (trans_type && trans_type.toLocaleLowerCase() == "web") {
                html_css = "bg-success-light"
            }
            if (trans_type) {
                let group_name = `group_${wordid}`
                let random_number = this.create_random_number()
                let radio_id = `radio_${wordid}_${random_number}`
                if (!word) word = ""
                html_item = `					
                    <input data-word="${word}" name="${group_name}" type="radio" id="${radio_id}" >
                    <label for="${radio_id}" style="margin-bottom:10px;"><span class="pull-left ${html_css}">${trans_type}</span>${trans_info}</label>
                `
                html += html_item
            }
        })
        return html
    }

    create_translation_html(word, word_translation) {
        let html = ""
        if (word_translation.length == 0) {
            return html
        }
        let subtitleclassname = this.get_wordsubtitleclass()
        word_translation.forEach((item, index) => {
            let trans_type = baseStrArrCase.get_array_value(item, 0)
            let trans_info
            try {
                trans_info = item.slice(1).join("")
            } catch (e) {
                trans_info = item
                console.log(e, trans_info)
            }
            let html_item = ""
            let html_css = "bg-primary-light"
            if (trans_type && trans_type.toLocaleLowerCase() == "web") {
                html_css = "bg-success-light"
            }
            if (trans_type) {
                let pinyin_text = ""
                let pinyin_button = ''
                pinyin_text = pinyinPro.pinyin(trans_info)
                pinyin_button = `<button type="button" onclick="window.MyDict.event('showpinyin',this)" class="waves-effect btn btn-circle btn-xs-py mb-0"><i class="mdi mdi-file-powerpoint-box"></i></button>`

                html_item = `
                <h6 class="box-subtitle ${subtitleclassname}">
                <span class="pull-left ${html_css}">${trans_type}</span> 
                <span class="translate_span" >${trans_info}</span>${pinyin_button}
                </h6>
                <h6 class="box-pinyintitle ${subtitleclassname}" style="display:none;">
                <span class="translate_pinyinspan" >${pinyin_text}</span>
                </h6>
                `
                html += html_item
            }
        })
        return html
    }

    create_phonetic_symbol_html(word_id, voice_files) {
        let html = ""
        if (UserCase.is_testmode()) {
            return html
        }
        if (Object.keys(voice_files).length == 0) {
            return html
        }
        let third_party = false
        let voiceindex = 0

        let show_max = baseSettingCase.get_global_settings('settings.show_maxphonetic.value')
        if (!show_max) {
            show_max = 1
        }
        for (let item in voice_files) {
            if (voiceindex >= show_max) {
                break
            }
            let voice = voice_files[item]
            let voice_name
            if (voice.iterate_name) {
                voice_name = voice.iterate_name.replace(/(?<=[a-zA-Z]{2}).+/, "").toLowerCase()
            }
            if (!voice_name) {
                voice_name = item
            }
            let file_suffixname = voice.save_filename ? voice.save_filename : voice.save_dir
            if (!file_suffixname) {
                file_suffixname = voice.url
            }
            file_suffixname = file_suffixname ? file_suffixname.split('.').pop() : ``
            let filesuffixisnone = file_suffixname == ""
            if (!voice.save_filename || filesuffixisnone) {
                continue
            }
            if (filesuffixisnone) {
                continue
            }
            let voice_nickname = voice.iterate_name ? voice.iterate_name : ""
            if (!voice_nickname && voice_name) {
                third_party = true
                voice_nickname = voice_name.split('_').pop()//.substr(0, 2)
            }
            html += `
            <span class="phonetic_span">${voice_nickname}</span>
            ${this.create_voicehtml(voice.save_filename, word_id, voiceindex)}
            <a class="waves-effect waves-light btn btn-xs disabled" data-playcontrol="${word_id}-${voiceindex}"  href="javascript:;" onclick="MyDict.event('play_voice','${word_id}-${voiceindex}')">
                <i class="fa fa-volume-up"></i>
            </a>
            `
            voiceindex++
        }
        if (html) {
            html = `
            <h6 class="box-subtitle" style="margin-top: 10px;margin-bottom: 10px;position: relative;">
                ${html}
            </h6>
            `
        }
        return html
    }

    get_word_propertytounicode(word_json, key, defult_value = [], default_valuenew) {
        let value = this.get_word_property(word_json, key, defult_value, default_valuenew)
        value = baseStrArrCase.tounicode(value)
        return value
    }

    get_word_property(word_json, key, defult_value = [], default_valuenew) {
        if (word_json && key in word_json) {
            return word_json[key];
        }
        if (typeof defult_value == "string") {
            if (word_json) {
                key = defult_value
                defult_value = []
            } else {
                defult_value = default_valuenew ? default_valuenew : defult_value
                return defult_value
            }
        }
        if (word_json && typeof word_json == "object" && word_json[key]) {
            return word_json[key]
        }
        return defult_value
    }

    get_readtimefromdata(id, read_time) {
        for (let i = 0; i < read_time.length; i++) {
            let time = read_time[i]
            if (id == time[0]) {
                return baseStrArrCase.timestamp_todate(time[1])
            }
        }
        return baseStrArrCase.timestamp_todate(0)
    }

    get_readtimefromtimastamp(wid) {
        let read_time = this.get_groupmapvaluefromid(wid, 'read_time')
        if (!read_time) read_time = 0;
        read_time = baseStrArrCase.timestamp_todate(read_time)
        return read_time
    }

    get_grouptojson(data) {
        let translateindex = 3;
        data.forEach((item, index) => {
            let translate = item[translateindex];
            translate = baseStrArrCase.toJSON(translate);
            data[index][translateindex] = translate;
        });
        return data;
    }

    is_webtranslate(word, word_translation) {
        if (word_translation.length == 1) {
            let item_translate = word_translation[0]
            if (Array.isArray(item_translate)) {
                let key = item_translate[0]
                if (key.toLocaleLowerCase() == 'web') {
                    word = word.toLocaleUpperCase()
                }
            }
        }

        return word
    }

    get_wordtitleclass() {
        let class_name = `box-title`
        if (UserCase.get_project_mode()) {
            class_name += ` project_title`
        }
        return class_name
    }

    get_wordsubtitleclass() {
        let class_name = `word_subtitle`
        if (UserCase.get_project_mode()) {
            class_name += ` project_subtitle`
        }
        return class_name
    }

    is_word_redandancy(word_type) {
        word_type = word_type.trim()
        if (word_type == "Show examples") {
            return true
        }
        return null
    }

    is_word_self(index, word, word_type) {
        word_type = word_type.trim()
        if (word_type == word && index == 0) {
            return true
        }
        return null
    }

    is_word_notes(word_type) {
        word_type = word_type.trim()
        if (/^\[.+\]$/.test(word_type)) {
            return word_type
        }
        return null
    }

    is_word_number(word_type) {
        word_type = word_type.trim()
        if (/^[0-9]+\./.test(word_type)) {
            return word_type
        }
        return null
    }

    is_word_type(word_type) {
        let word_types = [
            "n.",
            "v.",
            "Web",
            "prep.",
            "abbr.",
            "n.",
            "adj.",
            "vt.",
            "adj.",
            "IDM",
            "pron.",
            "adv.",
            "etc.",
            "pron.",
        ]
        let result = null
        word_types.forEach(function (type_oneitem) {
            word_type = word_type.toLowerCase().trim()
            if (word_type.startsWith(type_oneitem.toLowerCase())) {
                result = word_type
                return
            }
        })
        return result
    }

    set_todayprogress(word) {
        let time = this.create_time("yyyy-MM-dd")
        let key = `daily_readed.${time}`
        let daily_readed = baseSettingCase.get_global_settings(key)
        if (!daily_readed) {
            baseSettingCase.set_global_settings(`daily_readed`, null)
            daily_readed = []
        }
        //to Int array.
        for (let i = 0; i < daily_readed.length; i++) {
            daily_readed[i] = parseInt(daily_readed[i])
        }
        let wordid = this.get_idbyword(word)
        if (!daily_readed.includes(wordid)) {
            daily_readed.push(wordid)
            baseSettingCase.set_global_settings(key, daily_readed)
            let today_process = (daily_readed.length / baseSettingCase.get_global_settings(`settings.per_dayreads.value`)) * 100
            let ele = baseHtmlToolCase.queryElement(`.dailyreadedcount`)
            if (ele) {
                ele.style.width = `${today_process}%`
            }
        }
    }

    set_pageprogress() {
        let ele = baseHtmlToolCase.queryElement(`.pagereadcount`)
        if (!ele) {
            return false
        }
        let playe = wordsInfoCase.count_playedwords()
        let per_words = baseSettingCase.get_global_settings(`settings.per_words.value`)
        let readed = (playe / per_words) * 100
        ele.style.width = `${readed}%`
    }

    remove_already_reviewed() {
        let wordeles = wordsInfoCase.get_allreviewed()
        wordeles.forEach((ele) => {
            ele.remove()
        })
    }
}


export default new Main()