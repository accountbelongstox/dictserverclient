import baseHtmlToolCase from "./baseHtmlToolCase.js";
import baseSettingCase from "./baseSettingCase.js";
import baseStrArrCase from "./baseStrArrCase.js";
import translateControlCase from "./translateControlCase.js";
import worddataProvider from "./worddataProvider.js";

class Main {
    constructor() {
        this.alreadyPlay = []
        this.alreadyReview = []
        this.playingElementArray = [];
        this.playedForTheFirstTime = [];
        this.playElementASecondTime = [];
        this.isPlaying = false;
    }

    get maxPlays() {
        return baseSettingCase.get_global_settings('settings.maxplays.value');
    }

    get glimpse() {
        return baseSettingCase.get_global_settings('settings.glimpse.value');
    }

    get maxReview() {
        return baseSettingCase.get_global_settings('settings.maxreview.value');
    }

    get interval_seconds() {
        return baseSettingCase.get_global_settings('settings.interval_seconds.value');
    }

    get per_words() {
        return baseSettingCase.get_global_settings('settings.per_words.value');
    }

    playbackSwitch() {
        this.isPlaying = !this.isPlaying;
        $('#voice_playtoggle_button span').toggleClass('si-control-play si-control-pause');
        if (this.isPlaying) {
            this.playAudio();
        }
    }

    async submitAlreadyReview(force) {
        if (this.alreadyReview.length > ((this.per_words / 2) - 1) || force) {
            let result = await worddataProvider.updateGroupMap()
            if (result.data && result.data.updateDictiongroupmap && result.data.updateDictiongroupmap.data) {
                this.alreadyReview.forEach((id) => {
                    worddataProvider.consumeSingleData(id)
                    console.log($(`[data-wordid='${id}']`))
                    $(`[data-wordid='${id}']`).remove()
                })
                this.alreadyReview = []
            }
        }
    }

    async playSingleAudio(audio, wElement, isFirstPlay = false, isGlimpse = false) {
        return new Promise((resolve, reject) => {
            let duration = audio.duration
            if (isNaN(duration)) {
                duration = 0.5
            }
            const audioDuration = (duration * 1000) + this.interval_seconds * 1000;
            setTimeout(() => {
                if (isFirstPlay) {
                    const audioId = $(audio).data('audioid');
                    baseHtmlToolCase.replaceClassByJs(`[data-playcontrol="${audioId}"]`, `btn-warning-light`, `btn-success-light`)
                }
                if (isGlimpse) {
                    const audioParent = $(audio).parent();
                    const audioId = $(audio).data('audioid');
                    audioParent.append(`<a href="javascript" class="waves-effect waves-light btn btn-xs btn-warning-light" data-playcontrol="${audioId}" style="position:absolute; right:0; top:0;"> <i class="fa fa-star"></i> </a>`);
                }
                this.submitAlreadyReview()
                resolve();
            }, audioDuration);
            baseHtmlToolCase.toScroll(wElement);
            audio.play().catch(error => {
                console.error('Audio play failed:', error);
                resolve();
            });
        });
    }

    async playAudioElement(selector, isReview) {
        const element = $(selector)
        console.log(`element`,element)
        if (!this.isPlaying) {
            baseHtmlToolCase.attr(element, 'playcount', '0');
            baseHtmlToolCase.attr(element, 'reviewcount', '0');
            return;
        }
        const audio = $(element).find('audio').get(0);
        if (audio) {
            const playCount = isReview ? this.maxReview : this.maxPlays;
            if (!isReview) {
                const curPlayCount = parseInt(baseHtmlToolCase.getAttr(element, 'playcount')) || 0;
                for (let j = curPlayCount; j < playCount; j++) {
                    if (!this.isPlaying) {
                        baseHtmlToolCase.attr(element, 'playcount', j.toString());
                        return;
                    }
                    const isFirstPlay = (j === playCount - 1);
                    try {
                        await this.playSingleAudio(audio, element, isFirstPlay);
                    } catch (error) {
                        console.error(error);
                    }
                }
                baseHtmlToolCase.attr(element, 'playcount', playCount.toString());
                if (this.alreadyPlay.length) {
                    let pre_selector = this.alreadyPlay.shift();
                    const pre_element = $(pre_selector)
                    const glimpseCount = parseInt(baseHtmlToolCase.getAttr(pre_element, 'glimpsecount')) || 0;
                    const prevAudio = $(pre_element).find('audio').get(0);
                    for (let j = glimpseCount; j < this.glimpse; j++) {
                        if (!this.isPlaying) {
                            baseHtmlToolCase.attr(pre_element, 'glimpsecount', j.toString());
                            this.alreadyPlay.unshift(pre_element);
                            return;
                        }
                        const isGlimpse = (j === this.glimpse - 1);
                        try {
                            await this.playSingleAudio(prevAudio, pre_element, false, isGlimpse);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    baseHtmlToolCase.attr(pre_element, 'glimpsecount', this.glimpse);
                }

            } else {
                const reviewCount = parseInt(baseHtmlToolCase.getAttr(element, 'reviewcount')) || 0;
                for (let j = reviewCount; j < playCount; j++) {
                    if (!this.isPlaying) {
                        baseHtmlToolCase.attr(element, 'reviewcount', j.toString());
                        return;
                    }
                    try {
                        await this.playSingleAudio(audio, element, false);
                    } catch (error) {
                        console.error(error);
                    }
                }
                baseHtmlToolCase.attr(element, 'reviewcount', playCount.toString());
            }
        }
    }

    async processAudioElements(elementArray, isReview) {
        while (elementArray.length > 0) {
            if (!this.isPlaying) return;
            const item = elementArray.shift();
            console.log(`selector`,item.selector)
            const selector = item.selector
            const element = $(selector)
            await this.playAudioElement(selector, isReview);
            this.alreadyPlay.push(element);
            let wid = $(element).attr('data-wordid')
            if (isReview) {
                await worddataProvider.getDataAndConsum(wid,true)
                this.playedForTheFirstTime = baseHtmlToolCase.removeEleOfArrayById(this.playedForTheFirstTime, wid)
                this.playElementASecondTime.push(element);
                this.setAlreadyReview(wid)
            } else {
                await worddataProvider.getDataAndConsum(wid)
                this.playingElementArray = baseHtmlToolCase.removeEleOfArrayById(this.playingElementArray, wid)
                this.playedForTheFirstTime.push(element);
            }
            console.log(`this.playingElementArray ${this.playingElementArray.length}`)
            console.log(`this.playedForTheFirstTime ${this.playedForTheFirstTime.length}`)
            console.log(`this.playElementASecondTime ${this.playElementASecondTime.length}`)
        }
        this.alreadyPlay = [];
    }

    setAlreadyReview(wid) {
        wid = parseInt(wid)
        this.alreadyReview.push(wid)
        worddataProvider.updateWordReadCount(wid)
        this.submitAlreadyReview()
    }

    async playAudio() {
        if (!this.isPlaying) return;
        if (this.playingElementArray.length === 0) {
            const data = [...await worddataProvider.getDataAndConsum()];
            console.log(`playAudio`,data)
            if (!data || !Array.isArray(data) || data.length === 0) {
                setTimeout(() => {
                    this.playAudio()
                }, 1000)
                return;
            }
            this.playingElementArray = data;
            for (let item of this.playingElementArray) {
                let selector = item.selector
                const element = $(selector)
                baseHtmlToolCase.attr(element, 'playcount', '0');
                baseHtmlToolCase.attr(element, 'reviewcount', '0');
                baseHtmlToolCase.attr(element, 'glimpsecount', '0');
            }
        }
        await this.processAudioElements(this.playingElementArray, false);
        await this.processAudioElements(this.playedForTheFirstTime, true);
        if (this.playingElementArray.length === 0 && this.playedForTheFirstTime.length === 0) {
            this.submitAlreadyReview(true)
            this.playElementASecondTime = [];
            setTimeout(() => {
                this.isPlaying = true
                this.playAudio()
            }, 1000)
        }
    }


}

export default new Main()