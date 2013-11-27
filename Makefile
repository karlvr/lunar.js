# Consistent.js Makefile

# To install uglify-js:
# npm install uglify-js -g

# To install jslint:
# brew install jslint

SOURCE=src/lunar.js
MINIFIED=$(SOURCE:src/%.js=lib/%.min.js)
GZIPPED=$(MINIFIED:.min.js=.min.js.gz)

UGLIFY_FLAGS=-m --comments '/\/*!/'

all: lib

clean:
	rm -f lib/*.js
	rm -f lib/*.js.gz
	rm -f lib/*.map

lib: libdir $(MINIFIED) $(GZIPPED)
	ls -l lib

libdir:
	mkdir -p lib

lib/%.min.js: src/%.js
	uglifyjs $(UGLIFY_FLAGS) -o $@ --source-map $@.map -p relative -- $<

lib/%.min.js.gz: lib/%.min.js
	gzip -c -n $< > $@

lint:
	find src -name "*.js" -exec jsl -process \{\} \;

.PHONY: all clean lint
