from selenium.webdriver.support.wait import WebDriverWait

from end_to_end.ademe_login_page import AdemeLoginPage
from end_to_end.configuration import AUTH_USER_EMAIL, AUTH_USER_PASSWORD
from end_to_end.root_page import RootPage
from end_to_end.routes import root_url


def test_signing_in_with_existing_user_should_redirect_to_epcis(driver):
    driver.get(root_url())
    root_page = RootPage(driver)
    root_page.connection_button.click()

    login_page = AdemeLoginPage(driver)
    assert login_page.email_field, "email field is missing"
    assert login_page.password_field, "password field is missing"
    assert login_page.login_button, "login button is missing"

    login_page.email_field.send_keys(AUTH_USER_EMAIL)
    login_page.password_field.send_keys(AUTH_USER_PASSWORD)

    login_page.login_button.click()
    wait = WebDriverWait(driver, 10)
    wait.until(lambda driver: driver.current_url.endswith("epcis/"))
    assert driver.current_url.endswith("epcis/"), "page url is wrong"
