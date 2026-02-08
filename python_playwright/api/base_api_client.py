from playwright.sync_api import APIRequestContext, APIResponse
from python_playwright.config import settings

class BaseApiClient:
    def __init__(self, request_context: APIRequestContext):
        self.request = request_context
        self.base_url = settings.BASE_URL

    def send(self, method: str, path: str, headers: dict = None, data=None, form=None, params=None) -> APIResponse:
        """
        Send HTTP request to internal API (uses BASE_URL).
        """
        if not path.startswith("http"):
            url = f"{self.base_url}{path}"
        else:
            url = path

        if method.lower() == "get":
            return self.request.get(url, headers=headers, params=params)
        elif method.lower() == "post":
            return self.request.post(url, headers=headers, data=data, form=form, params=params)
        elif method.lower() == "put":
            return self.request.put(url, headers=headers, data=data, form=form, params=params)
        elif method.lower() == "delete":
            return self.request.delete(url, headers=headers, data=data, form=form, params=params)
        elif method.lower() == "patch":
            return self.request.patch(url, headers=headers, data=data, form=form, params=params)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
