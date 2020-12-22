from .base_page import BasePage


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
