PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`
HEADLESS := $(if $(CI), --headless, )

install:
	pip3 install -r requirements.txt
	npm install

test-ft:
	pytest $(HEADLESS) functional_tests