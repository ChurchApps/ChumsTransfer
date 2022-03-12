import { PersonInterface, CampusInterface, ServiceInterface, ServiceTimeInterface, GroupInterface, GroupMemberInterface, GroupServiceTimeInterface, HouseholdInterface, SessionInterface, VisitInterface, VisitSessionInterface, DonationBatchInterface, FundInterface, DonationInterface, FundDonationInterface, ArrayHelper, FormInterface, QuestionInterface, FormSubmissionInterface, AnswerInterface } from "./";

export interface ImportCampusInterface extends CampusInterface { importKey: string }
export interface ImportServiceInterface extends ServiceInterface { importKey: string, campusKey?: string }
export interface ImportServiceTimeInterface extends ServiceTimeInterface { importKey?: string, serviceKey?: string }

export interface ImportGroupServiceTimeInterface extends GroupServiceTimeInterface { importKey: string, groupKey?: string, serviceTimeKey?: string }
export interface ImportGroupInterface extends GroupInterface { importKey: string, serviceTimeKey: string, startDate: Date, endDate: Date }
export interface ImportGroupMemberInterface extends GroupMemberInterface { groupKey: string, personKey: string }

export interface ImportPersonInterface extends PersonInterface { importKey: string, householdKey?: string, }
export interface ImportHouseholdInterface extends HouseholdInterface { importKey: string }

export interface ImportSessionInterface extends SessionInterface { importKey: string, groupKey: string, serviceTimeKey: string }
export interface ImportVisitInterface extends VisitInterface { importKey: string, personKey: string, serviceKey: string, groupKey: string }
export interface ImportVisitSessionInterface extends VisitSessionInterface { visitKey: string, sessionKey: string }

export interface ImportDonationBatchInterface extends DonationBatchInterface { importKey: string }
export interface ImportFundInterface extends FundInterface { importKey: string }
export interface ImportDonationInterface extends DonationInterface { importKey: string, batchKey: string, personKey: string, fundKey: string }
export interface ImportFundDonationInterface extends FundDonationInterface { fundKey: string, donationKey: string }

export interface ImportFormsInterface extends FormInterface { importKey: string }
export interface ImportQuestionsInterface extends QuestionInterface { formKey: string, questionKey: string }
export interface ImportFormSubmissions extends FormSubmissionInterface { formKey: string, personKey: string }
export interface ImportAnswerInterface extends AnswerInterface { questionKey: string, formSubmissionKey: string }

export interface ImportDataInterface {
    people: ImportPersonInterface[],
    households: ImportHouseholdInterface[]
    campuses: ImportCampusInterface[]
    services: ImportServiceInterface[]
    serviceTimes: ImportServiceTimeInterface[]
    groupServiceTimes: ImportGroupServiceTimeInterface[]
    groups: ImportGroupInterface[]
    groupMembers: ImportGroupMemberInterface[]
    visits: ImportVisitInterface[]
    sessions: ImportSessionInterface[]
    visitSessions: ImportVisitSessionInterface[]
    batches: ImportDonationBatchInterface[]
    donations: ImportDonationInterface[]
    funds: ImportFundInterface[]
    fundDonations: ImportFundDonationInterface[]
    forms: ImportFormsInterface[]
    questions: ImportQuestionsInterface[]
    formSubmissions: ImportFormSubmissions[]
    answers: ImportAnswerInterface[]
}

export class ImportHelper {
  //get one
  static getPerson(people: ImportPersonInterface[], importKey: string) { return ArrayHelper.getOne(people, "importKey", importKey) as ImportPersonInterface; }
  static getServiceTime(serviceTimes: ImportServiceTimeInterface[], importKey: string) { return ArrayHelper.getOne(serviceTimes, "importKey", importKey) as ImportServiceTimeInterface; }
  static getByImportKey(items: any[], importKey: string) { return ArrayHelper.getOne(items, "importKey", importKey); }
  static getById(items: any[], id: string) { return ArrayHelper.getOne(items, "id", id); }

  //get all
  static getVisitSessions(visitSessions: ImportVisitSessionInterface[], sessionKey: string) { return ArrayHelper.getAll(visitSessions, "sessionKey", sessionKey) as ImportServiceTimeInterface[]; }
  static getGroupServiceTimesByGroupKey(groupServiceTimes: ImportGroupServiceTimeInterface[], groupKey: string) { return ArrayHelper.getAll(groupServiceTimes, "groupKey", groupKey) as ImportGroupServiceTimeInterface[]; }
  static getGroupMembers(groupMembers: ImportGroupMemberInterface[], groupKey: string) { return ArrayHelper.getAll(groupMembers, "groupKey", groupKey) as ImportGroupMemberInterface[]; }
  static getServices(services: ImportServiceInterface[], campusKey: string) { return ArrayHelper.getAll(services, "campusKey", campusKey) as ImportServiceInterface[]; }
  static getServiceTimes(serviceTimes: ImportServiceTimeInterface[], serviceKey: string) { return ArrayHelper.getAll(serviceTimes, "serviceKey", serviceKey) as ImportServiceTimeInterface[]; }
  static getGroupServiceTimes(groupServiceTimes: ImportGroupServiceTimeInterface[], serviceTimeKey: string) { return ArrayHelper.getAll(groupServiceTimes, "serviceTimeKey", serviceTimeKey) as ImportGroupServiceTimeInterface[]; }
  static getHouseholdMembers(householdKey: string, people: ImportPersonInterface[]) {
    let result = ArrayHelper.getAll(people, "householdKey", householdKey) as ImportPersonInterface[];
    return result;
  };

  //get or create
  static getOrCreateFund(funds: ImportFundInterface[], name: string) {
    let result = ArrayHelper.getOne(funds, "name", name);
    if (result === null) {
      result = { importKey: (funds.length + 1).toString(), name: name } as ImportFundInterface;
      funds.push(result);
    }
    return result;
  }

  static getOrCreateBatch(batches: ImportDonationBatchInterface[], name: string, date: Date) {
    let result = ArrayHelper.getOne(batches, "name", name);
    if (result === null) {
      result = { importKey: (batches.length + 1).toString(), name: name, batchDate: date } as ImportDonationBatchInterface;
      batches.push(result);
    }
    return result;
  }

  static getOrCreateVisit(visits: ImportVisitInterface[], data: any, serviceTimes: ImportServiceTimeInterface[]) {
    let serviceTime: ImportServiceTimeInterface = this.getByImportKey(serviceTimes, data.serviceTimeKey);
    let serviceKey = (serviceTime === null) ? "" : serviceTime.serviceKey;
    for (let i = 0; i < visits.length; i++) {
      let v = visits[i];
      if (v.personKey === data.personKey && v.serviceKey === serviceKey && v.groupKey === data.groupKey && v.visitDate === new Date(data.date)) return v;
    }
    let result = { importKey: (visits.length + 1).toString(), visitDate: new Date(data.date), personKey: data.personKey, serviceKey: serviceKey, groupKey: data.groupKey } as ImportVisitInterface;
    visits.push(result);
    return result;
  }

  static getOrCreateSession(sessions: ImportSessionInterface[], sessionDate: Date, groupKey: string, serviceTimeKey: string) {
    for (let i = 0; i < sessions.length; i++) if (sessions[i].sessionDate.toString() === sessionDate.toString() && sessions[i].groupKey === groupKey && sessions[i].serviceTimeKey === serviceTimeKey) return sessions[i];
    let result = { importKey: (sessions.length + 1).toString(), sessionDate: sessionDate, groupKey: groupKey, serviceTimeKey: serviceTimeKey } as ImportSessionInterface;
    sessions.push(result);
    return result;
  }

  static getOrCreateCampus(campuses: ImportCampusInterface[], campusName: string) {
    if (campusName === undefined || campusName === null || campusName === "") return null;
    let result = ArrayHelper.getOne(campuses, "name", campusName);
    if (result === null) {
      result = { name: campusName, importKey: (campuses.length + 1).toString() } as ImportCampusInterface;
      campuses.push(result);
    }
    return result;
  }

  static getOrCreateService(services: ImportServiceInterface[], serviceName: string, campus: ImportCampusInterface) {
    if (campus === null || serviceName === undefined || serviceName === null || serviceName === "") return null;
    for (let i = 0; i < services.length; i++) if (services[i].name === serviceName && services[i].campusKey === campus.importKey) return services[i];
    let result = { name: serviceName, importKey: (services.length + 1).toString(), campusKey: campus.importKey } as ImportServiceInterface;
    services.push(result);
    return result;
  }

  static getOrCreateServiceTime(serviceTimes: ImportServiceTimeInterface[], data: any, service: ImportServiceInterface) {
    if (service === null || data.importKey === undefined || data.importKey === null || data.importKey === "") return null;
    let result: ImportServiceTimeInterface = this.getByImportKey(serviceTimes, data.serviceTimeKey);
    if (result === null) {
      result = { serviceKey: service.importKey, importKey: data.importKey, name: data.time } as ImportServiceTimeInterface
      serviceTimes.push(result);
    }
    return result;
  }

  static getOrCreateGroup(groups: ImportGroupInterface[], data: any) {
    let result = this.getByImportKey(groups, data.importKey) as ImportGroupInterface;
    if (result === null) {
      result = data as ImportGroupInterface;
      result.trackAttendance = (data.trackAttendance === "TRUE");
      result.parentPickup = (data.parentPickup === "TRUE");
      if (result.importKey === "" || result.importKey === undefined || result.importKey === null) result.importKey = (groups.length + 1).toString();
      groups.push(result);
    }
    return result;
  }
}
