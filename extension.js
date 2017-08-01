const DONNER_LHEURE_EXACTE = false;

const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GnomeDesktop = imports.gi.GnomeDesktop;
const Lang = imports.lang;
const Main = imports.ui.main;
const St = imports.gi.St;

const HEURES = [
   'minuit',
   'une heure',
   'deux heures',
   'trois heures',
   'quatre heures',
   'cinq heures',
   'six heures',
   'sept heures',
   'huit heures',
   'neuf heures',
   'dix heures',
   'onze heures',
   'midi',
   'treize heures',
   'quatorze heures',
   'quinze heures',
   'seize heures',
   'dix-sept heures',
   'dix-huit heures',
   'dix-neuf heures',
   'vingt heures',
   'vingt-et-une heures',
   'vingt-deux heures',
   'vingt-trois heures',
   'minuit'
];

const NOMBRES_FEMININ = [
   '',
   'une',
   'deux',
   'trois',
   'quatre',
   'cinq',
   'six',
   'sept',
   'huit',
   'neuf',
   'dix',
   'onze',
   'douze',
   'treize',
   'quatorze',
   'quinze',
   'seize',
   'dix-sept',
   'dix-huit',
   'dix-neuf',
   'vingt',
   'vingt-et-une',
   'vingt-deux',
   'vingt-trois',
   'vingt-quatre',
   'vingt-cinq',
   'vingt-six',
   'vingt-sept',
   'vingt-huit',
   'vingt-neuf',
   'trente',
   'trente-et-une',
   'trente-deux',
   'trente-trois',
   'trente-quatre',
   'trente-cinq',
   'trente-six',
   'trente-sept',
   'trente-huit',
   'trente-neuf',
   'quarante',
   'quarante-et-une',
   'quarante-deux',
   'quarante-trois',
   'quarante-quatre',
   'quarante-cinq',
   'quarante-six',
   'quarante-sept',
   'quarante-huit',
   'quarante-neuf',
   'cinquante',
   'cinquante-et-une',
   'cinquante-deux',
   'cinquante-trois',
   'cinquante-quatre',
   'cinquante-cinq',
   'cinquante-six',
   'cinquante-sept',
   'cinquante-huit',
   'cinquante-neuf'
];

const MOTS = {
   pres_de        : 'presque $',
   passees        : '$ passées',
   passee         : '$ passée',
   passe          : 'passé $'
};

function donnerLHeure(h, m){
   var lheure;

   if(DONNER_LHEURE_EXACTE){
      lheure = HEURES[h] + ' ' + NOMBRES_FEMININ[m];
   }
   else{
      let add_one = false;
      if(m < 3){
         lheure = HEURES[h == 12 ? h : h % 12];
      }
      else if(m >= 3 && m < 8){
         lheure = HEURES[h == 12 ? h : h % 12] + ' cinq';
      }
      else if(m >= 8 && m < 13){
         lheure = HEURES[h == 12 ? h : h % 12] + ' dix';
      }
      else if(m >= 13 && m < 18){
         lheure = HEURES[h == 12 ? h : h % 12] + ' et quart';
      }
      else if(m >= 18 && m < 23){
         lheure = HEURES[h == 12 ? h : h % 12] + ' vingt';
      }
      else if(m >= 23 && m < 28){
         lheure  = HEURES[h == 12 ? h : h % 12] + ' vingt-cinq';
      }
      else if(m >= 28 && m < 33){
         lheure = HEURES[h == 12 ? h : h % 12] + ' et demi' + (h == 12 || h == 24 || h == 0 ? '' : 'e');
      }
      else if(m >= 33 && m < 38){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)] + ' moins vingt-cinq';
      }
      else if(m >= 38 && m < 43){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)] + ' moins vingt';
         add_one = true;
      }
      else if(m >= 43 && m < 48){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)] + ' moins le quart';
         add_one = true;
      }
      else if(m >= 48 && m < 53){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)] + ' moins dix';
         add_one = true;
      }
      else if(m >= 53 && m < 58){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)] + ' moins cinq';
         add_one = true;
      }
      else if(m >= 58){
         lheure = HEURES[h == 23 ? 24 : (h % 12 + 1)];
         add_one = true;
      }
      else{
         lheure = 'ERREUR'; // Ne sait-on jamais
      }

      if(m % 5 == 1 || m % 5 == 2){
         let H = (h + add_one);
         lheure = MOTS[H == 12 || H == 24 || H == 0 ? 'passe' : (H % 12 == 1 ? 'passee' : 'passees')].replace('$', lheure);
      }
      else if(m % 5 == 3 || m % 5 == 4){
         lheure = MOTS['pres_de'].replace('$', lheure);
      }
   }

   return "C'est " + lheure;
}

const JOURS_DE_LA_SEMAINE = [
  '',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
];

function nombre_masculin(nombr){
   var nombr = NOMBRES_FEMININ[nombr];
   if(nombr % 10 == 1 && nombr != 11){
      nombr = nombr.substr(0, nombr.length - 1);
   }
   return nombr;
}

function donnerLeJour(jourSem, jour, mois){
   return ", " + JOURS_DE_LA_SEMAINE[jourSem] + ' ' + (jour == 1 ? 'premier' : nombre_masculin(jour));
   // As of now, I don't write the month because it would be too long.
}

let settings = null;
let dateMenu = null;
let updateClockId = 0;

function updateClockAndDate(){
   let tz = dateMenu._clock.get_timezone();
   let date = GLib.DateTime.new_now(tz);

   let str = donnerLHeure(date.get_hour(), date.get_minute());

   if(settings.get_boolean('clock-show-date')) {
      str += donnerLeJour(date.get_day_of_week(), date.get_day_of_month(), date.get_month());
   }

   dateMenu._clockDisplay.text = str;
}

function init(){
   dateMenu = Main.panel.statusArea['dateMenu'];
   if(!dateMenu){
      log('No dateMenu panel element defined.');
      return;
   }

   settings = new Gio.Settings({schema: 'org.gnome.desktop.interface'});
}

function enable(){
   if(!dateMenu){
      return;
   }

   if(updateClockId != 0){
      dateMenu._clock.disconnect(updateClockId);
   }

   updateClockId = dateMenu._clock.connect('notify::clock', Lang.bind(dateMenu, updateClockAndDate));
   updateClockAndDate();
}

function disable(){
   if(!dateMenu){
      return;
   }

   if(updateClockId != 0){
      dateMenu._clock.disconnect(updateClockId);
      updateClockId = 0;
   }

   dateMenu._clockDisplay.text = dateMenu._clock.clock;
}
