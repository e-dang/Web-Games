from .base_page import BasePage


class SudokuPage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title('Sudoku')

    def has_correct_header(self):
        return super().has_correct_header('Sudoku')

    def board_cells_contain_numbers(self):
        board = self._get_board()
        nums = map(str, range(10))
        for column in board.find_elements_by_tag_name('td'):
            if column.text in nums:
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
        element.send_keys(value)

    def get_node_value(self, row, col):
        return self._get_node(row, col).get_attribute('innerText')

    def _create_input_id(self, row, col):
        if self.num_rows is None or self.num_cols is None:
            self.num_rows, self.num_cols = self._get_board_dimensions()

        return f'i{row * self.num_cols + col}'
