export * from "../appBase/interfaces";

export interface StandardInterface {
  attendance?: StandardAttendanceInterface[];
  donations?: StandardDonationInterface[];
  events?: StandardEventInterface[];
  groupMembers?: StandardGroupMemberInterface[];
  groups?: StandardGroupInerface[];
  notes?: StandardNoteInterface[];
  people?: StandardPeopleInterface[];
  services?: StandardServiceInterface[];
}

export interface StandardDataInterface {
  name: string | symbol,
  value: () => {},
  rawValue: string | number,
  fileName: string
}

export interface StandardPeopleInterface {
	address1?: StandardDataInterface;
	address2?: StandardDataInterface;
  age?: StandardDataInterface;
	birth_date?: StandardDataInterface;
  birthdate_month: StandardDataInterface;
  campus?: StandardDataInterface;
	city?: StandardDataInterface;
  date_added?: StandardDataInterface;
	email?: StandardDataInterface;
  employer?: StandardDataInterface;
  family_id?: StandardDataInterface;
  family_role?: StandardDataInterface;
	first_name?: StandardDataInterface;
	gender?: StandardDataInterface;
  grade?: StandardDataInterface;
  graduation_year?: StandardDataInterface;
	home_phone?: StandardDataInterface;
	household_name?: StandardDataInterface;
	last_name?: StandardDataInterface;
  maiden_name?: StandardDataInterface;
	marital_status?: StandardDataInterface;
	membership_status?: StandardDataInterface;
	middle_name?: StandardDataInterface;
	mobile_phone?: StandardDataInterface;
	nickname?: StandardDataInterface;
	photo?: StandardDataInterface;
  school?: StandardDataInterface;
	state?: StandardDataInterface;
	work_phone?: StandardDataInterface;
	zip?: StandardDataInterface;
}

export interface StandardDonationInterface {
  account_number?: StandardDataInterface;
  amount?: StandardDataInterface;
  batch?: StandardDataInterface;
  card?: StandardDataInterface;
  check_number?: StandardDataInterface;
  date?: StandardDataInterface;
  first_name?: StandardDataInterface;
  fund?: StandardDataInterface;
  last_name?: StandardDataInterface;
  method_id?: StandardDataInterface;
  method?: StandardDataInterface;
  note?: StandardDataInterface;
  notes?: StandardDataInterface;
  payment_id?: StandardDataInterface;
  person_id?: StandardDataInterface;
  person_key?: StandardDataInterface;
}

export interface StandardAttendanceInterface {
  date?: StandardDataInterface;
  group_key?: StandardDataInterface;
  person_key?: StandardDataInterface;
  service_time_key?: StandardDataInterface;
}

export interface StandardGroupInerface {
  category_name?: StandardDataInterface;
  import_key?: StandardDataInterface;
  name?: StandardDataInterface;
  service_time_key?: StandardDataInterface;
  track_attendance?: StandardDataInterface;
}

export interface StandardGroupMemberInterface {
  group_key?: StandardDataInterface;
  person_key?: StandardDataInterface;
}

export interface StandardServiceInterface {
  campus?: StandardDataInterface;
  import_key?: StandardDataInterface;
  service?: StandardDataInterface;
  time?: StandardDataInterface;
}

export interface StandardNoteInterface {
  breeze_id?: StandardDataInterface;
  created_on?: StandardDataInterface;
  first_name?: StandardDataInterface;
  is_private?: StandardDataInterface;
  last_name?: StandardDataInterface;
  note?: StandardDataInterface;
  username?: StandardDataInterface;
}

export interface StandardEventInterface {
  end_date?: StandardDataInterface
  event_id?: StandardDataInterface
  instance_id?: StandardDataInterface
  name?: StandardDataInterface
  start_date?: StandardDataInterface
}