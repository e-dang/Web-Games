import pytest


@pytest.mark.usefixtures('driver_init')
class TestNav:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/'

    def test_nav_bar(self, url):
        self.driver.get(url)

        self.driver.find_element_by_id('navBar')
