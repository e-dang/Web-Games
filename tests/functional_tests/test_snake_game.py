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
        assert page.board_cells_are_square()
        assert page.can_click_start()

        # they click the button and notice that the button can not be clicked again
        page.click_start()
        assert not page.can_click_start()

        # they notice that they can still select a new game from the drop down menu though
        assert page.can_select_games()

    def test_snake_game_controls_and_triggers_work(self, url):
        # The user goes to the webpage
        self.driver.get(url)
        page = SnakePage(self.driver)

        # The user clicks the start button to begin playing the game
        page.click_start()

        # The user sees a snake appear on the screen and a piece of food
        assert page.has_snake()
        assert page.has_food()

        # The user sees that the snake is moving
        d_row, d_col = page.get_snake_position_delta()
        assert d_row != 0 or d_col != 0

        # The snake then eats the food and the user sees that the snake grows by one unit of length
        i_length = page.get_snake_length()
        page.wait_for_snake_to_eat_food()
        assert page.get_snake_length() > i_length

        # The user can control the snake with arrow keys
        page.press_up_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row < 0 and d_col == 0

        page.press_left_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col < 0

        page.press_down_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row > 0 and d_col == 0

        page.press_right_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col > 0

        # The user can also control the snake with "W A S D" keys
        page.press_W_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row < 0 and d_col == 0

        page.press_A_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col < 0

        page.press_S_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row > 0 and d_col == 0

        page.press_D_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col > 0

        # The user then runs the snake off the board and sees that the game is over
        page.wait_for_snake_to_run_off_grid()
        assert page.is_game_over()

        # The user has the option to play again
        assert page.can_click_start()
