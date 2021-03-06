from .base_page import BasePage, wait
from selenium.webdriver.common.keys import Keys


class SudokuPage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title('Sudoku')

    def has_correct_header(self):
        return super().has_correct_header('Sudoku')

    @wait
    def board_cells_contain_numbers(self):
        board = self._get_board()
        nums = list(map(str, range(10)))
        for cell in board.find_elements_by_tag_name('td'):
            if cell.text in nums:
                return True

        return False

    def can_click_reset(self):
        element = self.driver.find_element_by_id('resetBtn')
        return element.is_displayed() and element.is_enabled()

    def can_click_hint(self):
        element = self.driver.find_element_by_id('hintBtn')
        return element.is_displayed() and element.is_enabled()

    def get_empty_node(self):
        for element in self._get_board().find_elements_by_tag_name('td'):
            if element.get_attribute('innerText') == '':
                return self._get_node_position(element)

    def enter_number(self, row, col, value):
        element = self.driver.find_element_by_id(self._create_input_id(row, col))
        element.clear()
        element.send_keys(value)
        element.send_keys(Keys.ENTER)

    def get_node_input_value(self, row, col):
        return self._get_node_input(row, col).get_attribute('value')

    def get_board_as_array(self):
        if self.num_rows is None or self.num_cols is None:
            self.num_rows, self.num_cols = self._get_board_dimensions()

        board_arr = []
        board = self._get_board()
        for i in range(self.num_rows):
            board_arr.append([])
            for j in range(self.num_cols):
                board_arr[i].append(board.find_element_by_id(self._create_node_id(i, j)).get_attribute('innerText'))

        return board_arr

    def click_get_hint(self):
        self.driver.find_element_by_id('hintBtn').click()

    def node_has_error_border(self, row, col):
        return 'error' in self._get_node(row, col).get_attribute('class').split(' ')

    def node_has_error_section_background(self, row, col, level):
        return f'error-section{level}' in self._get_node(row, col).get_attribute('class')

    def _create_input_id(self, row, col):
        if self.num_rows is None or self.num_cols is None:
            self.num_rows, self.num_cols = self._get_board_dimensions()

        return f'i{row * self.num_cols + col}'

    def _get_node_input(self, row, col):
        return self.driver.find_element_by_id(self._create_input_id(row, col))
