# Word clock extension for GNOME Shell

A *very* simple extension that turns the numeric clock of GNOME Shell
into a text version, using British English conventions.

### How does it work

The extension monkeypatches the `Main.panel.statusArea.dateMenu` object
and replaces the `_updateClockAndDate` method with its own version.

The default label of the clock when enabling the extension will contain
words instead of digits.

This is the end result:

![Screenshot](/word-clock-screenshot.png)

If the `clock-show-date` setting of the `org.gnome.desktop.interface`
schema is set to `true` then the extension will show the date as well
as the time.

### How to install

Clone the repository:

    $ git clone git://github.com/ebassi/word-clock-extension
    $ cd word-clock-extension

And type:

    $ make install

From the cloned repository. The extension will be copied in your `$HOME`
directory. You can use the GNOME Tweak Tool or the [GNOME Extensions](https://extensions.gnome.org)
website to enable it.

### Conflicts

This extension will likely conflict with every other extension that
changes the clock in the Shell panel.

### License

This extension is released under the terms of the MIT/X11 license.

See the `LICENSE` file for more details.
