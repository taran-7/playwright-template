/**
 * ============================================================================
 * API ENDPOINTS
 * ============================================================================
 *
 * Enum containing all API endpoint paths.
 * Use these instead of hardcoding paths in controllers.
 *
 * Usage:
 *   import { EndpointsEnum } from "@constants/apiEndpoints";
 *
 *   const response = await this.send("get", EndpointsEnum.Users, headers);
 *
 * To add a new endpoint:
 *   1. Add the path here with a descriptive name
 *   2. Use it in your controller
 * ============================================================================
 */

export enum EndpointsEnum {
  // ===========================================================================
  // AUTHENTICATION
  // ===========================================================================

  /** User login */
  Login = "/api/gateway/auth/login",

  /** User logout */
  Logout = "/api/gateway/auth/logout",

  /** Get current user info */
  AuthInfo = "/api/gateway/auth/info",

  /** User signup */
  SignUp = "/api/gateway/auth/sign-up",

  /** Password reset request */
  PasswordReset = "/api/gateway/auth/password/reset",

  /** Change password */
  AuthPassword = "/api/gateway/auth/password",

  /** Invite user */
  AuthInvite = "/api/gateway/auth/invite",

  /** Delete user account */
  AuthDelete = "/api/gateway/auth/delete",

  // ===========================================================================
  // USER MANAGEMENT
  // ===========================================================================

  /** Get user details */
  UserInfo = "/api/gateway/user/info",

  /** User operations */
  User = "/api/gateway/user/",

  /** Get all users */
  Users = "/api/gateway/statistics/tenant/users",

  /** User details */
  UsersDetails = "/api/gateway/user/details",

  /** Remove user */
  UserRemove = "/api/gateway/auth/delete?userId=",

  /** Restore user */
  UserRestore = "/api/gateway/user/restore",

  // ===========================================================================
  // USER GROUPS
  // ===========================================================================

  /** User groups management */
  UserGroupsManage = "/api/gateway/user/groups",

  /** Single user group */
  UserGroup = "/api/gateway/user/group",

  // ===========================================================================
  // PRESENTATIONS/CONTENT
  // ===========================================================================

  /** Presentation API base */
  PresentationApi = "/api/gateway/presentations/",

  /** Presentations page */
  Presentations = "/presentations/",

  /** Presentation state */
  PresentationsState = "/api/gateway/presentations/state",

  /** Save presentation */
  PresentationsSave = "/api/gateway/presentations/save",

  /** Confirm presentation */
  PresentationsConfirm = "/api/gateway/presentations/confirm",

  /** Delete presentation(s) */
  PresentationsDelete = "/api/gateway/presentations/?presentationIds=",

  /** Get presentation by ID */
  PresentationsId = "/api/gateway/presentations/v1/presentation",

  /** Copy presentation */
  PresentationCopy = "/api/gateway/presentations/copy",

  /** Comments on presentation */
  Comments = "/api/gateway/comment",

  // ===========================================================================
  // FILES & MEDIA
  // ===========================================================================

  /** Files API */
  Files = "/api/gateway/files/",

  /** File info */
  FilesInfo = "/api/gateway/files/v1",

  /** File ID for presentation */
  FilesId = "/api/gateway/presentations/files/",

  /** Delete file */
  FilesDelete = "/api/gateway/files/delete/",

  /** Single file info */
  FileInfo = "/api/gateway/files/file",

  /** Upload file stream */
  UploadFileStream = "/api/gateway/files/upload/stream/",

  /** Media metadata */
  MediaMetaData = "/api/gateway/files/media-metadata",

  /** Media library page */
  MediaLibrary = "/manage/assets",

  // ===========================================================================
  // ACCESS CONTROL
  // ===========================================================================

  /** Single group */
  Group = "/api/gateway/access-control/group",

  /** All groups */
  Groups = "/api/gateway/access-control/groups",

  /** Group by ID */
  GroupId = "/api/gateway/access-control/group?groupId=",

  /** Presentation access control */
  PresentationsApi = "/api/gateway/access-control/presentation",

  // ===========================================================================
  // EXPLORE/PORTAL
  // ===========================================================================

  /** Search presentations in explore */
  ExplorePresentations = "/api/gateway/search/presentations/explore",

  /** Share presentation */
  PresentationShare = "/api/gateway/portal/presentation",

  /** Recommendations */
  Recommendations = "/api/gateway/portal/recommendations",

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  /** Presentation views */
  PresentationViewed = "/api/gateway/presentations/viewed/",

  /** User views statistics */
  StatisticsUserViews = "/api/gateway/statistics/user/views",

  /** Views by host */
  StatisticsUserViewsByHost = "/api/gateway/statistics/user/viewsByHost",

  /** Views by presentation */
  StatisticsUserViewsByPresentation = "/api/gateway/statistics/user/viewsByPresentation",

  /** Duration statistics */
  StatisticsUserDuration = "/api/gateway/statistics/user/duration",

  // ===========================================================================
  // TENANT
  // ===========================================================================

  /** Tenant details */
  TenantDetails = "/api/gateway/tenant/details",

  // ===========================================================================
  // FORMS & CERTIFICATES
  // ===========================================================================

  /** Forms page */
  Forms = "/manage/forms",

  /** Create form */
  FormCreate = "/api/gateway/form/form",

  /** Delete form */
  FormDelete = "/api/gateway/form/delete?formId=",

  /** Form info */
  FormInfo = "/api/gateway/form/info?formId=",

  /** All forms */
  FormAll = "/api/gateway/form/all",

  /** Attach form to presentation */
  FormAttachToPresentation = "/api/gateway/presentations/feedback-form",

  /** Submit form */
  FormSubmit = "/api/gateway/form/submit",

  /** Certificate template */
  CertificateOfForm = "/api/gateway/form/template/",

  /** Download certificate */
  CertificateDownload = "/api/gateway/form/certificate",

  /** All certificates */
  CertificateAll = "/api/gateway/form/certificate/all",

  // ===========================================================================
  // EXTERNAL SERVICES
  // ===========================================================================

  /** Get public IP */
  GetMyIp = "https://api.ipify.org?format=json",

  // ===========================================================================
  // ADD MORE ENDPOINTS HERE
  // ===========================================================================
}
