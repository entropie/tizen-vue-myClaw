import moment from 'moment'

export default {

    tizenTime: function() {
        if (typeof tizen === 'undefined') {
            return new Date();
        } else {
            // return tizen.time.getCurrentDateTime();
            return new Date();
        }
    }

}
