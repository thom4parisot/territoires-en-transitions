from selenium.webdriver.common.by import By
from selenium.webdriver.support.relative_locator import locate_with
from selenium.webdriver.support.wait import WebDriverWait

from end_to_end.epcis_page import EpcisPage
from end_to_end.routes import epcis_url


def test_signed_in_user_should_have_ville_de_test_recap_card(signed_in_driver):
    signed_in_driver.get(epcis_url())
    wait = WebDriverWait(signed_in_driver, 20)
    wait.until(lambda d: d.find_element(By.XPATH, "//*[text() = 'Ville de test']"))

    page = EpcisPage(signed_in_driver)
    assert page.top_section, "top section is missing"

    # get the title
    ville_title = page.top_section.find_element(
        By.XPATH, "//*[text() = 'Ville de test']"
    )
    assert ville_title, "Ville de test title is missing"

    # check plan column
    plan_column_title = signed_in_driver.find_element(
        locate_with(By.XPATH, '//*[text() = "Plan d\'actions"]').below(ville_title)
    )
    assert plan_column_title, "Plan action column title is missing"
