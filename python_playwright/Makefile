# Makefile for Playwright Tests

# Базова змінна для запуску pytest (вказує на конфіг файл)
PYTEST = pytest -c pytest.ini

# Запустити всі тести
test:
	$(PYTEST)

# Запустити тільки UI тести
test-ui:
	$(PYTEST) -m ui

# Запустити тільки API тести
test-api:
	$(PYTEST) -m api

# Запустити тільки E2E тести
test-e2e:
	$(PYTEST) -m e2e

# Запустити UI тести з видимим браузером (headed)
test-headed:
	$(PYTEST) -m ui --headed --slowmo 500

# Запустити конкретний файл (передайте PATH=шлях/до/файлу)
test-file:
	$(PYTEST) $(PATH)

# Запустити конкретний тест test_google_ui з видимим браузером Chrome
test-google:
	pytest tests/ui_tests/test_google_ui.py --headed --slowmo 1000 --browser-channel chrome

# Встановити залежності
install:
	pip install -r requirements.txt
	playwright install

# Очистити кеш та звіти
clean:
	rm -rf .pytest_cache report.html assets/
