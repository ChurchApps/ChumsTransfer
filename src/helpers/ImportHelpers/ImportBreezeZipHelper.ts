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
import { GroupMemberInterface } from "../Interfaces";

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

const readBreezeZip = async (file: File): Promise<ImportDataInterface> => {
  const zip = await JSZip.loadAsync(file);
  const fileNames = Object.keys(zip.files);
  const peopleFile = fileNames.find(name => name.match("people"))
  const tagsFile = fileNames.find(name => name.match("tags"))
  //const notesFile = fileNames.find(name => name.match("notes"))
  const givingFile = fileNames.find(name => name.match("giving"))
  //const eventsFile = fileNames.find(name => name.match("events"))

  loadPeople(UploadHelper.readXlsx(await zip.file(peopleFile).async("arraybuffer")));
  //loadNotes(UploadHelper.readXlsx(await zip.file(notesFile).async("arraybuffer")));
  loadGroups(UploadHelper.readXlsx(await zip.file(tagsFile).async("arraybuffer")));
  loadDonations(UploadHelper.readXlsx(await zip.file(givingFile).async("arraybuffer")));

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

const loadGroups = (data: any) => {
  const xlsGroups = Object.keys(data)
  xlsGroups.forEach((groupName, i) => {
    getOrCreateGroup(groups, { importKey: i.toString(), serviceTimeKey: null, startDate: null, endDate: null, name: groupName } as ImportGroupInterface);
    let members = data[groupName];
    members.forEach((member: any) => {
      let groupMember = { groupKey: i.toString(), personKey: member["Person ID"], groupId: i.toString(), personId: member["Person ID"] } as ImportGroupMemberInterface;
      groupMembers.push(groupMember)
    })
  })
  return groups;
}

const getOrCreateGroup = (groups: ImportGroupInterface[], data: ImportGroupInterface) => {
  let result = groups.find(g => g.importKey === data.importKey);
  if (!result) {
    result = data as ImportGroupInterface;
    result.trackAttendance = false;
    result.parentPickup = false;
    if (result.importKey === "" || result.importKey === undefined || result.importKey === null) result.importKey = data.importKey;
    result.id = data.importKey;
    groups.push(result);
  }
  return result;
}

const loadDonations = (data: any) => {
  for (let i = 0; i < data["Total Contributions"].length; i++){
    let d = data["Total Contributions"][i];
    if (d.Amount !== undefined) {
      let batch = ImportHelper.getOrCreateBatch(batches, d.Batch, new Date(d.date));
      let fund = ImportHelper.getOrCreateFund(funds, d["Fund(s)"]);
      let donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d["Person ID"], personId: d["Person ID"], donationDate: new Date(d.Date), amount: Number.parseFloat(d.Amount), method: d["Method ID"], notes: d.Note ?? "", fund: fund, fundKey: fund.importKey } as ImportDonationInterface;
      donation.person = people.find(p => p.importKey === donation.personKey)
      let fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: Number.parseFloat(d.Amount) } as ImportFundDonationInterface;
      donations.push(donation);
      fundDonations.push(fundDonation);
    }
  }
}

const assignHousehold = (households: ImportHouseholdInterface[], person: ImportPersonInterface) => {
  let householdName: string = person.name.last ?? "";
  if (households.length === 0 || households[households.length - 1].name !== householdName) {
    households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
  }
  person.householdKey = households[households.length - 1].importKey;
}

const loadPeople = (data: any) => {
  const xlssheets = Object.keys(data)
  xlssheets.forEach(sheet => {
    for (let i = 0; i < data[sheet].length; i++) {
      if (data[sheet][i]["Last Name"] !== undefined) {
        const p = {
          importKey: data[sheet][i]["Breeze ID"] ?? "",
          name: { first: data[sheet][i]["First Name"] ?? "", middle: data[sheet][i]["Middle Name"] ?? "", last: data[sheet][i]["Last Name"] ?? "", nick: data[sheet][i]["Nickname"] ?? "", display: `${data[sheet][i]["First Name"] ?? ""} ${data[sheet][i]["Last Name"] ?? ""}` } as NameInterface,
          contactInfo: { address1: data[sheet][i]["Street Address"] ?? "", address2: "", city: data[sheet][i]["City"] ?? "", state: data[sheet][i]["State"] ?? "", zip: data[sheet][i]["Zip"] ?? "", homePhone: data[sheet][i]["Home"] ?? "", mobilePhone: data[sheet][i]["Mobile"] ?? "", workPhone: data[sheet][i]["Work"] ?? "", email: data[sheet][i]["Email"] ?? "" } as ContactInfoInterface,
          membershipStatus: data[sheet][i]["Status"] ?? "",
          gender: data[sheet][i]["Gender"] ?? "",
          birthDate: data[sheet][i]["Birthdate"] ?? "",
          maritalStatus: data[sheet][i]["Marital Status"] ?? "",
          householdId: data[sheet][i]["Family"] ?? "",
          householdRole: data[sheet][i]["Family Role"] ?? "",
          userId: data[sheet][i]["Breeze ID"] ?? ""
        } as ImportPersonInterface;

        assignHousehold(households, p);
        people.push(p);
      }
    }
  })
  return people;
}

export default readBreezeZip;
