import UserCase from "./UserCase.js";

class Main {
    submitHasread(ids, callback) {
        let wordids = ids;
        if (Array.isArray(ids)) {
            wordids = ids.join(',');
        }
        UserCase.authPost("haveread", { wordids })
            .then((result) => {
                let data = []
                if (result && result.data) {
                    data = result.data
                }
                if (callback) callback(data);
            })
            .catch((error) => {
                console.error(error);
                if (callback) callback([]);
            });
    }
}

export default new Main();
