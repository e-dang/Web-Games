from .base_page import BasePage


class HomePage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title(None)

    def has_correct_header(self):
        return super().has_correct_header(None)

    def select_game_using_cards(self, game):
        id_map = {
            'snake': 'snakeCard',
            'sudoku': 'sudokuCard',
            'tic-tac-toe': 'ticTacToeCard'
        }
        self.driver.find_element_by_id(id_map[game]).click()

    def click_home_page(self):
        self.driver.find_element_by_id('navBarHeader').click()
