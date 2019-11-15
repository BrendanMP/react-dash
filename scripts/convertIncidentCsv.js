'use strict'
const fs = require('fs');
const csv = require('csvtojson')
const uuidv4 = require('uuid/v4')

const incidents = './csv/incident-data.csv'
const OFFSET = 1577836800;

csv()
  .fromFile(incidents)
  .then((incidents) => {
    let result = []
    incidents.forEach((incident, i) => {
      const stages = [
        {
          type: 'feature',
          properties: {
            id: uuidv4(),
            status: 'detected',
            type: incident.type,
            start_timestamp: incident.detected_start - OFFSET,
            end_timestamp: incident.response_start - OFFSET,
            cars_damaged: incident.cars_damaged,
            cars_totaled: incident.cars_totaled,
            cars_delayed: incident.cars_delayed,
            fatalities: incident.fatalities,
            severity: incident.severity,
            incident_origin: incident.incident_origin,
            response_origin: incident.response_origin,
          },
          geometry: {
            type: "Point",
            coordinates: [
              Number(incident.incident_longitude),
              Number(incident.incident_latitude),
            ]
          }
        },
        {
          type: 'feature',
          properties: {
            id: uuidv4(),
            status: 'responding',
            type: 'accident',
            start_timestamp: incident.response_start - OFFSET,
            end_timestamp: incident.clearing_start - OFFSET,
            cars_damaged: incident.cars_damaged,
            cars_totaled: incident.cars_totaled,
            cars_delayed: incident.cars_delayed,
            fatalities: incident.fatalities,
            severity: incident.severity,
            incident_origin: incident.incident_origin,
            response_origin: incident.response_origin,
          },
          geometry: {
            type: "Point",
            coordinates: [
              Number(incident.incident_longitude),
              Number(incident.incident_latitude),
            ]
          }
        },
        {
          type: 'feature',
          properties: {
            id: uuidv4(),
            status: 'clearing',
            type: 'accident',
            start_timestamp: incident.clearing_start - OFFSET,
            end_timestamp: incident.clearing_end - OFFSET,
            cars_damaged: incident.cars_damaged,
            cars_totaled: incident.cars_totaled,
            cars_delayed: incident.cars_delayed,
            fatalities: incident.fatalities,
            severity: incident.severity,
            incident_origin: incident.incident_origin,
            response_origin: incident.response_origin,
          },
          geometry: {
            type: "Point",
            coordinates: [
              Number(incident.incident_longitude),
              Number(incident.incident_latitude),
            ]
          }
        },
      ]
      result = [...result, ...stages]
    })

    let data = JSON.stringify({incidents: result});
    fs.writeFileSync('incidents_points.json', data);
  })
