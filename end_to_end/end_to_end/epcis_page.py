from selenium.webdriver.common.by import By


class EpcisPage(object):
    def __init__(self, driver):
        self.driver = driver
        self.top_section = driver.find_element(By.TAG_NAME, "section")
