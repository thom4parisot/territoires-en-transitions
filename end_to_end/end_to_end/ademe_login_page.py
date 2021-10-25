from selenium.webdriver.common.by import By


class AdemeLoginPage(object):
    def __init__(self, driver):
        self.driver = driver
        self.email_field = driver.find_element(By.NAME, "username")
        self.password_field = driver.find_element(By.NAME, "password")
        self.login_button = driver.find_element(By.NAME, "login")
