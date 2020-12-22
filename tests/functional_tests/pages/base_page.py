from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

TIMEOUT = 5


class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def wait_to_find_by_id(self, id_):
        WebDriverWait(self.driver, TIMEOUT).until(EC.visibility_of_element_located(self.driver.find_element_by_id(id_)))
        return self.driver.find_element_by_id(id_)

    def has_correct_title(self, title):
        return self.driver.title == f'Web Games - {title}'

    def has_correct_header(self, header):
        return self.driver.wait_to_find_by_id('currentGame').text == header

    def has_navigation_bar(self):
        return self.driver.find_element_by_id('navBar').is_displayed()

    def has_board(self):
        return self.driver.find_element_by_id('gameBoard').is_displayed()

    def can_select_games(self):
        element = self.driver.find_element_by_id('gameSelection')
        return element.is_displayed() and element.is_enabled()
