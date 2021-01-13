import pytest
from .pages.snake_page import SnakePage


@pytest.mark.usefixtures('driver_init')
class TestSnakeGame:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:5000/snake'

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

    @pytest.mark.parametrize('url, up_func, left_func, down_func, right_func', [
        (None, 'press_up_key', 'press_left_key', 'press_down_key', 'press_right_key'),
        (None, 'press_W_key', 'press_A_key', 'press_S_key', 'press_D_key')
    ],
        indirect=['url'],
        ids=['arrow_keys', 'wasd_keys'])
    def test_snake_game_controls_and_triggers_work(self, url, up_func, left_func, down_func, right_func):
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
        getattr(page, up_func)()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row < 0 and d_col == 0

        getattr(page, left_func)()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col < 0

        getattr(page, down_func)()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row > 0 and d_col == 0

        getattr(page, right_func)()
        # page.press_right_key()
        d_row, d_col = page.get_snake_position_delta()
        assert d_row == 0 and d_col > 0

        # The user then runs the snake off the board and sees that the game is over
        page.wait_for_snake_to_run_off_grid()
        assert page.game_is_over()

        # The user has the option to play again
        assert page.can_click_start()

    def test_snake_game_keeps_track_of_current_and_high_score(self, url):
        # The user goes to the webpage
        self.driver.get(url)
        page = SnakePage(self.driver)

        # the user starts the game and sees that the current and high scores are 0
        page.click_start()
        assert page.current_score() == 0
        assert page.high_score() == 0

        # the snake then eats food and the user sees that the current score has incremented but the high score has not
        page.wait_for_snake_to_eat_food()
        current_score = page.current_score()
        assert current_score > 0

        # the snake then crashes into the wall and the user sees the high score is now equal to the current score
        page.wait_for_snake_to_run_off_grid()
        assert page.game_is_over()
        assert page.high_score() == current_score

        # the user then starts the game again and sees the current score go to 0, but the high score remains
        page.clear_modal()
        page.click_start()
        assert page.current_score() == 0
        assert page.high_score() == current_score
