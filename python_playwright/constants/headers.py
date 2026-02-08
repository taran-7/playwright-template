from typing import Dict

class Headers:
    @staticmethod
    def extra_headers_without_token() -> Dict[str, str]:
        return {
            "Content-Type": "application/json"
        }

    @staticmethod
    def extra_headers(user_token: str) -> Dict[str, str]:
        return {
            "cookie": f"at={user_token}",
            "Content-Type": "application/json"
        }

    @staticmethod
    def extra_form_headers() -> Dict[str, str]:
        return {
            "Content-Type": "application/x-www-form-urlencoded"
        }

    @staticmethod
    def extra_bearer_headers(bearer_token: str) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {bearer_token}",
            "Content-Type": "application/json"
        }
