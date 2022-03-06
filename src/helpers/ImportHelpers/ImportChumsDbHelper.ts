import { UploadHelper } from "../UploadHelper";
import { ApiHelper } from "../../appBase/helpers/ApiHelper";
import { ArrayHelper } from "../../appBase/helpers/ArrayHelper";
import { PersonHelper } from "../PersonHelper";
import { EnvironmentHelper } from "../EnvironmentHelper";

import Papa from "papaparse";
import {
  ImportHelper, ImportPersonInterface, ImportHouseholdInterface
  , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
  , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface
  , ImportQuestionsInterface, ImportFormSubmissions, ImportAnswerInterface
} from "../ImportHelper";

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

const getChumsData = async (): Promise<ImportDataInterface> => {
  await Promise.all([getPeople(), getCampusServiceTimes(), getGroups(), getGroupMembers(), getAttendance(), getDonations(), getForms(), getQuestions(), getFormSubmissions(), getAnswers()])

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

const getCampusServiceTimes = async () => {
  let promises = []
  promises.push(ApiHelper.get("/campuses", "AttendanceApi").then(data => campuses = data));
  promises.push(ApiHelper.get("/services", "AttendanceApi").then(data => services = data));
  promises.push(ApiHelper.get("/servicetimes", "AttendanceApi").then(data => serviceTimes = data));
  await Promise.all(promises);
  let data: any[] = [];
  serviceTimes.forEach((st) => {
    let service: ImportServiceInterface = ImportHelper.getById(services, st.serviceId);
    let campus: ImportCampusInterface = ImportHelper.getById(campuses, service.campusId);
    let row = {
      importKey: st.id,
      campus: campus.name,
      service: service.name,
      time: st.name
    }
    data.push(row);
  });
  return Papa.unparse(data);
}

const getPeople = async () => {
  people = await ApiHelper.get("/people", "MembershipApi");
  people.forEach((p) => {
    p.photo = PersonHelper.getPhotoUrl(p);
    p.householdKey =p.householdId
    if(households.find(h => h.importKey === p.householdId) === undefined) households.push({importKey: p.householdId, name: p.name.last})
  });
}

const getGroups = async () => {
  let promises = []
  promises.push(ApiHelper.get("/groups", "MembershipApi").then(data => groups = data));
  promises.push(ApiHelper.get("/groupserviceTimes", "AttendanceApi").then(data => groupServiceTimes = data));
  await Promise.all(promises);
  groups.forEach((g) => {
    let serviceTimeIds: string[] = [];
    let gst: ImportGroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes, "groupId", g.id);
    if (gst.length === 0) serviceTimeIds = [""];
    else gst.forEach((time) => { serviceTimeIds.push(time.serviceTimeId.toString()) });
  });
}

const getForms = async () => {
  forms = await ApiHelper.get("/forms", "MembershipApi");
}

const getQuestions = async () => {
  questions = await ApiHelper.get("/questions", "MembershipApi");
}

const getFormSubmissions = async () => {
  formSubmissions = await ApiHelper.get("/formsubmissions", "MembershipApi");
}

const getAnswers = async () => {
  answers = await ApiHelper.get("/answers", "MembershipApi");
}

const getGroupMembers = async () => {
  groupMembers = await ApiHelper.get("/groupmembers", "MembershipApi");
}

const getDonations = async () => {
  let promises = []
  promises.push(ApiHelper.get("/funds", "GivingApi").then(data => funds = data));
  promises.push(ApiHelper.get("/donationbatches", "GivingApi").then(data => batches = data));
  promises.push(ApiHelper.get("/donations", "GivingApi").then(data => donations = data));
  promises.push(ApiHelper.get("/funddonations", "GivingApi").then(data => fundDonations = data));
  await Promise.all(promises);
  let data: any[] = [];
  fundDonations.forEach((fd) => {
    let fund: ImportFundInterface = ImportHelper.getById(funds, fd.fundId);
    let donation: ImportDonationInterface = ImportHelper.getById(donations, fd.donationId);
    let batch: ImportDonationBatchInterface = ImportHelper.getById(batches, donation.batchId);
    let row = {
      batch: batch.id,
      date: donation.donationDate,
      personKey: donation.personId,
      method: donation.method,
      methodDetails: donation.methodDetails,
      amount: donation.amount,
      fund: fund.name,
      notes: donation.notes
    }
    data.push(row);
  });
  return Papa.unparse(data);
}

const getAttendance = async () => {
  let promises = []
  promises.push(ApiHelper.get("/sessions", "AttendanceApi").then(data => sessions = data));
  promises.push(ApiHelper.get("/visits", "AttendanceApi").then(data => visits = data));
  promises.push(ApiHelper.get("/visitsessions", "AttendanceApi").then(data => visitSessions = data));
  await Promise.all(promises);
  let data: any[] = [];
  visitSessions.forEach((vs) => {
    let visit: ImportVisitInterface = ImportHelper.getById(visits, vs.visitId);
    let session: ImportSessionInterface = ImportHelper.getById(sessions, vs.sessionId);
    if (visit && session) {
      let row = {
        date: visit.visitDate,
        serviceTimeKey: session.serviceTimeId,
        groupKey: session.groupId,
        personKey: visit.personId
      }
      data.push(row);
    }
  });
  return Papa.unparse(data);
}

const getPhotos = (files: { name: string, contents: string | Buffer }[]) => {
  let result: Promise<any>[] = [];
  people.forEach(async (p) => {
    if (p.photoUpdated !== undefined) result.push(UploadHelper.downloadImageBytes(files, p.id.toString() + ".png", PersonHelper.getPhotoUrl(p)));
  })
  Promise.all(result);
}

export default getChumsData;
