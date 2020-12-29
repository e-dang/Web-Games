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
