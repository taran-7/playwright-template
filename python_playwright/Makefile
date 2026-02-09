PYTHON ?= python3
PYTEST = $(PYTHON) -m pytest -c pytest.ini

.PHONY: install install-browsers test test-integration test-ui test-api test-e2e test-headed lint format type-check clean

install:
	$(PYTHON) -m pip install -r requirements.txt

install-browsers:
	$(PYTHON) -m playwright install --with-deps chromium

test:
	$(PYTEST)

test-integration:
	$(PYTEST) --run-integration

test-ui:
	$(PYTEST) -m ui --run-integration

test-api:
	$(PYTEST) -m api --run-integration

test-e2e:
	$(PYTEST) -m e2e --run-integration

test-headed:
	$(PYTEST) -m ui --run-integration --headed --slowmo 500

lint:
	$(PYTHON) -m ruff check .

format:
	$(PYTHON) -m black .

type-check:
	$(PYTHON) -m mypy .

clean:
	rm -rf .pytest_cache .mypy_cache .ruff_cache htmlcov report.html assets/ python_playwright/assets/
