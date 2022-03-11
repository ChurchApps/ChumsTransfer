import { UploadHelper, PersonHelper, PersonInterface, DownloadHelper } from "..";
import { ArrayHelper } from "../../appBase/helpers/ArrayHelper";
import {
  ImportHelper
  , ImportCampusInterface, ImportServiceInterface
  , ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportDataInterface
} from "../ImportHelper";

const generateBreezeZip = async (importData: ImportDataInterface, updateProgress: (name: string, status: string) => void) => {
  let files = [];

  updateProgress("Campuses/Services/Times", "running");
  //files.push({ name: "services.csv", contents: await getCampusServiceTimes(importData) });
  updateProgress("Campuses/Services/Times", "complete");

  updateProgress("People", "running");
  let peopleFileName = `people-${new Date().toISOString().split("T")[0]}.xlsx`;
  let peopleData = await getPeople(importData);
  let peopleXlxsBuffer = DownloadHelper.createXlxs(peopleData)
  files.push({ name: peopleFileName, contents: peopleXlxsBuffer });
  updateProgress("People", "complete");

  updateProgress("Photos", "running");
  getPhotos(importData.people, files);
  updateProgress("Photos", "complete");

  updateProgress("Groups", "running");
  let groupsFileName = `events-${new Date().toISOString().split("T")[0]}.xlsx`;
  let eventData = await getGroups(importData);
  let eventXlxsBuffer = DownloadHelper.createXlxs(eventData)
  files.push({ name: groupsFileName, contents: eventXlxsBuffer });
  updateProgress("Groups", "complete");

  updateProgress("Group Members", "running");
  //files.push({ name: "groupmembers.csv", contents: await getGroupMembers(importData) });
  updateProgress("Group Members", "complete");

  updateProgress("Donations", "running");
  let donationsFileName = `giving-${new Date().toISOString().split("T")[0]}.xlsx`;
  let dontationData = await getDonations(importData);
  let donationXlxsBuffer = DownloadHelper.createXlxs(dontationData)
  files.push({ name: donationsFileName, contents: donationXlxsBuffer });
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
  UploadHelper.zipFiles(files, "BreezeExport.zip");
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
  return data;
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
      "Birthdate Month/Day": new Date(p.birthDate).getMonth() + "/" + new Date(p.birthDate).getDay(),
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
  return data;
}

const getGroups = async (importData : ImportDataInterface) => {
  const {groups, groupServiceTimes} = importData;
  let data: any[] = [];
  groups.forEach((g) => {
    let serviceTimeIds: string[] = [];
    let gst: ImportGroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes, "groupId", g.id);
    if (gst.length === 0) serviceTimeIds = [""];
    else gst.forEach((time) => time?.serviceTimeId ? serviceTimeIds.push(time?.serviceTimeId?.toString()) : null );
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
  return data;
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

  return data;
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

  return data;
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

  return data;
}

const getGroupMembers = async (importData : ImportDataInterface) => {
  const {groupMembers} = importData;
  let data: any[] = [];
  groupMembers.forEach((gm) => {
    let row = { groupKey: gm.groupId, personKey: gm.personId }
    data.push(row);
  });
  return data;
}

const getDonations = async (importData : ImportDataInterface) => {
  const {batches, donations} = importData;
  let data: any[] = [];
  donations.forEach((donation) => {
    let batch: ImportDonationBatchInterface = ImportHelper.getByImportKey(batches, donation.batchKey);
    let row = {
      Date: batch.batchDate,
      Batch: donation.batchKey,
      "Payment ID": "",
      "Person ID": donation.person?.id,
      "First Name": donation.person?.name.first,
      "Last Name": donation.person?.name.last,
      Amount: donation.amount,
      "Fund(s)": donation.fund?.name,
      "Method ID": donation.method,
      "Account Number": "",
      "Check Number": "",
      Card: donation.methodDetails,
      Note: donation.notes
    }
    data.push(row);
  });
  return data;
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
  return data;
}

const getPhotos = (people: PersonInterface[], files: { name: string, contents: string | Buffer }[]) => {
  let result: Promise<any>[] = [];
  people.forEach(async (p) => {
    if (p.photoUpdated !== undefined) result.push(UploadHelper.downloadImageBytes(files, p.id.toString() + ".png", p.photo));
  })
  Promise.all(result);
}

export default generateBreezeZip;
