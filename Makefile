PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`
HEADLESS := $(if $(CI), --headless, )

install:
	pip3 install -r requirements.txt
	npm install

build:
	npm run build-dev

build-prod:
	npm run build-prod

test-unit:
	cd $(PROJECT_DIR) && \
	npm run test

test-ft:
	cd $(PROJECT_DIR) && \
	pytest $(HEADLESS) tests/functional_tests

test: test-unit test-ft
