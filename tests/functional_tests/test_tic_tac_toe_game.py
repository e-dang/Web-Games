import pytest

from .pages.tictactoe_page import TicTacToePage


@pytest.mark.usefixtures('driver_init')
class TestTicTacToe:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/tic-tac-toe'

    def test_user_is_presented_with_correct_elements_and_options(self, url):
        # The user goes to the webpage
        self.driver.get(url)
        page = TicTacToePage(self.driver)

        # the user sees the correct page title
        assert page.has_correct_title()

        # they then see a navigation bar with a header specifying the current game and a dropdown menu to select
        # different games
        assert page.has_navigation_bar()
        assert page.has_correct_header()
        assert page.can_select_games()

        # they also notice that there is a board and button that allows them to reset the game
        assert page.has_board()
        assert page.board_cells_are_square()
        assert page.can_click_reset()

        # they also notice that they can change the difficulty of the opponent player
        page.change_difficulty('easy')
        assert page.get_current_difficulty() == 'Easy'
        page.change_difficulty('moderate')
        assert page.get_current_difficulty() == 'Moderate'
        page.change_difficulty('hard')
        assert page.get_current_difficulty() == 'Hard'
