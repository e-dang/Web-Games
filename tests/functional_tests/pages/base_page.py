from time import sleep, time

from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

TIMEOUT = 10


def wait(fn, timeout=TIMEOUT):
    def inner(*args, **kwargs):
        start = time()
        while time() - start < timeout:
            ret_val = fn(*args, **kwargs)
            if ret_val:
                return ret_val
            sleep(1)

        raise TimeoutException
    return inner


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.num_rows = None
        self.num_cols = None

    def wait_to_find_by_id(self, id_):
        return WebDriverWait(self.driver, TIMEOUT).until(EC.visibility_of_element_located((By.ID, id_)))

    def has_correct_title(self, title):
        return self.driver.title == f'Web Games - {title}'

    def has_correct_header(self, header):
        return self.driver.find_element_by_id('currentGame').text == f'- {header}'

    def has_navigation_bar(self):
        return self._get_navbar().is_displayed()

    def has_board(self):
        return self._get_board().is_displayed()

    def board_cells_are_square(self):
        node = self._get_board().find_elements_by_class_name('node')[0]
        width, height = self._extract_pixel_dimensions(node)
        tl, tr, bl, br = self._extract_border_radius(node)
        return width == height and tl == tr == bl == br == '0%'

    def can_select_games(self):
        element = self._get_navbar().find_element_by_id('gameSelection')
        return element.is_displayed() and element.is_enabled()

    def game_is_over(self):
        return self.wait_to_find_by_id('gameOverMessage').is_displayed()

    def clear_modal(self):
        # sleep for modal to appear and disappear because selenium cant properly detect it with WebDriverWait
        sleep(1.5)
        self.driver.find_element_by_id('closeGameOverModal').click()
        sleep(1.5)

    def change_difficulty(self, difficulty):
        self._get_navbar().find_element_by_id('difficultySelection').click()
        self.wait_to_find_by_id(difficulty).click()

    def get_current_difficulty(self):
        return self.wait_to_find_by_id('currentDifficulty').get_attribute('innerText')

    def click_reset(self):
        self.driver.find_element_by_id('resetBtn').click()

    def can_click_reset(self):
        element = self.driver.find_element_by_id('resetBtn')
        return element.is_displayed() and element.is_enabled()

    def _get_navbar(self):
        return self.driver.find_element_by_id('navBar')

    def _get_board(self):
        return self.driver.find_element_by_id('gameBoard')

    def _extract_pixel_dimensions(self, element):
        return element.size['width'], element.size['height']

    def _extract_border_radius(self, element):
        return (element.value_of_css_property('border-top-left-radius'),
                element.value_of_css_property('border-top-right-radius'),
                element.value_of_css_property('border-bottom-left-radius'),
                element.value_of_css_property('border-bottom-right-radius'))

    def _parse_idx_from_node_id(self, node_id):
        return int(node_id[1:])

    def _get_board_dimensions(self):
        board = self._get_board()
        rows = board.find_elements_by_tag_name('tr')
        cols = rows[0].find_elements_by_tag_name('td')
        return len(rows), len(cols)

    def _extract_node_position_from_idx(self, idx):
        if self.num_rows is None or self.num_cols is None:
            self.num_rows, self.num_cols = self._get_board_dimensions()

        row = idx // self.num_cols
        col = idx - row * self.num_cols
        return row, col

    def _get_node_position(self, element):
        idx = self._parse_idx_from_node_id(element.get_attribute('id'))
        return self._extract_node_position_from_idx(idx)

    def _get_position_of_unique_node_type(self, n_type):
        elements = self._get_board().find_elements_by_class_name(n_type)
        if len(elements) == 0:
            raise NoSuchElementException(f'No {n_type} is on the screen')
        elif len(elements) > 1:
            raise RuntimeError(f'There are more than one occurances of {n_type} on the screen')

        return self._get_node_position(elements[0])

    def _create_node_id(self, row, col):
        if self.num_rows is None or self.num_cols is None:
            self.num_rows, self.num_cols = self._get_board_dimensions()

        return f'n{row * self.num_cols + col}'

    def _get_node(self, row, col):
        return self.driver.find_element_by_id(self._create_node_id(row, col))
