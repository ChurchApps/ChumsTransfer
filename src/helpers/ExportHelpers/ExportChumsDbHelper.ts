import {
  ImportHelper, ImportPersonInterface, ImportHouseholdInterface
  , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
  , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface
  , ImportQuestionsInterface, ImportFormSubmissions, ImportAnswerInterface
} from "../ImportHelper";
import { ApiHelper } from "../../helpers";

const exportToChumsDb = async (exportData: ImportDataInterface, updateProgress: (name: string, status: string) => void) => {

  const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))

  const runImport = async (keyName: string, code: () => void) => {
    updateProgress(keyName, "running");
    try{
      await sleep(100);
      await code();
      updateProgress(keyName, "complete");
    }catch(e){
      updateProgress(keyName, "error");
      throw(e)
    }
  }

  let campusResult = await exportCampuses(exportData, runImport);
  let tmpPeople = await exportPeople(exportData, runImport);
  let tmpGroups = await exportGroups(exportData, tmpPeople, campusResult.serviceTimes, runImport);
  await exportAttendance(exportData, tmpPeople, tmpGroups, campusResult.services, campusResult.serviceTimes, runImport);
  await exportDonations(exportData, tmpPeople, runImport);
  await exportForms(exportData, tmpPeople, runImport);
}

const exportCampuses = async (exportData: ImportDataInterface, runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpCampuses: ImportCampusInterface[] = [...exportData.campuses];
  let tmpServices: ImportServiceInterface[] = [...exportData.services];
  let tmpServiceTimes: ImportServiceTimeInterface[] = [...exportData.serviceTimes];

  await runImport("Campuses/Services/Times", async () => {
    if(tmpCampuses.length > 0) {
      await ApiHelper.post("/campuses", tmpCampuses, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpCampuses[i].id = result[i].id;
      });
    }

    if(tmpServices.length > 0) {
      tmpServices.forEach((s) => { s.campusId = ImportHelper.getByImportKey(tmpCampuses, s.campusKey).id });
      await ApiHelper.post("/services", tmpServices, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpServices[i].id = result[i].id;
      });
    }

    if(tmpServiceTimes.length > 0) {
      tmpServiceTimes.forEach((st) => { st.serviceId = ImportHelper.getByImportKey(tmpServices, st.serviceKey).id });
      await ApiHelper.post("/servicetimes", tmpServiceTimes, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpServiceTimes[i].id = result[i].id;
      });
    }
  });
  return { campuses: tmpCampuses, services: tmpServices, serviceTimes: tmpServiceTimes };
}

const exportPeople = async (exportData: ImportDataInterface, runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpPeople: ImportPersonInterface[] = [...exportData.people];
  let tmpHouseholds: ImportHouseholdInterface[] = [...exportData.households];

  tmpPeople.forEach((p) => {
    if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
  });

  await runImport("Households", async () => {
    if(tmpHouseholds.length > 0) {
      await ApiHelper.post("/households", tmpHouseholds, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpHouseholds[i].id = result[i].id;
      });
    }
  });

  await runImport("People", async () => {
    if(tmpPeople.length > 0) {
      tmpPeople.forEach((p) => {
        p.householdId = ImportHelper.getByImportKey(tmpHouseholds, p.householdKey).id;
        p.householdRole = "Other";
      });
      await ApiHelper.post("/people", tmpPeople, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpPeople[i].id = result[i].id;
      });
    }
  });

  await runImport("Photos", async () => {
    if(tmpPeople.length > 0) {
      tmpPeople.forEach((p) => {
        p.householdId = ImportHelper.getByImportKey(tmpHouseholds, p.householdKey).id;
        p.householdRole = "Other";
      });
      await ApiHelper.post("/people", tmpPeople, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpPeople[i].id = result[i].id;
      });
      await runImport("Photos", async () => {});
    }
  });

  return tmpPeople;
}

const exportGroups = async (exportData: ImportDataInterface, tmpPeople: ImportPersonInterface[], tmpServiceTimes: ImportServiceTimeInterface[], runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpGroups: ImportGroupInterface[] = [...exportData.groups];
  let tmpTimes: ImportGroupServiceTimeInterface[] = [...exportData.groupServiceTimes];
  let tmpMembers: ImportGroupMemberInterface[] = [...exportData.groupMembers];

  await runImport("Groups", async () => {
    if(tmpGroups.length > 0) {
      await ApiHelper.post("/groups", tmpGroups, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpGroups[i].id = result[i].id;
      });
    }
  });

  await runImport("Group Service Times", async () => {
    if(tmpTimes.length > 0) {
      tmpTimes.forEach((gst) => {
        gst.groupId = ImportHelper.getByImportKey(tmpGroups, gst.groupKey).id
        gst.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, gst.serviceTimeKey).id
      });
      await ApiHelper.post("/groupservicetimes", tmpTimes, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpTimes[i].id = result[i].id;
      });
    }
  });

  await runImport("Group Members", async () => {
    if(tmpMembers.length > 0) {
      tmpMembers.forEach((gm) => {
        gm.groupId = ImportHelper.getByImportKey(tmpGroups, gm.groupKey)?.id
        gm.personId = ImportHelper.getByImportKey(tmpPeople, gm.personKey)?.id
      });
      await ApiHelper.post("/groupmembers", tmpMembers, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpMembers[i].id = result[i].id;
      });
    }
  });

  return tmpGroups;
}

const exportForms = async (exportData: ImportDataInterface, tmpPeople: ImportPersonInterface[], runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpForms: ImportFormsInterface[] = [...exportData.forms];
  let tmpQuestions: ImportQuestionsInterface[] = [...exportData.questions];
  let tmpFormSubmissions: ImportFormSubmissions[] = [...exportData.formSubmissions];
  let tmpAnswers: ImportAnswerInterface[] = [...exportData.answers];

  await runImport("Forms", async () => {
    if(tmpForms.length > 0){
      await ApiHelper.post("/forms", tmpForms, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) {
          if (tmpForms[i]) {
            tmpForms[i].id = result[i]?.id;
          }
        }
      })
    }
  })

  await runImport("Questions", async () => {
    if(tmpQuestions.length > 0) {
      tmpQuestions.forEach(q => {
        q.formId = ImportHelper.getByImportKey(tmpForms, q.formKey).id;
      })
      // Update with formId qs
      await ApiHelper.post("/questions", tmpQuestions, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpQuestions[i].id = result[i].id;
      })
    }
  })

  await runImport("Answers", async () => {
    if(tmpFormSubmissions.length > 0){
      tmpFormSubmissions.forEach(fs => {
        let formId = ImportHelper.getByImportKey(tmpForms, fs.formKey).id;;
        fs.formId = formId;
        fs.contentId = ImportHelper.getByImportKey(tmpPeople, fs.personKey).id;

        let questions: any[] = [];
        let answers: any[] = [];
        tmpQuestions.forEach(q => {
          if (q.formId === formId) {
            questions.push(q);

            tmpAnswers.forEach(a => {
              if (a.questionKey === q.questionKey) {
                answers.push({questionId: q.id, value: a.value});
              }
            })

          }
        })
        fs.questions = questions;
        fs.answers = answers;
      })

    }
  })
  await runImport("Form Submissions", async () => {
    if(tmpFormSubmissions.length > 0){
      await ApiHelper.post("/formsubmissions", tmpFormSubmissions, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpFormSubmissions[i].id = result[i].id;
      })
    }
  })
}

const exportDonations = async (exportData: ImportDataInterface, tmpPeople: ImportPersonInterface[], runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpFunds: ImportFundInterface[] = [...exportData.funds];
  let tmpBatches: ImportDonationBatchInterface[] = [...exportData.batches];
  let tmpDonations: ImportDonationInterface[] = [...exportData.donations];

  await runImport("Funds", async () => {
    await ApiHelper.post("/funds", tmpFunds, "GivingApi").then(result => {
      for (let i = 0; i < result.length; i++) tmpFunds[i].id = result[i].id;
    });;
  });

  await runImport("Donation Batches", async () => {
    if(tmpBatches.length > 0){
      await ApiHelper.post("/donationbatches", tmpBatches, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpBatches[i].id = result[i].id;
      });
    }
  });

  await runImport("Donations", async () => {
    if(tmpDonations.length > 0){
      tmpDonations.forEach((d, i) => {
        d.batchId = ImportHelper.getByImportKey(tmpBatches, d.batchKey).id;
        d.personId = ImportHelper.getByImportKey(tmpPeople, d.personKey)?.id;
      });

      await ApiHelper.post("/donations", tmpDonations, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpDonations[i].id = result[i].id;
      });
    }
  });

  await runImport("Donation Funds", async () => {
    let tmpFundDonations: ImportFundDonationInterface[] = [...exportData.fundDonations];
    if(tmpFundDonations.length > 0) {
      tmpFundDonations.forEach((fd) => {
        fd.donationId = ImportHelper.getByImportKey(tmpDonations, fd.donationKey).id;
        fd.fundId = ImportHelper.getByImportKey(tmpFunds, fd.fundKey).id;
      });
      await ApiHelper.post("/funddonations", tmpFundDonations, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpFundDonations[i].id = result[i].id;
      });
    }
  });
}

const exportAttendance = async (exportData: ImportDataInterface, tmpPeople: ImportPersonInterface[], tmpGroups: ImportGroupInterface[], tmpServices: ImportServiceInterface[], tmpServiceTimes: ImportServiceTimeInterface[], runImport: (keyName: string, code: () => void) => Promise<void>) => {
  let tmpSessions: ImportSessionInterface[] = [...exportData.sessions];
  let tmpVisits: ImportVisitInterface[] = [...exportData.visits];
  await runImport("Attendance", async () => {
    if(tmpSessions.length > 0) {
      tmpSessions.forEach((s) => {
        s.groupId = ImportHelper.getByImportKey(tmpGroups, s.groupKey).id;
        s.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, s.serviceTimeKey).id;
      });
      await ApiHelper.post("/sessions", tmpSessions, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpSessions[i].id = result[i].id;
      });
    }

    if(tmpVisits.length > 0){
      tmpVisits.forEach((v) => {
        v.personId = ImportHelper.getByImportKey(tmpPeople, v.personKey).id;
        try {
          v.serviceId = ImportHelper.getByImportKey(tmpServices, v.serviceKey).id;
        } catch {
          v.groupId = ImportHelper.getByImportKey(tmpGroups, v.groupKey).id;
        }
      });
      await ApiHelper.post("/visits", tmpVisits, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpVisits[i].id = result[i].id;
      });
    }

    let tmpVisitSessions: ImportVisitSessionInterface[] = [...exportData.visitSessions];
    if(tmpVisitSessions.length > 0){
      tmpVisitSessions.forEach((vs) => {
        vs.visitId = ImportHelper.getByImportKey(tmpVisits, vs.visitKey).id;
        vs.sessionId = ImportHelper.getByImportKey(tmpSessions, vs.sessionKey).id;
      });
      await ApiHelper.post("/visitsessions", tmpVisitSessions, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpVisitSessions[i].id = result[i].id;
      });
    }
  });
}

export default exportToChumsDb;
