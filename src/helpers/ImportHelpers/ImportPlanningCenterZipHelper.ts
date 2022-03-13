import { UploadHelper } from "../UploadHelper";
import {
  ImportHelper, ImportPersonInterface, ImportHouseholdInterface
  , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
  , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface
  , ImportQuestionsInterface, ImportFormSubmissions, ImportAnswerInterface
} from "../ImportHelper";
import JSZip from "jszip";
import { ContactInfoInterface, NameInterface } from "..";
import { object } from "yup";

let people: ImportPersonInterface[] = [];
let households: ImportHouseholdInterface[] = [];
let campuses: ImportCampusInterface[] = [];
let services: ImportServiceInterface[] = [];
let serviceTimes: ImportServiceTimeInterface[] = [];
let groupServiceTimes: ImportGroupServiceTimeInterface[] = [];
let groups: ImportGroupInterface[] = [];
let groupMembers: ImportGroupMemberInterface[] = [];
let sessions: ImportSessionInterface[] = [];
let visits: ImportVisitInterface[] = [];
let visitSessions: ImportVisitSessionInterface[] = [];
let batches: ImportDonationBatchInterface[] = [];
let funds: ImportFundInterface[] = [];
let donations: ImportDonationInterface[] = [];
let fundDonations:ImportFundDonationInterface[] = [];
let forms: ImportFormsInterface[] = [];
let questions: ImportQuestionsInterface[] = [];
let formSubmissions: ImportFormSubmissions[] = [];
let answers:ImportAnswerInterface[] = [];

const readPlanningCenterZip = async (file: File): Promise<ImportDataInterface> => {
  const fileExt = file.name.split(".").pop();
  const isZip = fileExt === "zip";
  const zip = isZip ? await JSZip.loadAsync(file) : null;
  const fileNames = isZip ? Object.keys(zip.files) : [];
  const peopleFile = isZip ? fileNames.find(name => name.match("export")) : file.name;
  let csvString = isZip ? await zip.file(peopleFile).async("string") : UploadHelper.convertObjectArrToCSVString(await UploadHelper.readCsv(file) as Object[])
  loadPeople(UploadHelper.readCsvString(csvString));
  return {
    people: people,
    households: households,
    campuses: campuses,
    services: services,
    serviceTimes: serviceTimes,
    groupServiceTimes: groupServiceTimes,
    groups: groups,
    groupMembers: groupMembers,
    visits: visits,
    sessions: sessions,
    visitSessions: visitSessions,
    batches: batches,
    donations: donations,
    funds: funds,
    fundDonations: fundDonations,
    forms: forms,
    questions: questions,
    formSubmissions: formSubmissions,
    answers: answers
  } as ImportDataInterface;

}

const loadPeople = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i]["Last Name"] !== undefined) {
      const p = {
        importKey: data[i]["Person ID"] ?? "",
        name: { title: data[i]["Name Prefix"] ?? "", first: data[i]["First Name"] ?? "", middle: data[i]["Middle Name"] ?? "", last: data[i]["Last Name"] ?? "", suffix: data[i]["Name Suffix"] ?? "", nick: data[i]["Nickname"] ?? "", display: `${data[i]["First Name"] ?? ""} ${data[i]["Last Name"] ?? ""}` } as NameInterface,
        birthDate: data[i]["Birthdate"] ??  null,
        anniversary: data[i]["Anniversary"] ??  null,
        gender: data[i]["Gender"] ??  "",
        grade: data[i]["Grade"] ??  "",
        school: data[i]["School"] ??  "",
        child: data[i]["Child"] ??  null,
        maritalStatus: data[i]["Marital Status"] ??  "",
        membershipStatus: data[i]["Status"] ??  "",
        inactiveReason: data[i]["Inactive Reason"] ??  "",
        inactiveDate: data[i]["Inactive Date"] ??  null,
        servicesUser: data[i]["Services User"] ??  null,
        calendarUser: data[i]["Calendar User"] ??  null,
        checkInsUser: data[i]["Check-Ins User"] ??  null,
        registrationsUser: data[i]["Registrations User"] ??  null,
        givingUser: data[i]["Giving User"] ??  null,
        groupsUser: data[i]["Groups User"] ??  null,
        contactInfo: { address1: data[i]["Home Address Street Line 1"] ?? "", address2: data[i]["Home Address Street Line 2"] ?? "", city: data[i]["Home Address City"] ?? "", state: data[i]["Home Address State"] ?? "", zip: data[i]["Home Address Zip Code"] ?? "", homePhone: data[i]["Home"] ?? "", mobilePhone: data[i]["Mobile Phone Number"] ?? "", workPhone: data[i]["Work Phone Number"] ?? "", email: data[i]["Home Email"] ?? "", pager: data[i]["Pager Phone Number"] ?? "", fax: data[i]["Fax Phone Number"] ?? "", skype: data[i]["Skype Phone Number"] ?? "", workEmail: data[i]["Work Email"] ?? "" } as ContactInfoInterface,
        householdId: data[i]["Household ID"] ??  null,
        householdName: data[i]["Household Name"] ??  data[i]["Last Name"]
      } as ImportPersonInterface;

      assignHousehold(households, p);
      people.push(p);
    }
  }
  return people;
}

const assignHousehold = (households: ImportHouseholdInterface[], person: any) => {
  let householdName: string = person.householdName;
  if (households.length === 0 || households[households.length - 1].name !== householdName) {
    households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
  }
  person.householdKey = households[households.length - 1].importKey;
}

export default readPlanningCenterZip;
