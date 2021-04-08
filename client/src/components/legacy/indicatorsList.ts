import { init } from './indicatorForm'

const forms = document.querySelectorAll<HTMLFormElement>('[data-component="indicatorForm"]')

forms.forEach((form): void => {
    init(form);
})
