import os
from datetime import datetime

import pytest
from selenium import webdriver
from selenium.webdriver import FirefoxOptions


def pytest_addoption(parser):
    parser.addoption('--headless', action='store_true', default=False)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):  # set up a hook to be able to check if a test has failed
    # execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()

    # set a report attribute for each phase of a call, which can
    # be "setup", "call", "teardown"
    setattr(item, "rep_" + rep.when, rep)


@pytest.fixture(scope="function", autouse=True)
def test_failed_check(request):  # check if a test has failed
    yield
    # request.node is an "item" because we use the default
    # "function" scope
    if request.node.rep_setup.failed:
        print("setting up a test failed!", request.node.nodeid)
    elif request.node.rep_setup.passed:
        if request.node.rep_call.failed:
            driver = request.node.instance.driver
            take_screenshot(driver, request.node.nodeid)


def take_screenshot(driver, nodeid):  # make a screenshot with a name of the test, date and time
    file_name = f'{nodeid}_{datetime.today().strftime("%Y-%m-%d_%H:%M")}.png'.replace("/", "_").replace("::", "__")
    screenshot_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
    if not os.path.exists(screenshot_dir):
        os.mkdir(screenshot_dir)
    driver.save_screenshot(os.path.join(screenshot_dir, file_name))


@pytest.fixture(params=['firefox'], scope='class')
def driver_init(request, pytestconfig):
    if pytestconfig.getoption('headless'):
        opts = FirefoxOptions()
        opts.add_argument('--headless')
        request.cls.driver = webdriver.Firefox(options=opts)
    else:
        request.cls.driver = webdriver.Firefox()

    request.cls.driver.set_window_size(1500, 1500)

    yield

    request.cls.driver.quit()
