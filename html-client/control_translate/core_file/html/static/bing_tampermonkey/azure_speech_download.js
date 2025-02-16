// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://azure.microsoft.com/*/products/cognitive-services/text-to-speech/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    /*AJAX codes*/if (typeof window != 'undefined' && !window.$) { window.$ = { get: function (URL, queryJSON, callback) { let xhr; if (window.XMLHttpRequest) { xhr = new XMLHttpRequest() } else { xhr = new ActiveXObject("Microsoft.XMLHTTP") } xhr.onreadystatechange = function () { if (xhr.readyState == 4) { if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) { callback(xhr.responseText) } else { callback(new Error("AJAX GET did not find the requested file"), undefined) } } }; let querystring = this._queryjson2querystring(queryJSON); let joiner; if (!URL.includes('?')) { joiner = "?" } else { joiner = "&" } xhr.open("get", URL + joiner + querystring, true); xhr.send(null) }, post: function (URL, queryJSON, callback) { let xhr; if (window.XMLHttpRequest) { xhr = new window.XMLHttpRequest() } else { xhr = new ActiveXObject("Microsoft.XMLHTTP") } xhr.onreadystatechange = function () { if (xhr.readyState == 4) { if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) { callback(xhr.responseText) } else { callback(new Error("AJAX POST did not find the requested file"), undefined) } } }; let querystring = this._queryjson2querystring(queryJSON); xhr.open("post", URL, true); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(querystring) }, _queryjson2querystring: function (json) { var arr = []; for (var k in json) { arr.push(k + "=" + encodeURIComponent(json[k])) } return arr.join("&") } } }
    class AzureSpeechDownload {
        translate_tovoice = null

        constructor() { }
        remote_url(method) { let url = `${this.get_remove_url()}/api?method=${method}&key=9LrQN0~14,dSmoO^&module=com_translate`; return url; }
        get_remove_url() { if (typeof base_remote_url == 'string') { this.base_remote_url = base_remote_url; } if (!this.base_remote_url) { this.base_remote_url = window.location.origin; } this.base_remote_url = this.base_remote_url.replace(/\/+$/, ''); return this.base_remote_url; }
        get(method, request_data) { let url = this.remote_url(method); return new Promise((resolve, reject) => { $.get(url, request_data, (data) => { data = this.to_json(data); resolve(data) }) }) }
        post(method, data) { let url = this.remote_url(method); return new Promise((resolve, reject) => { $.post(url, data, (data) => { data = this.to_json(data); resolve(data) }) }) }
        to_json(value) { if (typeof value === "string") { try { value = JSON.parse(value) } catch (e) { console.log(`to_json ${e}`); console.log(`value ${value}`); value = {} } } return value }
        remote_resourceurl(suffix) { let url = `${this.get_remove_url()}/static/${suffix}`; return url }
        split_html(html) { html = html.replaceAll(/<.+?>/g, ''); return html }
        create_id(word) { if ($ && $.md5 && word) { word = $.md5(word) } return word }
        gen_randomstring(len = 32) { let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"; var result = ''; for (var i = len; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)] } return result }
        get_array_value(array, index) { if (array.length >= index + 1) { return array[index] } return null }
        timestamp_todate(time, format = 'Y-M-D h:m:s') { let date; if (typeof time == 'object') { date = time } else { if (this.numeric(time)) { time = parseInt(time) } date = new Date(time) } let Y = date.getFullYear(); let M = this.fill_alphabet(date.getMonth() + 1, 2, '0'); let D = this.fill_alphabet(date.getDate(), 2, '0'); let h = this.fill_alphabet(date.getHours(), 2, '0'); let m = this.fill_alphabet(date.getMinutes(), 2, '0'); let s = this.fill_alphabet(date.getSeconds(), 2, '0'); format = format.replace('Y', Y); format = format.replace('M', M); format = format.replace('D', D); format = format.replace('h', h); format = format.replace('m', m); format = format.replace('s', s); return format }
        date_totimestamp(time) { if (!time) { time = new Date() } else if (typeof time == 'string' || typeof time == 'number') { time = new Date(time) } let timesdamp = Date.parse(time); return timesdamp }
        numeric(n) { let numbric = /^\d+$/; if (numbric.test(n)) { return true } return false }
        fill_alphabet(s, l, fill_s = "0") { s = s + ""; s = s.padStart(l, fill_s); return s }
        create_time(format, index = 0) { let dateTime = new Date(); if (typeof format === 'string') { let date_format = format.split(' '); date_format = date_format[0]; date_format = date_format.split('-'); let year = date_format[0]; let month = date_format[1]; let day = date_format[2]; let is_int = /^\d+$/; if (is_int.test(year) && is_int.test(month) && is_int.test(day)) { year = parseInt(year); month = parseInt(month); day = parseInt(day); dateTime.setFullYear(year, month, day); if (date_format.length > 1) { format = `yyyy-MM-dd hh:mm:ss` } else { format = `yyyy-MM-dd` } } } else { format = `yyyy-MM-dd hh:mm:ss` } var z = { y: dateTime.getFullYear(), M: dateTime.getMonth() + 1, d: dateTime.getDate() + index, h: dateTime.getHours(), m: dateTime.getMinutes(), s: dateTime.getSeconds() }; return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) { return ((v.length > 1 ? "0" : "") + eval("z." + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2)) }) }
        add_class(ele, class_name) { ele = this.get_removeclassandaddclasselements(ele); for (let i = 0; i < ele.length; i++) { let child = ele[i]; let class_names = child.className; if (!class_names) { class_names = `` } class_names = class_names.split(/\s+/); if (!class_names.includes(class_name)) { class_names.push(class_name) } child.className = class_names.join(` `) } }
        remove_class(ele, class_name) { ele = this.get_removeclassandaddclasselements(ele); for (let i = 0; i < ele.length; i++) { let child = ele[i]; let class_names = child.className; if (!class_names) { class_names = `` } class_names = class_names.split(/\s+/); class_names = this.array_remove(class_names, class_name); child.className = class_names.join(` `) } }
        array_remove(array, val) { for (var i = 0; i < array.length; i++) { if (array[i] == val) { array.splice(i, 1); i-- } } return array }
        get_removeclassandaddclasselements(ele) { if (typeof ele == 'string') { ele = this.queryElementAll(ele) } if (!ele.length) { ele = [ele] } return ele }
        get_query_selector(selector) { selector = selector.trim(); let is_not_classname = /^[^\#\[\.]/; if (is_not_classname.test(selector)) { selector = `.${selector}` } return selector }
        queryElement(selector) { selector = this.get_query_selector(selector); let ele = document.querySelector(selector); return ele }
        queryElementAll(selector) { selector = this.get_query_selector(selector); let eles = []; document.querySelectorAll(selector).forEach(ele => { eles.push(ele) }); return eles }
        get_parameter(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if (r != null) { return decodeURI(r[2]) } return null }
        next_element(ele, safe = false) { if (ele && ele.nextElementSibling) { return ele.nextElementSibling } if (safe) { return ele } return null }
        prev_element(ele, safe = false) { if (ele && ele.previousElementSibling) { return ele.previousElementSibling } if (safe) { return ele } return null }

        write_sentence(sentence) {
            if(sentence){
                this.queryElement('#ttstext').value = sentence
            }
        }

        set_selected(selector,value){
            console.log('set_selected')
            selector = this.queryElement(selector)
            let selectedindex = null
            console.log(selector)
            selector.forEach((ele,index)=>{
                if(ele.value == value){
                    selectedindex = index
                    return
                }
            })
            if(selectedindex !== null){
                selector[selectedindex].selected = true
            }
        }

        init() {
            this.set_selected("#languageselect",`en-US`)
            if (!this.translate_tovoice) {
                this.get("get_novoicesentence").then(data => {
                    console.log(data)
                })
            }


        }




    }
    new AzureSpeechDownload().init()



    // Your code here...
    if (!window.saveAs) {
        window.saveAs = (blob, name) => {
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";

            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }

    const SpeechSDK = window.SpeechSDK
    let fileSize = 0
    let streamSize = 0
    let wavFragments = []
    let enableDownload = false
    let enableCollect = false
    let autoProcessing = false
    let tasks = []
    let fileExt = '.mp3'
    let enableSaveOptions = false
    const i18n = {
        zh: {
            document1: "\n\n\n收集模式：\n\n打开之后，点击“下载”按钮转换的音频会被收集，在收集模式关闭时合成一个音频下载",
            document2: "\n\n自动拆分：\n\n将长文本拆分为多个接近“段落长度”的片段，并只在“分隔符”处截断，避免句子被截断，影响阅读效果",
            document3: "\n\n\n\n拖拽 txt 文件至此框可加载文本文件",
            download: '下载',
            downloading: '下载中',
            downloaded: '下载完成',
            split: '自动拆分',
            spliting: '拆分中',
            codec: '音频编码',
            saveSetting: '保存设置',
            lengthWarning: '下载长度超过免费限额，请分割文本后使用收集模式',
            splitedMsg: "自动拆分完成\n\n使用下方播放器播放，或关闭收集模式下载音频文件",
            length: '段落长度',
            delimiter: '分隔符',
            collectionOn: '收集模式开',
            collectionOff: '收集模式关',
            received: '已接收',
            taskQueue: '剩余分段',
            profileName: '配置名',
            createProfile: '创建配置',
        },
        eng: {
            document1: "\n\n\nCollection：\n\nCollect audio files converted by clicking \"Download\" button, do the really download when it is turned off",
            document2: "\n\nSplit：\n\nSplit long text into segments close to the \"paragraph length\", which only truncate at \"delimiter\"",
            document3: "\n\n\n\nYou can drag .txt file to this text box to load a text file",
            download: 'Download',
            downloading: 'Downloading',
            downloaded: 'Download complete',
            split: 'Split',
            spliting: 'Spliting',
            codec: 'Codec',
            saveSetting: 'Save settings',
            lengthWarning: 'Text length exceeds the free limit, please split the text and use collection mode',
            splitedMsg: "Split finished\n\nUse the player below to play, or turn off collection mode to download the audio file",
            length: 'Paragraph length',
            delimiter: 'Delimiter',
            collectionOn: 'Collection On',
            collectionOff: 'Collection Off',
            received: 'Received:',
            taskQueue: 'Task queue:',
            profileName: 'Profile name',
            createProfile: 'Create profile',
        }
    }
    const lang = window.Acom.currentCulture
    if (lang === 'zh-cn' || lang === 'zh-tw') {
        i18n.lang = i18n.zh
    } else {
        i18n.lang = i18n.eng
    }

    function createButton(id, color, content) {
        const button = document.getElementById('playli').cloneNode(true)
        button.id = id
        button.querySelector('span:last-of-type').textContent = content
        button.querySelector('button').style.backgroundColor = color
        button.querySelector('button').style.borderColor = color
        return button
    }

    function setButton(button, color, content) {
        button.querySelector('span:last-of-type').textContent = content
        button.querySelector('button').style.backgroundColor = color
        button.querySelector('button').style.borderColor = color
    }

    function downloadAndClean() {
        const sentAudio = new window.Uint8Array(fileSize)
        fileSize = 0
        streamSize = 0
        wavFragments.reduce((size, fragment) => {
            sentAudio.set(new window.Uint8Array(fragment), size)
            return size + fragment.byteLength
        }, 0)
        wavFragments.length = 0
        saveAs(new Blob([sentAudio]), (new Date()).toISOString().replace('T', ' ').replace(':', '_').split('.')[0] + fileExt)
    }

    function switchOptionDisplay() {
        if (enableCollect) {
            autoSplitButton.style.display = 'block'
            optionArea.style.display = 'block'
            previewPlayer.style.display = 'inline-block'
        } else {
            autoSplitButton.style.display = 'none'
            optionArea.style.display = 'none'
            previewPlayer.style.display = 'none'
        }
    }

    function syncAudioToPlayer() {
        const sentAudio = new window.Uint8Array(fileSize)
        wavFragments.reduce((size, fragment) => {
            sentAudio.set(new window.Uint8Array(fragment), size)
            return size + fragment.byteLength
        }, 0)
        const audioBlob = new Blob([sentAudio], { type: 'audio/ogg' })
        previewPlayer.src = URL.createObjectURL(audioBlob)
    }

    function dispatchTextChange() {
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('input', true, true)
        ttstext.dispatchEvent(evt)
    }

    function saveOptions() {
        if (!enableSaveOptions) return
        localStorage.setItem('savedOptions', JSON.stringify(getCurrentSettings()))
    }

    function restoreOptions() {
        const optionsJSON = localStorage.getItem('savedOptions')
        if (!optionsJSON) return
        const options = JSON.parse(optionsJSON)
        setSettings(options)
        saveCheckBox.checked = true
        enableSaveOptions = true
    }

    function bindSaveOption() {
        languageInput.addEventListener('change', saveOptions)
        voiceInput.addEventListener('change', saveOptions)
        styleInput.addEventListener('change', saveOptions)
        codecInput.addEventListener('change', saveOptions)
        speedInput.addEventListener('change', saveOptions)
        pitchInput.addEventListener('change', saveOptions)
        maxSizeInput.addEventListener('change', saveOptions)
        delimiterInput.addEventListener('change', saveOptions)
    }

    function initSpeedAndPitch() {
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('input', true, true)
        speedInput.value = '0'
        speedInput.dispatchEvent(evt)
        pitchInput.value = '0'
        pitchInput.dispatchEvent(evt)
    }

    function createProfile(name, profile) {
        const profiles = JSON.parse(localStorage.getItem('savedProfiles'))
        localStorage.setItem('savedProfiles', JSON.stringify([...profiles.filter(profile => profile.name !== name), {
            name,
            setting: profile
        }]))
        refreshProfile()
    }

    function removeProfile(name) {
        let profiles = JSON.parse(localStorage.getItem('savedProfiles'))
        localStorage.setItem('savedProfiles', JSON.stringify(profiles.filter(profile => profile.name !== name)))
        refreshProfile()
    }

    function refreshProfile() {
        let profilesJSON = localStorage.getItem('savedProfiles')
        let profiles
        if (!profilesJSON) {
            profiles = []
            localStorage.setItem('savedProfiles', JSON.stringify(profiles))
        } else {
            profiles = JSON.parse(profilesJSON)
        }
        profileContainer.innerHTML = ''
        profiles.forEach(profile => {
            const profileDiv = document.createElement("div")
            const profileName = document.createElement("span")
            const profileDelete = document.createElement("span")
            profileDiv.style.display = 'inline-block'
            profileDiv.style.border = '1px solid'
            profileDiv.style.marginLeft = '5px'
            profileDiv.style.cursor = 'pointer'
            profileName.innerText = profile.name
            profileName.style.padding = '5px'
            profileDelete.innerText = 'X'
            profileDelete.style.backgroundColor = 'black'
            profileDelete.style.color = 'white'
            profileDelete.style.padding = '2px'
            profileDiv.appendChild(profileName)
            profileDiv.append(profileDelete)
            profileContainer.append(profileDiv)
            profileName.addEventListener('click', () => {
                const textBackup = ttstext.value
                setSettings(profile.setting)
                ttstext.value = textBackup
                dispatchTextChange()
            })
            profileDelete.addEventListener('click', () => {
                removeProfile(profile.name)
            })
        })
    }

    function getCurrentSettings() {
        return {
            language: languageInput.value,
            voice: voiceInput.value,
            style: styleInput.value,
            codec: codecInput.value,
            speed: speedInput.value,
            pitch: pitchInput.value,
            splitLength: maxSizeInput.value,
            delimiter: delimiterInput.value
        }
    }

    function setSettings(setting) {
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('change', true, true)
        languageInput.value = setting.language
        languageInput.dispatchEvent(evt)
        voiceInput.value = setting.voice
        voiceInput.dispatchEvent(evt)
        styleInput.value = setting.style
        styleInput.dispatchEvent(evt)
        codecInput.value = setting.codec
        codecInput.dispatchEvent(evt)
        speedInput.value = setting.speed
        speedInput.dispatchEvent(evt)
        pitchInput.value = setting.pitch
        pitchInput.dispatchEvent(evt)
        evt = document.createEvent('HTMLEvents')
        evt.initEvent('input', true, true)
        speedInput.dispatchEvent(evt)
        pitchInput.dispatchEvent(evt)
        maxSizeInput.value = setting.splitLength
        delimiterInput.value = setting.delimiter
    }

    const downloadStatus = document.createElement('div')
    const downloadSize = document.createElement('div')
    const buttonArea = document.getElementById('playli').parentElement
    const ttstext = document.getElementById('ttstext')
    const styleSelecter = document.getElementById('voicestyleselect').parentElement
    const languageInput = document.getElementById('languageselect')
    const voiceInput = document.getElementById('voiceselect')
    const styleInput = document.getElementById('voicestyleselect')
    const speedInput = document.getElementById('speed')
    const pitchInput = document.getElementById('pitch')

    ttstext.ondrop = async (e) => {
        const files = e.dataTransfer.files
        if (files.length === 1 && files[0].type === 'text/plain') {
            e.preventDefault()
            const file = files[0]
            ttstext.value = await file.text()
            dispatchTextChange()
        }
    }

    // reuqired by Firefox
    ttstext.ondragover = function (e) {
        e.preventDefault();
    }

    // set document
    setTimeout(() => {
        setTimeout(() => {
            const onchange = languageInput.onchange
            languageInput.onchange = (...args) => {
                onchange(...args)
                languageInput.onchange = onchange
                initSpeedAndPitch()
                restoreOptions()
                bindSaveOption()
                ttstext.value += i18n.lang.document1
                ttstext.value += i18n.lang.document2
                ttstext.value += i18n.lang.document3
            }
        }, 0)
    }, 0)

    // set download button
    const downloadButton = createButton('donwloadli', 'green', i18n.lang.download)
    downloadButton.addEventListener('click', () => {
        downloadStatus.textContent = i18n.lang.downloading
        enableDownload = true
        streamSize = 0
        document.getElementById('playbtn').click()
        enableDownload = false
    })
    downloadStatus.style.marginTop = '10px'
    buttonArea.appendChild(downloadButton)
    // set collect button
    const collectButton = createButton('collectli', 'red', i18n.lang.collectionOff)
    collectButton.addEventListener('click', () => {
        if (!enableCollect) {
            enableCollect = true
            switchOptionDisplay()
            setButton(collectButton, 'green', i18n.lang.collectionOn)
        } else {
            enableCollect = false
            switchOptionDisplay()
            setButton(collectButton, 'red', i18n.lang.collectionOff)
            if (!fileSize) return
            downloadAndClean()
        }
    })
    collectButton.style.marginRight = '10px'
    buttonArea.appendChild(collectButton)
    // set options
    const optionArea = document.createElement('div')
    const maxSizeInput = document.createElement('input')
    const delimiterInput = document.createElement('input')
    const maxSizeLabel = document.createElement('span')
    const delimiterLabel = document.createElement('span')
    optionArea.id = 'optiondiv'
    optionArea.style.display = 'none'
    maxSizeLabel.textContent = i18n.lang.length
    maxSizeInput.style.width = '50px'
    maxSizeInput.style.margin = '10px'
    maxSizeInput.value = '300'
    delimiterLabel.textContent = i18n.lang.delimiter
    delimiterInput.style.width = '100px'
    delimiterInput.style.margin = '10px'
    delimiterInput.value = '，。？,.?'
    optionArea.appendChild(maxSizeLabel)
    optionArea.appendChild(maxSizeInput)
    optionArea.appendChild(delimiterLabel)
    optionArea.appendChild(delimiterInput)
    buttonArea.parentElement.appendChild(optionArea)
    // set download status
    buttonArea.parentElement.appendChild(downloadStatus)
    buttonArea.parentElement.appendChild(downloadSize)
    // set auto split button
    const autoSplitButton = createButton('autosplit', 'red', i18n.lang.split)
    autoSplitButton.addEventListener('click', () => {
        setButton(autoSplitButton, 'green', i18n.lang.spliting)
        autoProcessing = true
        const maxSize = +maxSizeInput.value
        const delimiters = delimiterInput.value.split('')
        const text = ttstext.value
        const textHandler = text.split('').reduce(
            (obj, char, index, arr) => {
                obj.buffer.push(char)
                if (delimiters.indexOf(char) >= 0) obj.end = index
                if (obj.buffer.length === maxSize) {
                    obj.res.push(obj.buffer.splice(0, obj.end + 1 - obj.offset).join(''))
                    obj.offset += obj.res[obj.res.length - 1].length
                }
                return obj
            }, {
            buffer: [],
            end: 0,
            offset: 0,
            res: []
        })
        textHandler.res.push(textHandler.buffer.join(''))
        ttstext.value = textHandler.res.shift()
        tasks = textHandler.res
        dispatchTextChange()
        downloadButton.click()
    })
    autoSplitButton.style.display = 'none'
    buttonArea.appendChild(autoSplitButton)
    // set preview player
    const previewPlayer = document.createElement('audio')
    previewPlayer.controls = true
    previewPlayer.style.display = 'none'
    previewPlayer.style.width = '100%'
    previewPlayer.style.marginTop = '10px'
    ttstext.after(previewPlayer)
    // set formatting options
    let codecInput
    try {
        const optionSelector = styleSelecter.cloneNode(true)
        const label = optionSelector.querySelector('label')
        label.textContent = i18n.lang.codec
        label.htmlFor = 'voiceformatselect'
        codecInput = optionSelector.querySelector('select')
        codecInput.id = 'voiceformatselect'
        codecInput.innerHTML = ''
        Object.entries(SpeechSDK.SpeechSynthesisOutputFormat).filter(item => !isNaN(item[0]))
            .filter(item => /(^Audio.+Mp3$)|(^Ogg)|(^Webm)/.test(item[1]))
            .forEach(item => {
                const format = item[1]
                const option = document.createElement("option")
                option.value = format
                option.text = format
                if (format === 'Audio24Khz96KBitRateMonoMp3') option.selected = true
                codecInput.appendChild(option)
            })
        styleSelecter.after(optionSelector)
        const audio24Khz96KBitRateMonoMp3 = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3
        codecInput.addEventListener('change', () => {
            SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3 = SpeechSDK.SpeechSynthesisOutputFormat[codecInput.value]
            if (codecInput.value === 'Audio24Khz96KBitRateMonoMp3') {
                SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3 = audio24Khz96KBitRateMonoMp3
            }
            if (codecInput.value.startsWith('Ogg')) {
                fileExt = '.ogg'
            } else if (codecInput.value.startsWith('Webm')) {
                fileExt = '.webm'
            } else {
                fileExt = '.mp3'
            }
        })
    } catch (e) {
        console.log(e)
    }
    // set save options
    const saveLabel = document.createElement("span")
    saveLabel.innerText = i18n.lang.saveSetting
    saveLabel.style.marginLeft = '5px'
    const saveCheckBox = document.createElement("input")
    saveCheckBox.type = 'checkbox'
    const pitchArea = document.getElementById('pitchlabel').parentElement
    pitchArea.appendChild(saveCheckBox)
    pitchArea.appendChild(saveLabel)
    saveCheckBox.addEventListener('change', () => {
        if (saveCheckBox.checked) {
            enableSaveOptions = true
            saveOptions()
        } else {
            enableSaveOptions = false
            localStorage.removeItem('savedOptions')
        }
    })
    // set profile manage
    const profileArea = document.createElement("div")
    const createProfileInput = document.createElement("input")
    const createProfileButton = document.createElement("button")
    const profileContainer = document.createElement("div")
    createProfileInput.placeholder = i18n.lang.profileName
    createProfileInput.style.width = '120px'
    createProfileButton.innerText = i18n.lang.createProfile
    createProfileButton.style.border = '1px solid'
    createProfileButton.style.marginLeft = '5px'
    createProfileButton.style.padding = '2px'
    profileContainer.style.display = 'inline-block'
    profileArea.appendChild(createProfileInput)
    profileArea.appendChild(createProfileButton)
    profileArea.appendChild(profileContainer)
    profileArea.style.marginTop = '10px'
    previewPlayer.after(profileArea)
    refreshProfile()
    createProfileButton.addEventListener('click', () => {
        if (!createProfileInput.value) return
        const profile = getCurrentSettings()
        createProfile(createProfileInput.value, profile)
        createProfileInput.value = ''
    })

    const streamHandler = {
        write: function (dataBuffer) {
            streamSize += dataBuffer.byteLength
            if (streamSize <= 1900800) {
                fileSize += dataBuffer.byteLength
                downloadSize.textContent = `${i18n.lang.received} ${fileSize / 1000} kb`
                if (autoProcessing) downloadSize.textContent = `${i18n.lang.taskQueue} ${tasks.length} ` + downloadSize.textContent
                wavFragments.push(dataBuffer)
            }
            if (streamSize === 1900800) {
                downloadStatus.textContent = i18n.lang.lengthWarning
                if (!enableCollect) {
                    fileSize = 0
                    wavFragments.length = 0
                } else {
                    fileSize -= 1900800
                    wavFragments.length -= 1320
                }
            }
        },
        close: function () {
            downloadStatus.textContent = i18n.lang.downloaded
            if (!enableCollect) {
                downloadAndClean()
                return
            }
            if (!autoProcessing) {
                syncAudioToPlayer()
                return
            }
            if (tasks.length) {
                ttstext.value = tasks.shift()
                dispatchTextChange()
                downloadButton.click()
            } else {
                autoProcessing = false
                setButton(autoSplitButton, 'red', i18n.lang.split)
                ttstext.value = i18n.lang.splitedMsg
                syncAudioToPlayer()
            }
        }
    }

    const outputStream = SpeechSDK.PushAudioOutputStream.create(streamHandler)

    SpeechSDK.AudioConfig.fromSpeakerOutput = (() => {
        const fromSpeakerOutput = SpeechSDK.AudioConfig.fromSpeakerOutput
        return function (audioDestination) {
            return enableDownload ? audioDestination.onAudioEnd() || SpeechSDK.AudioConfig.fromStreamOutput(outputStream) : fromSpeakerOutput(audioDestination)
        }
    })()
})();

