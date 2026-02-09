from playwright.sync_api import APIRequestContext, APIResponse
from python_playwright.config import settings


class BaseApiClient:
    def __init__(self, request_context: APIRequestContext):
        self.request = request_context
        self.base_url = settings.BASE_URL

    def send(
        self,
        method: str,
        path: str,
        headers: dict | None = None,
        data=None,
        form=None,
        params=None,
    ) -> APIResponse:
        """
        Send HTTP request to internal API (uses BASE_URL).
        """
        if not path.startswith("http"):
            url = f"{self.base_url}{path}"
        else:
            url = path

        method = method.lower()
        if method == "get":
            return self.request.get(url, headers=headers, params=params)
        if method == "post":
            return self.request.post(url, headers=headers, data=data, form=form, params=params)
        if method == "put":
            return self.request.put(url, headers=headers, data=data, form=form, params=params)
        if method == "delete":
            return self.request.delete(url, headers=headers, data=data, form=form, params=params)
        if method == "patch":
            return self.request.patch(url, headers=headers, data=data, form=form, params=params)
        raise ValueError(f"Unsupported HTTP method: {method}")
