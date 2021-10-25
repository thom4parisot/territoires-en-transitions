from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver


def get_local_driver() -> WebDriver:
    """Retrieve the webdriver
    todo: return the right webdriver for the current OS
    """
    return webdriver.Chrome(executable_path="..\drivers\chromedriver.exe")
