from playwright.sync_api import Page, expect
from faker import Faker


def test_google_search(page: Page):
    fake = Faker()
    # Генеруємо рандомний текст
    random_text = fake.sentence()

    # 1. Юзер переходить на сторінку google.com.ua
    page.goto("https://google.com.ua")

    # Локатор для поля пошуку (може бути input або textarea залежно від версії)
    search_input = page.locator("textarea[name='q']").or_(page.locator("input[name='q']"))

    # 2. Перевіряємо, що поле пошуку видиме.
    expect(search_input).to_be_visible()

    # 3. Вводимо у поле пошуку рандомний текст.
    search_input.fill(random_text)

    # 4. Перевіряємо що у інпуті поля пошуку є дійсно наш введенний рандомний текст.
    expect(search_input).to_have_value(random_text)

    # 5. Очищуємо поле вводу.
    search_input.clear()
    
    # Перевіряємо, що поле пусте після очищення (опціонально, але корисно для підтвердження кроку 5)
    expect(search_input).to_have_value("")

    # 6. Завершуємо тест (функція закінчується тут)
