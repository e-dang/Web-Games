PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`

test-ft:
	pytest