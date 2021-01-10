from .base_page import BasePage


class TicTacToePage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title('Tic Tac Toe')

    def has_correct_header(self):
        return super().has_correct_header('Tic Tac Toe')

    def click_node(self, row, col):
        self._get_node(row, col).click()

    def get_empty_node(self):
        for element in self._get_board().find_elements_by_tag_name('td'):
            if element.get_attribute('innerText') == '':
                return self._get_node_position(element)

    def node_has_symbol(self, row, col, symbol):
        return self._get_node(row, col).get_attribute('innerText') == symbol

    def can_select_symbol(self):
        x = self.driver.find_element_by_id('x')
        o = self.driver.find_element_by_id('o')
        return x.is_enabled() and x.is_displayed() and o.is_enabled() and o.is_displayed()

    def select_symbol(self, symbol):
        self.driver.find_element_by_id(f'{symbol}-label').click()
