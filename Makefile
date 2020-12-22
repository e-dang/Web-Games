PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`

install:
	pip3 install -r requirements.txt
	npm install

test-ft:
	pytest