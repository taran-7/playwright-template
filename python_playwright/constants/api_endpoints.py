from enum import StrEnum


class Endpoints(StrEnum):
    # AUTHENTICATION
    LOGIN = "/api/gateway/auth/login"
    LOGOUT = "/api/gateway/auth/logout"
    AUTH_INFO = "/api/gateway/auth/info"
    SIGN_UP = "/api/gateway/auth/sign-up"
    PASSWORD_RESET = "/api/gateway/auth/password/reset"
    AUTH_PASSWORD = "/api/gateway/auth/password"
    AUTH_INVITE = "/api/gateway/auth/invite"
    AUTH_DELETE = "/api/gateway/auth/delete"

    # USER MANAGEMENT
    USER_INFO = "/api/gateway/user/info"
    USER = "/api/gateway/user/"
    USERS = "/api/gateway/statistics/tenant/users"
    USERS_DETAILS = "/api/gateway/user/details"
    USER_REMOVE = "/api/gateway/auth/delete?userId="
    USER_RESTORE = "/api/gateway/user/restore"

    # USER GROUPS
    USER_GROUPS_MANAGE = "/api/gateway/user/groups"
    USER_GROUP = "/api/gateway/user/group"

    # PRESENTATIONS/CONTENT
    PRESENTATION_API = "/api/gateway/presentations/"
    PRESENTATIONS = "/presentations/"
    PRESENTATIONS_STATE = "/api/gateway/presentations/state"
    PRESENTATIONS_SAVE = "/api/gateway/presentations/save"
    PRESENTATIONS_CONFIRM = "/api/gateway/presentations/confirm"
    PRESENTATIONS_DELETE = "/api/gateway/presentations/?presentationIds="
    PRESENTATIONS_ID = "/api/gateway/presentations/v1/presentation"
    PRESENTATION_COPY = "/api/gateway/presentations/copy"
    COMMENTS = "/api/gateway/comment"

    # FILES & MEDIA
    FILES = "/api/gateway/files/"
    FILES_INFO = "/api/gateway/files/v1"
    FILES_ID = "/api/gateway/presentations/files/"
    FILES_DELETE = "/api/gateway/files/delete/"
    FILE_INFO = "/api/gateway/files/file"
    UPLOAD_FILE_STREAM = "/api/gateway/files/upload/stream/"
    MEDIA_METADATA = "/api/gateway/files/media-metadata"
    MEDIA_LIBRARY = "/manage/assets"

    # ACCESS CONTROL
    GROUP = "/api/gateway/access-control/group"
    GROUPS = "/api/gateway/access-control/groups"
    GROUP_ID = "/api/gateway/access-control/group?groupId="
    PRESENTATIONS_API_ACCESS = "/api/gateway/access-control/presentation"

    # EXPLORE/PORTAL
    EXPLORE_PRESENTATIONS = "/api/gateway/search/presentations/explore"
    PRESENTATION_SHARE = "/api/gateway/portal/presentation"
    RECOMMENDATIONS = "/api/gateway/portal/recommendations"

    # STATISTICS
    PRESENTATION_VIEWED = "/api/gateway/presentations/viewed/"
    STATISTICS_USER_VIEWS = "/api/gateway/statistics/user/views"
    STATISTICS_USER_VIEWS_BY_HOST = "/api/gateway/statistics/user/viewsByHost"
    STATISTICS_USER_VIEWS_BY_PRESENTATION = "/api/gateway/statistics/user/viewsByPresentation"
    STATISTICS_USER_DURATION = "/api/gateway/statistics/user/duration"

    # TENANT
    TENANT_DETAILS = "/api/gateway/tenant/details"

    # FORMS & CERTIFICATES
    FORMS = "/manage/forms"
    FORM_CREATE = "/api/gateway/form/form"
    FORM_DELETE = "/api/gateway/form/delete?formId="
    FORM_INFO = "/api/gateway/form/info?formId="
    FORM_ALL = "/api/gateway/form/all"
    FORM_ATTACH_TO_PRESENTATION = "/api/gateway/presentations/feedback-form"
    FORM_SUBMIT = "/api/gateway/form/submit"
    CERTIFICATE_OF_FORM = "/api/gateway/form/template/"
    CERTIFICATE_DOWNLOAD = "/api/gateway/form/certificate"
    CERTIFICATE_ALL = "/api/gateway/form/certificate/all"

    # EXTERNAL SERVICES
    GET_MY_IP = "https://api.ipify.org?format=json"
