from .base_page import BasePage


class HomePage(BasePage):
    def has_correct_title(self):
        return super().has_correct_title(None)

    def has_correct_header(self):
        return super().has_correct_header(None)
