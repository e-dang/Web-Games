from time import sleep

from selenium.webdriver.support.ui import WebDriverWait

from .base_page import TIMEOUT, BasePage

TIME_STEP = 0.13


class SnakePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)

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
        return self.get_snake_length() != 0

    def has_food(self):
        return len(self._get_board().find_elements_by_class_name('food')) != 0

    def get_snake_position(self):
        return self._get_position_of_unique_node_type('snake-head')

    def get_food_position(self):
        return self._get_position_of_unique_node_type('food')

    def get_snake_position_delta(self, timeout=TIME_STEP):
        i_row, i_col = self.get_snake_position()
        sleep(timeout)
        f_row, f_col = self.get_snake_position()
        return f_row - i_row, f_col - i_col

    def press_up_key(self):
        self._press_and_hold_key('ArrowUp')

    def press_left_key(self):
        self._press_and_hold_key('ArrowLeft')

    def press_down_key(self):
        self._press_and_hold_key('ArrowDown')

    def press_right_key(self):
        self._press_and_hold_key('ArrowRight')

    def press_W_key(self):
        self._press_and_hold_key('w')

    def press_A_key(self):
        self._press_and_hold_key('a')

    def press_S_key(self):
        self._press_and_hold_key('s')

    def press_D_key(self):
        self._press_and_hold_key('d')

    def wait_for_snake_to_eat_food(self):
        i_pos = self.get_food_position()
        WebDriverWait(self.driver, TIMEOUT).until(lambda x: self.get_food_position() != i_pos)

    def wait_for_snake_to_run_off_grid(self):
        WebDriverWait(self.driver, TIMEOUT).until(lambda x: self.get_snake_position_delta() == (0, 0))

    def get_snake_length(self):
        return len(self._get_board().find_elements_by_class_name('snake'))

    def _press_and_hold_key(self, key, timeout=TIME_STEP):
        command = '''
        const down = new Event('keydown');\n
        down.key = '{0}';\n
        document.dispatchEvent(down);\n
        const performUp = () => {{\n
            const up = new Event('keyup');\n
            up.key = '{1}';\n
            document.dispatchEvent(up);\n
        }};\n
        setTimeout(performUp, 60);\n
        '''.format(key, key)
        self.driver.execute_script(command)
        sleep(timeout)
