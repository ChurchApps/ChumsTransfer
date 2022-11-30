import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
  private static AttendanceApi = "";
  private static GivingApi = "";
  private static MembershipApi = "";
  static AppUrl = "";

  static ContentRoot = "";
  static AccountsAppUrl = "";
  static ChurchAppsUrl = "";
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
    EnvironmentHelper.AttendanceApi = process.env.REACT_APP_ATTENDANCE_API || "";
    EnvironmentHelper.GivingApi = process.env.REACT_APP_GIVING_API || "";
    EnvironmentHelper.MembershipApi = process.env.REACT_APP_MEMBERSHIP_API || "";
    EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
    EnvironmentHelper.AccountsAppUrl = process.env.REACT_APP_ACCOUNTS_APP_URL || "";
    EnvironmentHelper.ChurchAppsUrl = process.env.REACT_APP_CHURCH_APPS_URL || "";
    EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
    EnvironmentHelper.AppUrl = process.env.REACT_APP_CHUMS_URL || "";
  }

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.staging.churchapps.org";
    EnvironmentHelper.GivingApi = "https://givingapi.staging.churchapps.org";
    EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
    EnvironmentHelper.AccountsAppUrl = "https://accounts.staging.churchapps.org";
    EnvironmentHelper.ChurchAppsUrl = "https://staging.churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "";
    EnvironmentHelper.AppUrl = "https://app.staging.chums.org";
  }

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.churchapps.org";
    EnvironmentHelper.GivingApi = "https://givingapi.churchapps.org";
    EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
    EnvironmentHelper.AccountsAppUrl = "https://accounts.churchapps.org";
    EnvironmentHelper.ChurchAppsUrl = "https://churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-4";
    EnvironmentHelper.AppUrl = "https://app.chums.org";
  }

}

