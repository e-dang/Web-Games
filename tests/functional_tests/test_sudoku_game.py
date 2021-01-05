import pytest

from .pages.sudoku_page import SudokuPage


@pytest.mark.usefixtures('driver_init')
class TestSudokuGame:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/sudoku'

    def test_user_is_presented_with_correct_controls_and_options(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user sees the correct page title
        assert page.has_correct_title()

        # they then see a navigation bar with a header specifying the current game and a dropdown menu to select
        # different games
        assert page.has_navigation_bar()
        assert page.has_correct_header()
        assert page.can_select_games()

        # they also notice that there is a board and 2 buttons, one that allows them to reset the game, and one to get a hint
        assert page.has_board()
        assert page.board_cells_are_square()
        assert page.board_cells_contain_numbers()
        assert page.can_click_reset()
        assert page.can_click_hint()

    def test_user_can_enter_valid_but_not_invalid_inputs_into_board_cells(self, url):
        # The user goes to the page
        self.driver.get(url)
        page = SudokuPage(self.driver)

        # the user selects an empty cell and enters a letter, but doesnt see it appear in the cell
        row, col = page.get_empty_node()
        page.enter_number(row, col, 'a')
        assert page.get_node_input_value(row, col) == ''

        # the user then tries to input 0 and again does not see it appear in the cell
        page.enter_number(row, col, 0)
        assert page.get_node_input_value(row, col) == ''

        # the user now tries to input 1 - 9 and sees that they all appear in the cell
        for i in range(1, 10):
            page.enter_number(row, col, i)
            assert page.get_node_input_value(row, col) == str(i)

        # the user then tries to enter a double digit number, but only sees the first digit of that number appear
        page.enter_number(row, col, 12)
        assert page.get_node_input_value(row, col) == '1'
