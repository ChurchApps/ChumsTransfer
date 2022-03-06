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
  //const tagsFile = fileNames.find(name => name.match("tags"))
  //const notesFile = fileNames.find(name => name.match("notes"))
  const givingFile = fileNames.find(name => name.match("giving"))
  const eventsFile = fileNames.find(name => name.match("events"))

  loadPeople(UploadHelper.readXlsx(await zip.file(peopleFile).async("arraybuffer")));
  //loadTags(UploadHelper.readXlsx(await zip.file(tagsFile).async("arraybuffer")));
  //loadNotes(UploadHelper.readXlsx(await zip.file(notesFile).async("arraybuffer")));
  loadEvents(UploadHelper.readXlsx(await zip.file(eventsFile).async("arraybuffer")));
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

const loadTags = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].value !== undefined) {
    answers.push(data[i]);
  }
}

const loadNotes = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined) {
    formSubmissions.push(data[i]);
  }
}

const loadEvents = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].Name !== undefined) {
    let group = getOrCreateGroup(groups, data[i]);
    if (group !== null && group.serviceTimeKey) {
      let gst = { groupKey: group.importKey, groupId: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
      groupServiceTimes.push(gst);
    }
  }
  return groups;
}

const getOrCreateGroup = (groups: ImportGroupInterface[], data: any) => {
  let result = groups.find(g => g.importKey === data["Event ID"]);
  if (!result) {
    result = data as ImportGroupInterface;
    result.name = data["Name"]
    result.trackAttendance = (data.trackAttendance === "TRUE");
    result.parentPickup = (data.parentPickup === "TRUE");
    if (result.importKey === "" || result.importKey === undefined || result.importKey === null) result.importKey = data["Event ID"];
    result.id = data.importKey;
    groups.push(result);
  }
  return result;
}

const loadDonations = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].Amount !== undefined) {
    let d = data[i];
    let batch = ImportHelper.getOrCreateBatch(batches, d.Batch, new Date(d.date));
    let fund = ImportHelper.getOrCreateFund(funds, d["Fund(s)"]);
    let donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d["Person ID"], donationDate: new Date(d.Date), amount: Number.parseFloat(d.Amount), method: d["Method ID"], notes: d.Note ?? "" } as ImportDonationInterface;
    let fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: Number.parseFloat(d.Amount) } as ImportFundDonationInterface;
    donations.push(donation);
    fundDonations.push(fundDonation);
  }
}

const loadAttendance = (data: any, tmpServiceTimes: ImportServiceTimeInterface[]) => {
  for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined && data[i].groupKey !== undefined) {
    let session = ImportHelper.getOrCreateSession(sessions, new Date(data[i].date), data[i].groupKey, data[i].serviceTimeKey);
    let visit = ImportHelper.getOrCreateVisit(visits, data[i], tmpServiceTimes);
    let visitSession = { visitKey: visit.importKey, sessionKey: session.importKey } as ImportVisitSessionInterface;
    visitSessions.push(visitSession);

    let group = groups.find(group => group.importKey === data[i].groupKey);
    if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
      let gst = { groupKey: group.importKey, groupId: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
      if(groupServiceTimes.find(gst => gst.groupKey === group.importKey && gst.serviceTimeKey === group.serviceTimeKey) === undefined) groupServiceTimes.push(gst);
    }
  }
}

const loadServiceTimes = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].time !== undefined) {
    let campus = ImportHelper.getOrCreateCampus(campuses, data[i].campus);
    let service = ImportHelper.getOrCreateService(services, data[i].service, campus);
    ImportHelper.getOrCreateServiceTime(serviceTimes, data[i], service);
  }
  return serviceTimes;
}

const loadGroups = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
    let group = ImportHelper.getOrCreateGroup(groups, data[i]);
    if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
      let gst = { groupKey: group.importKey, groupId: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
      groupServiceTimes.push(gst);
    }
  }
  return groups;
}

const loadGroupMembers = (data: any) => {
  for (let i = 0; i < data.length; i++) if (data[i].groupKey !== undefined) groupMembers.push(data[i] as ImportGroupMemberInterface);
}

const assignHousehold = (households: ImportHouseholdInterface[], person: ImportPersonInterface) => {
  let householdName: string = person.name.last ?? "";
  if (households.length === 0 || households[households.length - 1].name !== householdName) {
    households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
  }
  person.householdKey = households[households.length - 1].importKey;
}

const loadPeople = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i]["Last Name"] !== undefined) {
      const p = {
        importKey: data[i]["Breeze ID"],
        id: data[i]["Breeze ID"],
        name: { first: data[i]["First Name"], middle: data[i]["Middle Name"], last: data[i]["Last Name"], nick: data[i]["Nickname"], display: `${data[i]["First Name"]} ${data[i]["Last Name"]}` } as NameInterface,
        contactInfo: { address1: data[i]["Street Address"], address2: "", city: data[i]["City"], state: data[i]["State"], zip: data[i]["Zip"], homePhone: data[i]["Home"], mobilePhone: data[i]["Mobile"], workPhone: data[i]["Work"], email: data[i]["Email"] } as ContactInfoInterface,
        membershipStatus: data[i]["Status"],
        gender: data[i]["Gender"],
        birthDate: data[i]["Birthdate"],
        maritalStatus: data[i]["Marital Status"],
        anniversary: new Date(),
        photoUpdated: new Date(),
        householdId: data[i]["Family"],
        householdRole: data[i]["Family Role"],
        userId: data[i]["Breeze ID"]
      } as ImportPersonInterface;

      assignHousehold(households, p);
      people.push(p);
    }
  }
  return people;
}

export default readBreezeZip;
