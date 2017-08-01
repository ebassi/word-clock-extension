EXTENSION_NAME = french-word-clock
NAME = French Word Clock
VERSION = 9
URL = https://github.com/jlemonde/french-word-clock-extension

UUID = $(EXTENSION_NAME)@jlemonde.name
SED = `which sed`
ZIP = `which zip`

install_data = metadata.json extension.js

metadata.json: metadata.json.in Makefile
	@$(SED) \
	  -e "s|@NAME@|$(NAME)|" \
	  -e "s|@UUID@|$(UUID)|" \
	  -e "s|@VERSION@|$(VERSION)|" \
	  -e "s|@URL@|$(URL)|" \
	< $< > $@

install: $(install_data)
	@if test -z $$XDG_DATA_HOME; then \
	   EXTENSIONS_HOME=$$HOME/.local/share/gnome-shell/extensions ; \
	 else \
	   EXTENSIONS_HOME=$$XDG_DATA_HOME/gnome-shell/extensions ; \
	 fi ; \
	 mkdir -p $$EXTENSIONS_HOME/$(UUID) && \
	 cp -f $(install_data) $$EXTENSIONS_HOME/$(UUID)/

uninstall:
	@if test -z $$XDG_DATA_HOME; then \
	   EXTENSIONS_HOME=$$HOME/.local/share/gnome-shell-extensions ; \
	 else \
	   EXTENSIONS_HOME=$$XDG_DATA_HOME/gnome-shell/extensions ; \
	 fi ; \
	 rm -rf $$EXTENSIONS_HOME/$(UUID)

all: $(install_data)

release: clean $(install_data)
	$(ZIP) -j $(EXTENSION_NAME)-$(VERSION).zip $(install_data)

clean:
	@rm -f metadata.json
	@rm -f $(EXTENSION_NAME)-$(VERSION).zip
