import { UploadHelper } from "..";
import { ImportDataInterface, ImportHouseholdInterface } from "../ImportHelper";
import Papa from "papaparse";

const generatePlanningCenterZip = async (importData: ImportDataInterface, updateProgress: (name: string, status: string) => void) => {
  let files = [];

  updateProgress("Campuses/Services/Times", "running");
  //files.push({ name: "services.csv", contents: await getCampusServiceTimes(importData) });
  updateProgress("Campuses/Services/Times", "complete");

  updateProgress("People", "running");
  files.push({ name: "people.csv", contents: await getPeople(importData) });
  updateProgress("People", "complete");

  updateProgress("Photos", "running");
  //getPhotos(importData.people, files);
  updateProgress("Photos", "complete");

  updateProgress("Groups", "running");
  //files.push({ name: "groups.csv", contents: await getGroups(importData) });
  updateProgress("Groups", "complete");

  updateProgress("Group Members", "running");
  //files.push({ name: "groupmembers.csv", contents: await getGroupMembers(importData) });
  updateProgress("Group Members", "complete");

  updateProgress("Donations", "running");
  //files.push({ name: "donations.csv", contents: await getDonations(importData) });
  updateProgress("Donations", "complete");

  updateProgress("Attendance", "running");
  //files.push({ name: "attendance.csv", contents: await getAttendance(importData) });
  updateProgress("Attendance", "complete");

  updateProgress("Forms", "running");
  //files.push({ name: "forms.csv", contents: await getForms(importData) });
  updateProgress("Forms", "complete");

  updateProgress("Questions", "running");
  //files.push({ name: "questions.csv", contents: await getQuestions(importData) });
  updateProgress("Questions", "complete");

  updateProgress("Form Submissions", "running");
  //files.push({ name: "formSubmissions.csv", contents: await getFormSubmissions(importData) });
  updateProgress("Form Submissions", "complete");

  updateProgress("Answers", "running");
  //files.push({ name: "answers.csv", contents: await getAnswers(importData) });
  updateProgress("Answers", "complete");

  updateProgress("Compressing", "running");
  UploadHelper.zipFiles(files, "PlanningCenterExport.zip");
  updateProgress("Compressing", "complete");
}

const getPeople = async (importData : ImportDataInterface) => {
  const { people } = importData;
  let tmpHouseholds: ImportHouseholdInterface[] = [...importData.households];
  let data: any[] = [];
  people.forEach((p) => {
    let household = tmpHouseholds.find(h => p.householdKey === h.importKey)
    let row = {
      "Person ID": p.importKey ?? "",
      "Name Prefix": p.name.title ?? "",
      "Given Name": p.name.first ?? "",
      "First Name": p.name.first ?? "",
      Nickname: p.name.nick ?? "",
      "Middle Name": p.name.middle ?? "",
      "Last Name": p.name.last ?? "",
      "Name Suffix": p.name.suffix ?? "",
      Birthdate: p.birthDate ?? "",
      Anniversary: p.anniversary ?? "",
      Gender: p.gender ?? "",
      Grade: p.grade ?? "",
      School: p.school ?? "",
      "Medical Notes": "",
      Child: p.child ?? "",
      "Marital Status": p.maritalStatus ?? "",
      Status: p.membershipStatus ?? "",
      Membership: p.membershipStatus ?? "",
      "Inactive Reason": p.inactiveReason ?? "",
      "Inactive Date": p.inactiveDate ?? "",
      "Services User": p.servicesUser ?? "",
      "Calendar User": p.calendarUser ?? "",
      "Check-Ins User": p.checkInsUser ?? "",
      "Registrations User": p.registrationsUser ?? "",
      "Giving User": p.givingUser ?? "",
      "Groups User": p.groupsUser ?? "",
      "Home Address Street Line 1": p.contactInfo.address1 ?? "",
      "Home Address Street Line 2": p.contactInfo.address2 ?? "",
      "Home Address City": p.contactInfo.city ?? "",
      "Home Address State": p.contactInfo.state ?? "",
      "Home Address Zip Code": p.contactInfo.zip ?? "",
      "Work Address Street Line 1": "",
      "Work Address Street Line 2": "",
      "Work Address City": "",
      "Work Address State": "",
      "Work Address Zip Code": "",
      "Other Address Street Line 1": "",
      "Other Address Street Line 2": "",
      "Other Address City": "",
      "Other Address State": "",
      "Other Address Zip Code": "",
      "Mobile Phone Number": p.contactInfo.mobilePhone ?? "",
      "Home Phone Number": p.contactInfo.homePhone ?? "",
      "Work Phone Number": p.contactInfo.workPhone ?? "",
      "Pager Phone Number": p.contactInfo.pager ?? "",
      "Fax Phone Number": p.contactInfo.fax ?? "",
      "Skype Phone Number": p.contactInfo.skype ?? "",
      "Other Phone Number": "",
      "Home Email": p.contactInfo.email ?? "",
      "Work Email": p.contactInfo.workEmail ?? "",
      "Other Email": "",
      "Household ID": household.id ?? "",
      "Household Name": household.name ?? p.name.last,
      "Household Primary Contact": "",
      "Background Check Cleared": "",
      "Background Check Created At": "",
      "Background Check Expires On": "",
      "Background Check Note": "",
      "Created At": "",
      "Updated At": ""
    }
    data.push(row);
  });
  return Papa.unparse(data);
}
export default generatePlanningCenterZip;
