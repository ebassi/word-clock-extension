# French Word Clock extension for GNOME Shell

A *very* simple extension that turns the numeric clock of GNOME Shell
into a text version in French. This is a fork from the Word Clock extension at https://github.com/ebassi/word-clock-extension.

### How does it work

The extension monkeypatches the `Main.panel.statusArea.dateMenu` object
and when the wall clock updates its `clock` property, the extension
replaces the `text` property of the label actor with its own processed
version of the time.

The default label of the clock when enabling the extension will contain
words instead of digits.

This is the end result:

![Word clock without date](/word-clock-no-date.png)

If the `clock-show-date` setting of the `org.gnome.desktop.interface`
schema is set to `true` then the extension will show the date as well
as the time:

![Word clock with date](/word-clock-with-date.png)

### How to install

Clone the repository:

    $ git clone git://github.com/jlemonde/french-word-clock-extension
    $ cd french-word-clock-extension

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
