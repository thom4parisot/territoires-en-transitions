from selenium.webdriver.common.by import By


class RootPage(object):
    def __init__(self, driver):
        self.driver = driver
        self.create_account_button = driver.find_element(
            By.PARTIAL_LINK_TEXT, "Créer un compte"
        )
        self.connection_button = driver.find_element(
            By.PARTIAL_LINK_TEXT, "Se connecter"
        )
