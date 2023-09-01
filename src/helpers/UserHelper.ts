import { UserHelper as BaseUserHelper } from "@churchapps/apphelper"
import { PersonInterface } from ".";
export class UserHelper extends BaseUserHelper {
  static person: PersonInterface;
}
