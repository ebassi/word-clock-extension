const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;
const Main = imports.ui.main;
const St = imports.gi.St;

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const TEENS = [
  '',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  'ten',
  'twenty',
  'thirty',
  'fourty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninenty',
];

const ORDINAL_ONES = [
  '',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
];

const ORDINAL_TEENS = [
  '',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
];

const ORDINAL_TENS = [
  '',
  'tenth',
  'twentieth',
  'thirtieth',
  'fourtieth',
  'fiftieth',
  'sixtieth',
  'seventieth',
  'eightieth',
  'ninetieth',
];

const DAYS = [
  '',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const MONTHS = [
  '',
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const WORDS = {
  o_clock: "o'clock",
  noon: 'noon',
  midnight: 'midnight',
  quarter: 'quarter',
  half: 'half',
  to: 'to',
  past: 'past',
  of: 'of',
  on: 'on',
};

let settings = null;
let dateMenu = null;
let updateClockId = 0;

function appendNumber(num) {
    let tensVal = Math.floor(num / 10) % 10;
    let onesVal = num % 10;
    let res = '';

    if (tensVal > 0) {
        if (tensVal == 1 && num != 10) {
            return TEENS[onesVal];
        }

        res = TENS[tensVal];
        if (onesVal > 0) {
            res += ' ';
        }
    }

    if (onesVal > 0 || num == 0) {
        res += ONES[onesVal];
    }

    return res;
}

function appendOrdinal(num) {
    let tensVal = Math.floor(num / 10) % 10;
    let onesVal = num % 10;
    let res = '';

    if (tensVal > 0) {
        if (tensVal == 1 && num != 10) {
            return ORDINAL_TEENS[onesVal];
        }

        if (onesVal == 0) {
            return ORDINAL_TENS[tensVal];
        }

        res = TENS[tensVal];
        if (onesVal > 0) {
            res += ' ';
        }
    }

    if (onesVal > 0 || num == 0) {
        res += ORDINAL_ONES[onesVal];
    }

    return res;
}

function timeToWords(hours, minutes) {
    let wordHours = hours;
    let wordMinutes = minutes;
    let res = '';

    if (wordMinutes != 0) {
        if (wordMinutes == 15) {
            res = WORDS.quarter + ' ' + WORDS.past + ' ';
        }
        else if (wordMinutes == 45) {
            res = WORDS.quarter + ' ' + WORDS.to + ' ';
            wordHours = (wordHours + 1) % 24;
        }
        else if (wordMinutes == 30) {
            res = WORDS.half + ' ' + WORDS.past + ' ';
        }
        else if (wordMinutes < 30) {
            res = appendNumber(wordMinutes) + ' ' + WORDS.past + ' ';
        }
        else {
            res = appendNumber(60 - wordMinutes) + ' ' + WORDS.to + ' ';
            wordHours = (wordHours + 1) % 24;
        }
    }

    if (wordHours == 0) {
        res += WORDS.midnight;
    }
    else if (wordHours == 12) {
        res += WORDS.noon;
    }
    else {
        res += appendNumber(wordHours % 12);
    }

    if (wordMinutes == 0 && !(wordHours == 0 || wordHours == 12)) {
        res = res + ' ' + WORDS.o_clock;
    }

    return res;
}

function dateToWords(weekDay, day, month) {
    return DAYS[weekDay] + ', ' + appendOrdinal(day) + ' ' + WORDS.of + ' ' + MONTHS[month];
}

function updateClockAndDate() {
    let tz = dateMenu._clock.get_timezone();
    let date = GLib.DateTime.new_now(tz);
    let str = timeToWords(date.get_hour(), date.get_minute());

    if (settings.get_boolean('clock-show-date')) {
        str += (' ' + WORDS.on + ' ' + dateToWords(date.get_day_of_week(), date.get_day_of_month(), date.get_month()));
    }

    dateMenu._clockDisplay.text = str;
}

function init() {
    dateMenu = Main.panel.statusArea['dateMenu'];
    if (!dateMenu) {
        log('No dateMenu panel element defined.');
        return;
    }

    settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
}

function enable() {
    if (!dateMenu) {
        return;
    }

    if (updateClockId != 0) {
        dateMenu._clock.disconnect(updateClockId);
    }

    updateClockId = dateMenu._clock.connect('notify::clock', Lang.bind(dateMenu, updateClockAndDate));
    updateClockAndDate();
}

function disable() {
    if (!dateMenu) {
        return;
    }

    if (updateClockId != 0) {
        dateMenu._clock.disconnect(updateClockId);
        updateClockId = 0;
    }

    dateMenu._clockDisplay.text = dateMenu._clock.clock;
}
