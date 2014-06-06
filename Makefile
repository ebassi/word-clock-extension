EXTENSION_NAME = word-clock
UUID = $(EXTENSION_NAME)@emmanuelebassi.name
ZIP = `which zip`

install_data = metadata.json extension.js

install:
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

all:

release: clean
	$(ZIP) -j $(EXTENSION_NAME).zip $(install_data)

clean:
	@rm -f $(EXTENSION_NAME).zip
