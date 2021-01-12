import pytest

from .pages.home_page import HomePage


@pytest.mark.usefixtures('driver_init')
class TestNavigation:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/'

    def test_can_navigate_to_different_page_using_nav_bar(self, url):

        # the user goes to the page
        self.driver.get(url)
        page = HomePage(self.driver)

        # And sees the title, head, and navbar which allows them to select games
        assert page.has_correct_title()
        assert page.has_navigation_bar()
        assert page.has_correct_header()
        assert page.can_select_games()

        # The user then uses the navbar to select different games which brings them to the associated pages
        games = ['snake', 'sudoku', 'tic-tac-toe']
        for game in games:
            page.select_game(game)
            assert game in self.driver.current_url
