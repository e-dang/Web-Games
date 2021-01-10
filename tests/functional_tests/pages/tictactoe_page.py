from .base_page import BasePage


class TicTacToePage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title('Tic Tac Toe')

    def has_correct_header(self):
        return super().has_correct_header('Tic Tac Toe')
