import pytest
from selenium.webdriver.support.wait import WebDriverWait

from end_to_end.ademe_login_page import AdemeLoginPage
from end_to_end.configuration import AUTH_USER_EMAIL, AUTH_USER_PASSWORD
from end_to_end.root_page import RootPage
from end_to_end.routes import root_url
from utils.drivers import get_local_driver


@pytest.fixture()
def driver(request):
    """Return the default driver"""

    def teardown():
        driver.quit()

    request.addfinalizer(teardown)
    driver = get_local_driver()
    driver.implicitly_wait(10)
    return driver


@pytest.fixture()
def signed_in_driver(driver):
    """Return the driver of a signed in user"""
    assert AUTH_USER_EMAIL, "AUTH_USER_EMAIL environment variable is empty"
    assert AUTH_USER_PASSWORD, "AUTH_USER_PASSWORD environment variable is empty"

    driver.get(root_url())
    root_page = RootPage(driver)
    root_page.connection_button.click()

    login_page = AdemeLoginPage(driver)
    login_page.email_field.send_keys(AUTH_USER_EMAIL)
    login_page.password_field.send_keys(AUTH_USER_PASSWORD)
    login_page.login_button.click()

    # eventually we should be redirected to epcis page.
    wait = WebDriverWait(driver, 10)
    wait.until(lambda d: d.current_url.endswith("epcis/"))
    return driver
