import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
  private static AttendanceApi = "";
  private static GivingApi = "";
  private static MembershipApi = "";
  static ChumsUrl = "";

  static ContentRoot = "";
  static GoogleAnalyticsTag = "";

  static init = () => {
    switch (process.env.REACT_APP_STAGE) {
      case "staging": EnvironmentHelper.initStaging(); break;
      case "prod": EnvironmentHelper.initProd(); break;
      default: EnvironmentHelper.initDev(); break;
    }
    ApiHelper.apiConfigs = [
      { keyName: "AttendanceApi", url: EnvironmentHelper.AttendanceApi, jwt: "", permisssions: [] },
      { keyName: "GivingApi", url: EnvironmentHelper.GivingApi, jwt: "", permisssions: [] },
      { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] }
    ];
  }

  static initDev = () => {
    this.initStaging();
    EnvironmentHelper.AttendanceApi = process.env.REACT_APP_ATTENDANCE_API || EnvironmentHelper.AttendanceApi;
    EnvironmentHelper.GivingApi = process.env.REACT_APP_GIVING_API || EnvironmentHelper.GivingApi;
    EnvironmentHelper.MembershipApi = process.env.REACT_APP_MEMBERSHIP_API || EnvironmentHelper.MembershipApi;
    EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || EnvironmentHelper.ContentRoot;
    EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || EnvironmentHelper.GoogleAnalyticsTag;
    EnvironmentHelper.ChumsUrl = process.env.REACT_APP_CHUMS_URL || EnvironmentHelper.ChumsUrl;
  }

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.staging.churchapps.org";
    EnvironmentHelper.GivingApi = "https://givingapi.staging.churchapps.org";
    EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "";
    EnvironmentHelper.ChumsUrl = "https://app.staging.chums.org";
  }

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.churchapps.org";
    EnvironmentHelper.GivingApi = "https://givingapi.churchapps.org";
    EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-4";
    EnvironmentHelper.ChumsUrl = "https://app.chums.org";
  }

}

