from time import sleep

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

from .base_page import BasePage, TIMEOUT


class SnakePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.body = self.driver.find_elements_by_tag_name('body')

    def has_correct_title(self):
        return super().has_correct_title('Snake')

    def has_correct_header(self):
        return super().has_correct_header('Snake')

    def can_click_start(self):
        element = self.driver.find_element_by_id('startBtn')
        return element.is_displayed() and element.is_enabled()

    def click_start(self):
        self.driver.find_element_by_id('startBtn').click()

    def has_snake(self):
        return len(self._get_board().find_elements_by_class_name('snake')) != 0

    def has_food(self):
        return len(self._get_board().find_elements_by_class_name('food')) != 0

    def get_snake_position(self):
        return self._get_position_of_unique_node_type('snake-head')

    def get_food_position(self):
        return self._get_position_of_unique_node_type('food')

    def get_snake_position_delta(self, timeout=1):
        i_row, i_col = self.get_snake_position()
        sleep(timeout)
        f_row, f_col = self.get_snake_position()
        return f_row - i_row, f_col - i_col

    def press_up_key(self):
        self.body.send_keys(Keys.UP)

    def press_left_key(self):
        self.body.send_keys(Keys.LEFT)

    def press_down_key(self):
        self.body.send_keys(Keys.DOWN)

    def press_right_key(self):
        self.body.send_keys(Keys.RIGHT)

    def press_W_key(self):
        self.body.send_keys('w')

    def press_A_key(self):
        self.body.send_keys('a')

    def press_S_key(self):
        self.body.send_keys('s')

    def press_D_key(self):
        self.body.send_keys('d')

    def wait_for_snake_to_eat_food(self):
        i_pos = self.get_food_position()
        WebDriverWait(self.driver, TIMEOUT).until(lambda x: self.get_food_position() != i_pos)

    def wait_for_snake_to_run_off_grid(self):
        WebDriverWait(self.driver, TIMEOUT).until(lambda x: self.get_snake_position_delta() == (0, 0))

    def is_game_over(self):
        return self.driver.find_element_by_id('gameOverMessage').is_displayed()
