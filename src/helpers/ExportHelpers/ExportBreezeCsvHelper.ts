import { UploadHelper, PersonHelper, PersonInterface } from "..";
import { ArrayHelper } from "../../appBase/helpers/ArrayHelper";
import {
  ImportHelper
  , ImportCampusInterface, ImportServiceInterface
  , ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportDataInterface
} from "../ImportHelper";
import Papa from "papaparse";

const generateChumsZip = async (importData: ImportDataInterface, updateProgress: (name: string, status: string) => void) => {
  let files = [];

  updateProgress("Campuses/Services/Times", "running");
  //files.push({ name: "services.csv", contents: await getCampusServiceTimes(importData) });
  updateProgress("Campuses/Services/Times", "complete");

  updateProgress("People", "running");
  files.push({ name: `people-${new Date().toISOString().split("T")[0]}.xlsx`, contents: await getPeople(importData) });
  updateProgress("People", "complete");

  updateProgress("Photos", "running");
  getPhotos(importData.people, files);
  updateProgress("Photos", "complete");

  updateProgress("Groups", "running");
  files.push({ name: `events-${new Date().toISOString().split("T")[0]}.xlsx`, contents: await getGroups(importData) });
  updateProgress("Groups", "complete");

  updateProgress("Group Members", "running");
  //files.push({ name: "groupmembers.csv", contents: await getGroupMembers(importData) });
  updateProgress("Group Members", "complete");

  updateProgress("Donations", "running");
  files.push({ name: `giving-${new Date().toISOString().split("T")[0]}.xlsx`, contents: await getDonations(importData) });
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
  UploadHelper.zipFiles(files, "export.zip");
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
  let data: any[] = [];
  people.forEach((p) => {
    let row = {
      "Breeze ID": p.id,
      "First Name": p.name.first,
      "Last Name": p.name.last,
      "Middle Name": p.name.middle,
      Nickname: p.name.nick,
      "Maiden Name": "",
      Gender: p.gender,
      Status: p.membershipStatus,
      "Marital Status": p.maritalStatus,
      Birthdate: p.birthDate,
      "Birthdate Month/Day": p.birthDate.getMonth() + "/" + p.birthDate.getDay(),
      Age: PersonHelper.calculateAge(p.birthDate),
      Family: p.name.last,
      "Family Role": p.householdRole,
      School: p.school,
      "Graduation Year": p.graduationDate,
      Grade: p.grade,
      Employer: p.employer,
      Mobile: p.contactInfo.mobilePhone,
      Home: p.contactInfo.homePhone,
      Work: p.contactInfo.workPhone,
      Campus: "",
      Email: p.contactInfo.email,
      "Street Address": p.contactInfo.address1,
      City: p.contactInfo.city,
      State: p.contactInfo.state,
      Zip: p.contactInfo.zip,
      "Added Date": ""
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
        "Event ID": g.importKey,
        "Instance ID": g.id,
        Name: g.name,
        "Start Date": g.startDate,
        "End Date": g.endDate
      }
      data.push(row);
    });
  });
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
  fundDonations.forEach((fd) => {
    let fund: ImportFundInterface = ImportHelper.getById(funds, fd.fundId);
    let donation: ImportDonationInterface = ImportHelper.getById(donations, fd.donationId);
    let batch: ImportDonationBatchInterface = ImportHelper.getById(batches, donation.batchId);
    let row = {
      Date: batch.id,
      Batch: donation.donationDate,
      "Payment ID": donation.personId,
      "Person ID": donation.method,
      "First Name": donation.methodDetails,
      "Last Name": donation.amount,
      Amount: fund.name,
      "Fund(s)": donation.notes,
      "Method ID": donation.notes,
      "Account Number": donation.notes,
      "Check Number": donation.notes,
      Card: donation.notes,
      Note: donation.notes
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
