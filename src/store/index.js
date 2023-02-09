import Vue from "vue";
import Vuex from "vuex";
import { ZOHO } from "../assets/ZohoEmbededAppSDK.min.js";

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    entity: {},
    record: {},
    education: [],
    programs: [],
    candidate_programs: [],
    applications: [],
  },
  getters: {
    getEntity: (state) => {
      return state.entity;
    },
    getRecord: (state) => {
      return state.record;
    },
    getEducation: (state) => {
      return state.education;
    },
    getPrograms: (state) => {
      return state.programs;
    },
    getCandidatePrograms: (state) => {
      return state.candidate_programs;
    },
    getApplications: (state) => {
      return state.applications;
    },
  },
  mutations: {
    SET_ENTITY(state, payload) {
      state.entity = payload;
    },
    SET_RECORD(state, payload) {
      state.record = payload;
    },
    SET_EDUCATION(state, payload) {
      state.education = payload;
    },
    SET_PROGRAMS(state, payload) {
      state.programs = payload;
    },
    SET_CANDIDATE_PROGRAMS(state, payload) {
      state.candidate_programs = payload;
    },
    SET_APPLICATIONS(state, payload) {
      state.applications = payload;
    },
  },
  actions: {
    async setEntity({ commit }) {
      /* Fetch the Module Name (Entity) and record id (EntityId) */
      ZOHO.embeddedApp.on("PageLoad", function (data) {
        commit("SET_ENTITY", data);
      });
    },
    async setRecord({ commit, getters }) {
      /* Fetch all the record fields for the related page */
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRecord({ Entity: e.Entity, RecordID: e.EntityId })
        .then((record) => {
          commit("SET_RECORD", record.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setEducation( {commit, getters}) {
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Edu_Records",
        approved: "both",
        sort_by: "Year_of_Completion"
      })
      .then( (response) => {
        commit("SET_EDUCATION", response.data);
      })
      .catch( (error) => {
        console.error("Failed to fetch education");
        console.error(error);
      })
    },
    async fetchAllPrograms({ commit }) {
      return ZOHO.CRM.API.getAllRecords({
        Entity: "Programs",
      })
        .then((record) => {
          commit("SET_PROGRAMS", record.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async fetchMatchingPrograms( { commit, getters }) {
      console.log("Finding matching programs");
      let highest_qualification = getters.getEducation[0];
      let search_query = "Required_Qualifications:starts_with:"
      if(highest_qualification.Name.includes('Plus Two')) {
        search_query += highest_qualification.Major_in_12th
      } else if(highest_qualification.Name.includes('Bachelor')){
        search_query += highest_qualification.Stream
      }
      ZOHO.CRM.API.searchRecord({
        Entity: "Programs_X_Qualifications",
        Type:"criteria",
        Query: `(${search_query})`
      })
      .then( (response) => {
        let eligible_programs = [];
        if(response.data != 204){
          response.data.forEach( (el) => {
            console.log(`Fetching program ${el.Programs.name}`)
            ZOHO.CRM.API.getRecord({
              Entity: "Programs",
              RecordID: el.Programs.id
            })
            .then( (response) => {
              eligible_programs.push(response.data[0]);
            })
            .catch( (error) => {
              console.error(`Unable to fetch program ${el.Programs.name}`)
              console.error(error);
            })
          });
         commit("SET_PROGRAMS", eligible_programs);
        }
      })
      .catch ((error) => {
        console.error("Unable to fetch programs via search");
        console.error(error);
      })
    },
    async fetchCandidatePrograms( {commit, getters}) {
      let e = getters.getEntity;
      console.log(`Fetching candidate programs`);
      // TODO: Fetch only non-applied candidate programs
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Candidate_Programs",
        approved: "both",
        sort_by: "Preference"
      })
      .then((response)=> {
        commit("SET_CANDIDATE_PROGRAMS", response.data);
      })
      .catch( (error) => {
        console.error(`Unable to fetch candidate programs`);
        console.error(error);
      })
    },
    async fetchApplications({ commit, getters }) {
      let e = getters.getEntity;
      console.log("Fetching applications");
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Applications",
      })
        .then((response) => {
          if(response.status != 204) {
            console.log(response.data);
            commit("SET_APPLICATIONS", response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
