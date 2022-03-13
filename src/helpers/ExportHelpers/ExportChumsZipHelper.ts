import { UploadHelper, PersonInterface } from "..";
import { ArrayHelper } from "../../appBase/helpers/ArrayHelper";
import {
  ImportHelper
  , ImportCampusInterface, ImportServiceInterface
  , ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface
  , ImportDataInterface
  , ImportHouseholdInterface
} from "../ImportHelper";
import Papa from "papaparse";

const generateChumsZip = async (importData: ImportDataInterface, updateProgress: (name: string, status: string) => void) => {
  let files = [];

  updateProgress("Campuses/Services/Times", "running");
  files.push({ name: "services.csv", contents: await getCampusServiceTimes(importData) });
  updateProgress("Campuses/Services/Times", "complete");

  updateProgress("People", "running");
  files.push({ name: "people.csv", contents: await getPeople(importData) });
  updateProgress("People", "complete");

  updateProgress("Photos", "running");
  getPhotos(importData.people, files);
  updateProgress("Photos", "complete");

  updateProgress("Groups", "running");
  files.push({ name: "groups.csv", contents: await getGroups(importData) });
  updateProgress("Groups", "complete");

  updateProgress("Group Members", "running");
  files.push({ name: "groupmembers.csv", contents: await getGroupMembers(importData) });
  updateProgress("Group Members", "complete");

  updateProgress("Donations", "running");
  files.push({ name: "donations.csv", contents: await getDonations(importData) });
  updateProgress("Donations", "complete");

  updateProgress("Attendance", "running");
  files.push({ name: "attendance.csv", contents: await getAttendance(importData) });
  updateProgress("Attendance", "complete");

  updateProgress("Forms", "running");
  files.push({ name: "forms.csv", contents: await getForms(importData) });
  updateProgress("Forms", "complete");

  updateProgress("Questions", "running");
  files.push({ name: "questions.csv", contents: await getQuestions(importData) });
  updateProgress("Questions", "complete");

  updateProgress("Form Submissions", "running");
  files.push({ name: "formSubmissions.csv", contents: await getFormSubmissions(importData) });
  updateProgress("Form Submissions", "complete");

  updateProgress("Answers", "running");
  files.push({ name: "answers.csv", contents: await getAnswers(importData) });
  updateProgress("Answers", "complete");

  updateProgress("Compressing", "running");
  UploadHelper.zipFiles(files, "ChumsExport.zip");
  updateProgress("Compressing", "complete");
}
const getCampusServiceTimes = async (importData : ImportDataInterface) => {
  const {campuses, services, serviceTimes} = importData;
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

const getPeople = async (importData : ImportDataInterface) => {
  const { people } = importData;
  let tmpHouseholds: ImportHouseholdInterface[] = [...importData.households];
  let data: any[] = [];
  people.forEach((p) => {
    let household = tmpHouseholds.find(h => p.householdKey === h.importKey)
    let row = {
      importKey: p.importKey,
      household: household.name ?? p.name.last,
      lastName: p.name.last, firstName: p.name.first, middleName: p.name.middle, nickName: p.name.nick,
      birthDate: p.birthDate, gender: p.gender, maritalStatus: p.maritalStatus, membershipStatus: p.membershipStatus,
      homePhone: p.contactInfo.homePhone, mobilePhone: p.contactInfo.mobilePhone, workPhone: p.contactInfo.workPhone, email: p.contactInfo.email,
      address1: p.contactInfo.address1, address2: p.contactInfo.address2, city: p.contactInfo.city, state: p.contactInfo.state, zip: p.contactInfo.zip,
      photo: (p.photoUpdated === undefined) ? "" : p.id.toString() + ".png"
    }
    data.push(row);
  });
  return Papa.unparse(data);
}

const getGroups = async (importData : ImportDataInterface) => {
  const {groups, groupServiceTimes} = importData;
  let data: any[] = [];
  groups.forEach((g) => {
    let serviceTimeIds: string[] = [];
    let gst: ImportGroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes, "groupId", g.id);
    if (gst.length === 0) serviceTimeIds = [""];
    else gst.forEach((time) => { serviceTimeIds.push(time.serviceTimeId.toString()) });
    serviceTimeIds.forEach((serviceTimeId) => {
      let row = {
        importKey: g.id,
        serviceTimeKey: serviceTimeId,
        categoryName: g.categoryName,
        name: g.name,
        trackAttendance: g.trackAttendance ? "TRUE" : "FALSE"
      }
      data.push(row);
    });
  });
  return Papa.unparse(data);
}

const getForms = async (importData : ImportDataInterface) => {
  const { forms } = importData;
  let data: any[] = [];
  forms.forEach((f) => {
    let row = {
      importKey: f.id,
      name: f.name,
      contentType: f.contentType
    }
    data.push(row);
  })
  return Papa.unparse(data);
}

const getQuestions = async (importData : ImportDataInterface) => {
  const {questions} = importData;
  let data: any[] = [];
  questions.forEach(q => {
    let row = {
      questionKey: q.id,
      formKey: q.formId,
      fieldType: q.fieldType,
      title: q.title
    }
    data.push(row);
  })

  return Papa.unparse(data);
}

const getFormSubmissions = async (importData : ImportDataInterface) => {
  const {formSubmissions} = importData;
  let data: any[] = [];
  formSubmissions.forEach(fs => {
    let row = {
      formKey: fs.formId,
      personKey: fs.contentId,
      contentType: fs.contentType
    }
    data.push(row);
  })

  return Papa.unparse(data);
}

const getAnswers = async (importData : ImportDataInterface) => {
  const { answers } = importData;
  let data: any[] = [];
  answers.forEach(a => {
    let row = {
      questionKey: a.questionId,
      formSubmissionKey: a.formSubmissionId,
      value: a.value
    }
    data.push(row);
  })

  return Papa.unparse(data);
}

const getGroupMembers = async (importData : ImportDataInterface) => {
  const {groupMembers} = importData;
  let data: any[] = [];
  groupMembers.forEach((gm) => {
    let row = { groupKey: gm.groupId, personKey: gm.personId }
    data.push(row);
  });
  return Papa.unparse(data);
}

const getDonations = async (importData : ImportDataInterface) => {
  const {funds, batches, donations, fundDonations} = importData;
  let data: any[] = [];
  donations.forEach((donation) => {
    let fund: ImportFundInterface = ImportHelper.getById(funds, donation.fund?.id);
    let batch: ImportDonationBatchInterface = ImportHelper.getById(batches, donation.batchId);
    let row = {
      batch: batch ? batch.id : "",
      date: donation.donationDate,
      personKey: donation.person?.id,
      method: donation.method,
      methodDetails: donation.methodDetails,
      amount: donation.amount,
      fund: fund ? fund.name : "",
      notes: donation.notes
    }
    data.push(row);
  });
  return Papa.unparse(data);
}

const getAttendance = async (importData : ImportDataInterface) => {
  const {sessions, visits, visitSessions} = importData;
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

const getPhotos = (people: PersonInterface[], files: { name: string, contents: string | Buffer }[]) => {
  let result: Promise<any>[] = [];
  people.forEach(async (p) => {
    if (p.photoUpdated !== undefined) result.push(UploadHelper.downloadImageBytes(files, p.id.toString() + ".png", p.photo));
  })
  Promise.all(result);
}

export default generateChumsZip;
