import pytest
from selenium import webdriver
from selenium.webdriver import FirefoxOptions


def pytest_addoption(parser):
    parser.addoption('--headless', action='store_true', default=False)


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
