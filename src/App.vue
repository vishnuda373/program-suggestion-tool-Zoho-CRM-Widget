<template>
  <div class="container mt-2">
      <b-tabs type="is-toggle" expanded>
        <b-tab-item v-if="getPrograms" label="Suggested Programs">
        <b-field label="Search Program" grouped>
            <b-input v-model="searchQuery" placeholder="Program or College or Country or Intake" type="search"></b-input>
            <p class="control">
                <b-button class="button is-primary" @click="searchProgram">Search</b-button>
            </p>
        </b-field>
        <p v-if="numberOfPrograms > 0">{{ numberOfPrograms }} programs found </p>
        <p v-else>No programs found</p>
            <b-table
              :data="getPrograms"
              :hoverable="true"
              paginated
              per-page="6"
              detailed
              detail-key="id"
            >
              <b-table-column field="Name" label="Program" v-slot="props">
                <a @click="props.toggleDetails(props.row)">
                  {{ props.row.Name }}
                </a>
              </b-table-column>
              <b-table-column
                field="Institution"
                label="Institution"
                v-slot="props"
              >
                {{ props.row.Institution.name }}
              </b-table-column>
              <b-table-column label="Next Intakes" v-slot="props">
                <template>
                  <b-taglist>
                    <b-tag
                      v-if="props.row.Intake_1_Status"
                      :class="intakeStatus(props.row.Intake_1_Status)"
                    >
                      {{ props.row.Intake_1 }}
                    </b-tag>
                    <b-tag
                      v-if="props.row.Intake_2_Status"
                      :class="intakeStatus(props.row.Intake_2_Status)"
                    >
                      {{ props.row.Intake_2 }}
                    </b-tag>
                    <b-tag
                      v-if="props.row.Intake_3_Status"
                      :class="intakeStatus(props.row.Intake_3_Status)"
                    >
                      {{ props.row.Intake_3 }}
                    </b-tag>
                  </b-taglist>
                </template>
              </b-table-column>
              <template #detail="props">
                <div class="content columns">
                  <div class="column">
                    <strong>{{ props.row.Name }}</strong>
                    <br /><small>{{ props.row.Institution.name }}</small>
                    <div>
                      Duration of Course :
                      <span v-if="props.row.Duration_of_Course"
                        >{{ props.row.Duration_of_Course }} months
                      </span>
                      <span v-else>Unavailable </span>
                    </div>
                    <div>
                      Processing Time :
                      <span v-if="props.row.Processing_Time_Days"
                        >{{ props.row.Processing_Time_Days }} Days
                      </span>
                      <span v-else>Unavailable </span>
                    </div>
                    <div>
                      Additional Requirements :
                      <p v-if="props.row.Additional_Requirements">
                        {{ props.row.Additional_Requirements }}
                      </p>
                      <span v-else>None </span>
                    </div>
                  </div>
                  <div class="column">
                    <div>
                      <b-field grouped group-multiline>
                        <div class="control">
                          <b-taglist attached>
                            <b-tag type="is-info is-light">Band</b-tag>
                            <b-tag
                              v-if="props.row.Required_IELTS_Score"
                              type="is-info"
                              >{{ props.row.Required_IELTS_Score }}</b-tag
                            >
                            <b-tag v-else type="is-light">NA</b-tag>
                          </b-taglist>
                        </div>
                        <div>
                          <b-taglist attached>
                            <b-tag type="is-info is-light">Reading</b-tag>
                            <b-tag
                              v-if="props.row.IELTS_Reading"
                              type="is-info"
                              >{{ props.row.IELTS_Reading }}</b-tag
                            >
                            <b-tag v-else type="is-light">NA</b-tag>
                          </b-taglist>
                        </div>
                        <div>
                          <b-taglist attached>
                            <b-tag type="is-info is-light">Writing</b-tag>
                            <b-tag
                              v-if="props.row.IELTS_Writing"
                              type="is-info"
                              >{{ props.row.IELTS_Writing }}</b-tag
                            >
                            <b-tag v-else type="is-light">NA</b-tag>
                          </b-taglist>
                        </div>
                        <div>
                          <b-taglist attached>
                            <b-tag type="is-info is-light">Speaking</b-tag>
                            <b-tag
                              v-if="props.row.IELTS_Speaking"
                              type="is-info"
                              >{{ props.row.IELTS_Speaking }}</b-tag
                            >
                            <b-tag v-else type="is-light">NA</b-tag>
                          </b-taglist>
                        </div>
                        <div>
                          <b-taglist attached>
                            <b-tag type="is-info is-light">Listening</b-tag>
                            <b-tag
                              v-if="props.row.IELTS_Listening"
                              type="is-info"
                              >{{ props.row.IELTS_Listening }}</b-tag
                            >
                            <b-tag v-else type="is-light">NA</b-tag>
                          </b-taglist>
                        </div>
                      </b-field>
                    </div>
                    <br />
                    <table>
                      <tbody>
                        <tr v-if="props.row.Intake_1">
                          <td>{{ props.row.Intake_1 }}</td>
                          <td>{{ props.row.Intake_1_Status }}</td>
                          <td>{{ props.row.Intake_1_Fee | toCurrency }}</td>
                          <td>
                            <b-button
                              type="is-small"
                              :disabled="
                                intakeApplication(props.row.Intake_1_Status)
                              "
                              @click="createCandidateProgram(props.row, props.row.Intake_1)"
                              >Select</b-button
                            >
                          </td>
                        </tr>
                        <tr v-if="props.row.Intake_2">
                          <td>{{ props.row.Intake_2 }}</td>
                          <td>{{ props.row.Intake_2_Status }}</td>
                          <td>{{ props.row.Intake_2_Fee | toCurrency }}</td>
                          <td>
                            <b-button
                              type="is-small"
                              :disabled="
                                intakeApplication(props.row.Intake_2_Status)
                              "
                              @click="createCandidateProgram(props.row, props.row.Intake_2)"
                              >Select</b-button
                            >
                          </td>
                        </tr>
                        <tr v-if="props.row.Intake_3">
                          <td>{{ props.row.Intake_3 }}</td>
                          <td>{{ props.row.Intake_3_Status }}</td>
                          <td>{{ props.row.Intake_3_Fee | toCurrency }}</td>
                          <td>
                            <b-button
                              type="is-small"
                              :disabled="
                                intakeApplication(props.row.Intake_3_Status)
                              "
                              @click="createCandidateProgram(props.row, props.row.Intake_3)"
                              >Select</b-button
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </b-table>
            <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
        </b-tab-item>
        <b-tab-item v-if="getCandidatePrograms" label="Interested Programs">
           <b-table :data="getCandidatePrograms">
            <b-table-column label="Priority" v-slot="props" width="20px">
              {{ props.row.Preference }}
            </b-table-column>
            <b-table-column label="Program" v-slot="props">
              <p><strong>
                  {{ props.row.Program.name}}
              </strong></p>
              <p><small>University: {{ props.row.University.name }}</small></p>
              <p><small>Intake: {{ props.row.Intake }}</small></p>
            </b-table-column>
            <b-table-column v-slot="props">
               <b-button
                  type="is-small"
                  @click="createApplication(props.row)"
                  >Apply</b-button>
            </b-table-column>
          </b-table>
        </b-tab-item>
        <b-tab-item v-if="getApplications" label="Applications" >
          <b-table :data="getApplications" paginated per-page="5">
            <b-table-column label="Program" v-slot="props">
              <p><strong>
                <a @click="openApplication(props.row)">
                  {{ props.row.Program.name}}
                </a>
              </strong></p>
              <p><small>University: {{ props.row.University }}</small></p>
              <p><small>Application Date: {{ props.row.Application_Date }}</small></p>
            </b-table-column>
            <b-table-column label="Fee" v-slot="props">
              <p>Status : {{ props.row.Chances_of_Fee_Payment }}</p>
              <p>Paid : {{ props.row.Fee_Paid | toCurrency }}</p>
              <p>Balance : {{ props.row.Balance_Amount | toCurrency }}</p>
            </b-table-column>
          </b-table>
        </b-tab-item>
      </b-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";

export default {
  name: "App",
  data() {
    return {
      selected: {},
      isLoading: false,
      searchQuery: '',
      numberOfPrograms: 0,
    };
  },
  computed: {
    ...mapGetters(["getEntity", "getRecord", "getEducation", "getPrograms", "getCandidatePrograms", "getApplications"]),
  },
  watch: {
    getEntity() {
      this.$store.dispatch("setRecord");
    },
    getRecord() {
      this.$store.dispatch("setEducation");
      this.$store.dispatch("fetchCandidatePrograms");
      this.$store.dispatch("fetchApplications");
    },
    getEducation() {
      this.$store.dispatch("fetchMatchingPrograms");
    }
  },
  methods: {
    ...mapActions(["setRecord", "setEducation","fetchAllPrograms"]),
    intakeStatus(status) {
      if (status == "Open") {
        return "is-success";
      } else if (status == "Waitlisted") {
        return "is-warning";
      } else if (status == "Closed") {
        return "is-danger";
      }
    },
    intakeApplication(status) {
      if (status == "Closed") {
        return true;
      } else {
        return false;
      }
    },
    searchProgram() {
      console.log(`Search for ${this.searchQuery}`)
      ZOHO.CRM.API.searchRecord({
        Entity: "Programs",
        Type: "word",
        Query: this.searchQuery
      })
      .then( (response) => {
        if(response.status != 204) {
          console.log("Valid response");
          console.log(response);
          this.numberOfPrograms = response.info.count;
          this.$store.commit("SET_PROGRAMS", response.data);
        } else {
          console.log("No response");
          let emptyArray = []
          this.numberOfPrograms = 0;
          this.$store.commit("SET_PROGRAMS", emptyArray);
        }
      })
      .catch( (error) => {
        console.error("Failed");
        console.error(error);
      })
    },
    createCandidateProgram(program, intake) {
      this.isLoading = true;
      let payload = {
        Name: `${this.getRecord.Full_Name} ${program.Name}`,
        Program: program.id,
        Lead: this.getEntity.EntityId,
        University: program.Institution.id,
        Intake: intake
      }
      console.log(payload);
      ZOHO.CRM.API.insertRecord( {
        Entity: "Candidate_Programs",
        APIData: payload
      })
      .then( () =>  {
        this.$store.dispatch("fetchCandidatePrograms");
      })
      .catch (( error) => {
        alert("Failed to select program");
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
      }) 
    },
    createApplication(candidate_program) {
      this.isLoading = true;
      let payload = {
        Program: candidate_program.Program.id,
        Lead: this.getEntity.EntityId,
        University: candidate_program.University.name,
      }
      console.log(payload);
      ZOHO.CRM.API.insertRecord({
        Entity: "Applications",
        APIData: payload
      })
      .then( () =>  {
        this.$store.dispatch("fetchApplications");
        // TODO : set candidate program as applied
      })
      .catch (( error) => {
        alert("Failed to create new application");
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
      })
    }, 
    openApplication(application) {
      console.log(application.id);
      ZOHO.CRM.UI.Record.open({
        Entity: "Applications",
        RecordID: application.id,
        Target:"_blank"
      })
      .then((response) => {
        console.log("Application record opening");
        console.log(response);
      })
      .catch( (error) => {
        console.error("Failed to open application");
        console.error(error);
      });
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    toCurrency: function (value) {
      if (typeof value !== "number") {
        return value;
      }
      var formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "CAD",
      });
      return formatter.format(value);
    },
  },
};
</script>
