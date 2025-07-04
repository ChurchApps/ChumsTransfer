import { PersonHelper as BasePersonHelper } from "@churchapps/apphelper"
import { PersonInterface, EnvironmentHelper } from ".";

export class PersonHelper extends BasePersonHelper {
  static getPhotoUrl(person: PersonInterface) {
    if (!person?.photo) {
      return "/images/sample-profile.png"
    }
    return person.photo.startsWith("data:image/png;base64,") ? person.photo : EnvironmentHelper.Common.ContentRoot + person.photo;
  }
  static calculateAge(birthday: Date) {
    let ageDifMs = new Date().getTime() - new Date(birthday).getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
