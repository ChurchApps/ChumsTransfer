import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Alert, Box, Typography } from "@mui/material";
import { DisplayBox, ImportHelper, DateHelper, CurrencyHelper } from ".";
import { ImportGroupInterface, ImportPersonInterface, ImportDonationBatchInterface, ImportDonationInterface, ImportFundInterface, ImportDataInterface } from "../helpers/ImportHelper";

interface Props { importData: ImportDataInterface, triggerRender: number }

export const ImportPreview: React.FC<Props> = (props) => {
  const [activeTab, setActiveTab] = React.useState('people');
  let x: number;

  const getPeopleTable = () => {
    if (props.importData.households.length === 0) return null;
    else {
      if (props.triggerRender > -1) {                       //This line is just to trigger re-render when a photo is downloaded
        let rows = [];
        for (let i = 0; i < props.importData.households.length; i++) {
          x = i;
          rows.push(
            <TableRow key={x}>
              <TableCell colSpan={3}>
                <i>{props.importData.households[i].name} Household</i>
              </TableCell>
            </TableRow>
          );
          let members = ImportHelper.getHouseholdMembers(props.importData.households[i].importKey, props.importData.people);
          for (let j = 0; j < members.length; j++) {
            let p = members[j];
            let imgTag = (p.photo === undefined || p.photo === "") ? null : <img src={p.photo} className="personPhoto" alt="person" />;
            rows.push(
              <TableRow key={Math.random()}>
                <TableCell>{imgTag}</TableCell>
                <TableCell>{p.name.first}</TableCell>
                <TableCell>{p.name.last}</TableCell>
              </TableRow>
            );
          }
        }
        return (
          <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
        );
      }
    }
    return null;
  }

  const getMemberCount = (groupKey: string) => {
    let count = ImportHelper.getGroupMembers(props.importData.groupMembers, groupKey).length;
    return (count === 1) ? "1 member" : count.toString() + " members";
  }

  const getGroupsTable = () => {
    if (props.importData.groups.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.campuses.length; i++) {
        let campus = props.importData.campuses[i];
        let filteredServices = ImportHelper.getServices(props.importData.services, campus.importKey);

        for (let j = 0; j < filteredServices.length; j++) {
          let service = filteredServices[j];
          let filteredTimes = ImportHelper.getServiceTimes(props.importData.serviceTimes, service.importKey);

          for (let k = 0; k < filteredTimes.length; k++) {
            let time = filteredTimes[k];
            let filteredGroupServiceTimes = ImportHelper.getGroupServiceTimes(props.importData.groupServiceTimes, time.importKey);
            for (let l = 0; l < filteredGroupServiceTimes.length; l++) {
              let group = props.importData.groups.find(group => group.id === filteredGroupServiceTimes[l].groupId);
              if (group) {
                rows.push(
          <TableRow key={group.name + Math.random()}>
            <TableCell>{campus.name}</TableCell>
            <TableCell>{service.name}</TableCell>
            <TableCell>{time.name}</TableCell>
            <TableCell>{group.categoryName}</TableCell>
            <TableCell>{group.name}</TableCell>
            <TableCell>{getMemberCount(group.importKey)}</TableCell>
          </TableRow>
        );
              }
            }
          }
        }
      }

      for (let i = 0; i < props.importData.groups.length; i++) {
        let groupServiceTimes = ImportHelper.getGroupServiceTimesByGroupKey(props.importData.groupServiceTimes, props.importData.groups[i].importKey);
        if (groupServiceTimes.length === 0) rows.push(
          <TableRow key={Math.random() * 10000}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{props.importData.groups[i].categoryName}</TableCell>
            <TableCell>{props.importData.groups[i].name}</TableCell>
            <TableCell>{getMemberCount(props.importData.groups[i].importKey)}</TableCell>
          </TableRow>
        );
      }

      return (
        <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Campus</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Members</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  const getAttendanceTable = () => {

    if (props.importData.sessions.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.sessions.length; i++) {
        let session = props.importData.sessions[i];
        let group: ImportGroupInterface = ImportHelper.getByImportKey(props.importData.groups, session.groupKey);
        let vs = ImportHelper.getVisitSessions(props.importData.visitSessions, session.importKey);
        rows.push(
          <TableRow key={Math.random()}>
            <TableCell>{DateHelper.prettyDate(new Date(session.sessionDate))}</TableCell>
            <TableCell>{group?.name}</TableCell>
            <TableCell>{vs.length}</TableCell>
          </TableRow>
        );
      }
      return (
        <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Visits</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  const getDonationsTable = () => {
    if (props.importData.donations.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.donations.length; i++) {
        let donation: ImportDonationInterface = props.importData.donations[i];
        let batch: ImportDonationBatchInterface = ImportHelper.getByImportKey(props.importData.batches, donation.batchKey);
        let fund: ImportFundInterface = ImportHelper.getByImportKey(props.importData.funds, donation.fundKey);
        let person: ImportPersonInterface = ImportHelper.getByImportKey(props.importData.people, donation.personId);
        let personName = (person === null) ? "" : person.name.first + " " + person.name.last;
        rows.push(
          <TableRow key={Math.random()}>
            <TableCell>{DateHelper.prettyDate(new Date(donation.donationDate))}</TableCell>
            <TableCell>{batch.name}</TableCell>
            <TableCell>{personName}</TableCell>
            <TableCell>{fund?.name}</TableCell>
            <TableCell>{CurrencyHelper.formatCurrency(donation.amount)}</TableCell>
          </TableRow>
        );
      }
      return (
        <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Person</TableCell>
                <TableCell>Fund</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  const getFormsTable = () => {
    if (props.importData.forms.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0, totalForms = props.importData.forms.length; i < totalForms; i++) {
        let form = props.importData.forms[i];
        rows.push(
          <TableRow key={Math.random()}>
            <TableCell>{form.name}</TableCell>
            <TableCell>{form.contentType}</TableCell>
          </TableRow>
        )
      }
      return (
        <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Content Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      )
    }
  }

  if (props.importData.people.length === 0) return (
    <Alert severity="info">
      <strong>Important:</strong> This tool is designed to help you load your initial data into the system. Using it after you have been using Chums for a while is risky and may result in duplicated data.
    </Alert>
  );
  else return (
    <Box>
      <Typography variant="h6" component="h3" gutterBottom color="text.primary" sx={{ mb: 3 }}>
        Data Preview
      </Typography>
      
      {/* Tab Navigation */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        mb: 3,
        bgcolor: 'grey.50',
        borderRadius: 1,
        p: 1
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="People" value="people" />
          <Tab label="Groups" value="groups" />
          <Tab label="Attendance" value="attendance" />
          <Tab label="Donations" value="donations" />
          <Tab label="Forms" value="forms" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ 
        minHeight: 300,
        bgcolor: 'grey.100',
        p: 3,
        borderRadius: 2,
        '& .MuiTableContainer-root': {
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}>
        {activeTab === 'people' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
              People & Households
            </Typography>
            {getPeopleTable()}
          </Box>
        )}
        {activeTab === 'groups' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
              Groups & Memberships
            </Typography>
            {getGroupsTable()}
          </Box>
        )}
        {activeTab === 'attendance' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
              Attendance Records
            </Typography>
            {getAttendanceTable()}
          </Box>
        )}
        {activeTab === 'donations' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
              Donations & Gifts
            </Typography>
            {getDonationsTable()}
          </Box>
        )}
        {activeTab === 'forms' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 2 }}>
              Forms & Submissions
            </Typography>
            {getFormsTable()}
          </Box>
        )}
      </Box>
    </Box>
  );
}
