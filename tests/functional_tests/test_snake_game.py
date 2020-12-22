import pytest
from .pages.snake_page import SnakePage


@pytest.mark.usefixtures('driver_init')
class TestNav:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/'

    def test_user_is_presented_with_correct_elements_and_options(self, url):
        # The user goes to the webpage
        self.driver.get(url)
        page = SnakePage(self.driver)

        # the user sees the correct page title
        assert page.has_correct_title()

        # they then see a navigation bar with a header specifying the current game and a dropdown menu to select
        # different games
        assert page.has_navigation_bar()
        assert page.has_correct_header()
        assert page.can_select_games()

        # they also notice that there is a board and button that allows them to start the game
        assert page.has_board()
        assert page.can_click_start()

        # they click the button and notice that the button can not be clicked again
        page.click_start()
        assert not page.can_click_start()

        # they notice that they can still select a new game from the drop down menu though
        assert page.can_select_games()
