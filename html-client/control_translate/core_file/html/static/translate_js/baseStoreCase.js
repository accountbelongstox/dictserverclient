class Main{
    set_alreadyhistorydata(wid,name) {
        let maxLength = 100
        let obj = this.get_alreadyhistorydata(name)
        obj.push(wid)
        if (obj.length > maxLength) {
            obj.shift();
        }
        this.setLocalStorage(`${name}_words`, obj)
    }

    get_alreadyhistorydata(name) {
        let wordids = this.getLocalStorage(`${name}_words`)
        if (!wordids) {
            wordids = []
        }
        return wordids
    }

    setLocalStorage(key, value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    getLocalStorage(key) {
        let val = localStorage.getItem(key);
        if (val == 'false') {
            val = false;
        } else if (val == 'true') {
            val = true;
        } else if (val == 'null') {
            val = null;
        } else {
            try {
                val = JSON.parse(val);
            } catch (e) {
                // value is not JSON, so return it as is
            }
        }
        return val;
    }

}

export default new Main()