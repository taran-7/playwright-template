from faker import Faker
from playwright.sync_api import APIResponse, expect

from python_playwright.api.base_api_client import BaseApiClient
from python_playwright.constants.api_endpoints import Endpoints

faker = Faker()


class PresentationController(BaseApiClient):
    def make_presentation_id(self, headers: dict) -> str | None:
        """Create a new presentation and return its ID."""
        presentation_id = faker.uuid4()

        response = self.send(
            method="post",
            path=Endpoints.PRESENTATION_API,
            headers=headers,
            data={"presentationId": presentation_id},
        )

        if response.status != 200:
            return None

        return presentation_id

    def get_presentation(self, headers: dict, presentation_id: str) -> APIResponse:
        """Get presentation details by ID."""
        return self.send(
            method="get",
            path=f"{Endpoints.PRESENTATIONS_ID}?presentationId={presentation_id}",
            headers=headers,
        )

    def get_all_presentations(self, headers: dict) -> APIResponse:
        """Get all presentations for current user."""
        return self.send(method="get", path=Endpoints.PRESENTATION_API, headers=headers)

    def get_comments_info(
        self, headers: dict, presentation_id: str, page: int = 0, size: int = 10
    ) -> dict:
        """Get comments for a presentation."""
        response = self.send(
            method="get",
            path=f"{Endpoints.COMMENTS}/?objectId={presentation_id}&page={page}&size={size}",
            headers=headers,
        )

        if response.status != 200:
            raise RuntimeError(
                f"Failed to get comments. Status: {response.status}")

        return response.json()

    def save_presentation(self, headers: dict, presentation_id: str, data: dict) -> APIResponse:
        """Save/update presentation."""
        payload = {"presentationId": presentation_id}
        payload.update(data)

        return self.send(
            method="put",
            path=Endpoints.PRESENTATIONS_SAVE,
            headers=headers,
            data=payload,
        )

    def confirm_presentation(self, headers: dict, presentation_id: str) -> APIResponse:
        """Confirm/publish presentation."""
        return self.send(
            method="post",
            path=Endpoints.PRESENTATIONS_CONFIRM,
            headers=headers,
            data={"presentationId": presentation_id},
        )

    def delete_presentation(self, headers: dict, presentation_id: str) -> APIResponse:
        """Delete a presentation."""
        response = self.send(
            method="delete",
            path=f"{Endpoints.PRESENTATIONS_DELETE}{presentation_id}",
            headers=headers,
        )

        return response

    def get_access_control_groups(self, headers: dict) -> dict:
        """Get access control groups."""
        response = self.send("get", Endpoints.GROUPS, headers)
        expect(response).to_be_ok()
        return response.json()

    def set_direct_access_to_presentation(self, headers: dict, presentation_id: str) -> APIResponse:
        """Set direct access to presentation."""
        groups = self.get_access_control_groups(headers)
        group_id = groups["groups"][0]["groupId"]

        response = self.send(
            method="put",
            path=Endpoints.PRESENTATIONS_API_ACCESS,
            headers=headers,
            data={"presentationId": presentation_id, "groupId": group_id},
        )
        expect(response).to_be_ok()
        return response

    def copy_presentation(self, headers: dict, presentation_id: str) -> APIResponse:
        """Copy a presentation."""
        return self.send(
            method="post",
            path=Endpoints.PRESENTATION_COPY,
            headers=headers,
            data={"presentationId": presentation_id},
        )
