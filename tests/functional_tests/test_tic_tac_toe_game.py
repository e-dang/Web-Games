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

        # they also notice that there is a board, a button that allows them to reset the game, and a button to
        # select their symbol
        assert page.has_board()
        assert page.board_cells_are_square()
        assert page.can_click_reset()
        assert page.can_select_symbol()

        # they also notice that they can change the difficulty of the opponent player
        page.change_difficulty('easy')
        assert page.get_current_difficulty() == 'Easy'
        page.change_difficulty('moderate')
        assert page.get_current_difficulty() == 'Moderate'
        page.change_difficulty('hard')
        assert page.get_current_difficulty() == 'Hard'

    @pytest.mark.parametrize('difficulty', [
        ('easy'),
        ('moderate'),
        ('hard'),
    ])
    @pytest.mark.parametrize('url, symbol', [
        (None, 'x'),
        (None, 'o')
    ],
        indirect=['url'],
        ids=['x', 'o'])
    def test_user_can_play_tic_tac_toe(self, url, symbol, difficulty):
        # The user goes to the webpage
        self.driver.get(url)
        page = TicTacToePage(self.driver)

        # the user selects the difficulty and their symbol
        page.change_difficulty(difficulty)
        page.select_symbol(symbol)

        # the user then clicks a node and sees their symbol appear in the node
        row, col = page.get_empty_node()
        page.click_node(row, col)
        assert page.get_node_symbol(row, col) == symbol

        # the user also sees a node containing the opposite symbol from the computer making a move
        opposite_symbol = 'x' if symbol == 'o' else 'o'
        has_node_with_opp_symbol = False
        for row in range(page.num_rows):
            for col in range(page.num_cols):
                if page.get_node_symbol(row, col) == opposite_symbol:
                    opp_row = row
                    opp_col = col
                    has_node_with_opp_symbol = True
                    break
            else:
                continue
            break

        assert has_node_with_opp_symbol

        # the user tries to click that node but nothing happens
        page.click_node(opp_row, opp_col)
        assert page.get_node_symbol(opp_row, opp_col) == opposite_symbol

        # the user then clicks reset and sees that at most there is 1 node containing a symbol
        page.click_reset()
        count = 0
        for row in range(page.num_rows):
            for col in range(page.num_cols):
                if page.get_node_symbol(row, col) != '':
                    count += 1

        assert count < 2

        # the user can still click nodes despite the game reseting
        row, col = page.get_empty_node()
        page.click_node(row, col)
        assert page.get_node_symbol(row, col) == symbol
