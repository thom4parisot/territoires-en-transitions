from end_to_end.root_page import RootPage
from end_to_end.routes import root_url


def test_app_name_should_be_in_the_page_title(driver):
    driver.get(root_url())
    assert "Territoires en Transitions" in driver.title


def test_buttons_should_exist(driver):
    driver.get(root_url())
    page = RootPage(driver)
    assert page.create_account_button, "create account button is missing"
    assert page.connection_button, "connection button is missing"
