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

    ,

    momentHumanize: function(eventDuration, unit) {
    var eventMDuration = moment.duration(eventDuration, unit);
    var eventDurationArray = [];
    if (eventMDuration.years() > 0) {
        eventDurationArray.push(eventMDuration.years() + ' years');
        eventMDuration.subtract(eventMDuration.years(), 'years')
    }
    if (eventMDuration.months() > 0) {
        eventDurationArray.push(eventMDuration.months() + ' months');
        eventMDuration.subtract(eventMDuration.months(), 'months')
    }
    if (eventMDuration.weeks() > 0) {
        eventDurationArray.push(eventMDuration.weeks() + ' weeks');
        eventMDuration.subtract(eventMDuration.weeks(), 'weeks')
    }
    if (eventMDuration.days() > 0) {
        eventDurationArray.push(eventMDuration.days() + ' days');
        eventMDuration.subtract(eventMDuration.days(), 'days')
    }
    if (eventMDuration.hours() > 0) {
        eventDurationArray.push(eventMDuration.hours() + ' hours');
        eventMDuration.subtract(eventMDuration.hours(), 'hours')
    }
    if (eventMDuration.minutes() > 0) {
        eventDurationArray.push(eventMDuration.minutes() + ' minutes');
    }
    return eventDurationArray.length === 1 ? eventDurationArray[0] : 
    eventDurationArray.join(' and ')
}

}
