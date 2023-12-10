import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GnomeDesktop from 'gi://GnomeDesktop';
import GObject from 'gi://GObject';
import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

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
  it_is: 'it is',
  it_is_a: 'it is a',
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

const WordClockUpdater = GObject.registerClass({
    GTypeName: 'WordClockUpdater',
}, class A extends GObject.Object {
    constructor() {
        super();
        this._dateMenu = Main.panel.statusArea['dateMenu'];
        this._settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
    }

    setup() {
        this._updateClockAndDate();
        this._updateClockId = this._dateMenu._clock.connect('notify::clock',
                                                            this._updateClockAndDate.bind(this));
    }

    teardown() {
        this._dateMenu._clockDisplay.text = this._dateMenu._clock.clock;
        this._dateMenu._clock.disconnect(this._updateClockId);
        this._updateClockId = 0;
    }

    _appendNumber(num) {
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

    _appendOrdinal(num) {
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

    _timeToWords(hours, minutes) {
        let wordHours = hours;
        let wordMinutes = minutes;
        let res = '';

        if (wordMinutes != 0) {
            if (wordMinutes == 15) {
                res = WORDS.it_is_a + ' ' + WORDS.quarter + ' ' + WORDS.past + ' ';
            }
            else if (wordMinutes == 45) {
                res = WORDS.it_is_a + ' ' + WORDS.quarter + ' ' + WORDS.to + ' ';
                wordHours = (wordHours + 1) % 24;
            }
            else if (wordMinutes == 30) {
                res = WORDS.it_is + ' ' + WORDS.half + ' ' + WORDS.past + ' ';
            }
            else if (wordMinutes < 30) {
                res = WORDS.it_is + ' ' + this._appendNumber(wordMinutes) + ' ' + WORDS.past + ' ';
            }
            else {
                res = WORDS.it_is + ' ' + this._appendNumber(60 - wordMinutes) + ' ' + WORDS.to + ' ';
                wordHours = (wordHours + 1) % 24;
            }
        } else {
            res = WORDS.it_is + ' ';
        }

        if (wordHours == 0) {
            res += WORDS.midnight;
        }
        else if (wordHours == 12) {
            res += WORDS.noon;
        }
        else {
            res += this._appendNumber(wordHours % 12);
        }

        if (wordMinutes == 0 && !(wordHours == 0 || wordHours == 12)) {
            res = res + ' ' + WORDS.o_clock;
        }

        return res;
    }

    _dateToWords(weekDay, day, month) {
        return DAYS[weekDay] + ', ' + this._appendOrdinal(day) + ' ' + WORDS.of + ' ' + MONTHS[month];
    }

    _updateClockAndDate() {
        let tz = this._dateMenu._clock.get_timezone();
        let date = GLib.DateTime.new_now(tz);
        let str = this._timeToWords(date.get_hour(), date.get_minute());

        if (this._settings.get_boolean('clock-show-date')) {
            str += (' ' + WORDS.on + ' ' + this._dateToWords(date.get_day_of_week(), date.get_day_of_month(), date.get_month()));
        }

        this._dateMenu._clockDisplay.text = str;
    }
}
);

export default class WordClockExtension extends Extension {
    enable() {
        this._wordClockUpdater = new WordClockUpdater();
        this._wordClockUpdater.setup();
    }

    disable() {
        this._wordClockUpdater.teardown();
        this._wordClockUpdater = null;
    }
}
