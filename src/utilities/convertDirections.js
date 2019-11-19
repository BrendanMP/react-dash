import polyline from "google-polyline";

const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

function Line(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.distanceToPoint = function(point) {
    // slope
    const m = (this.p2[0] - this.p1[0]) / (this.p2[1] - this.p1[1]),
      // y offset
      b = this.p1[0] - m * this.p1[1],
      d = [];
    // distance to the linear equation
    d.push(
      Math.abs(point[0] - m * point[1] - b) / Math.sqrt(Math.pow(m, 2) + 1)
    );
    // distance to p1
    d.push(
      Math.sqrt(
        Math.pow(point[1] - this.p1[1], 2) + Math.pow(point[0] - this.p1[0], 2)
      )
    );
    // distance to p2
    d.push(
      Math.sqrt(
        Math.pow(point[1] - this.p2[1], 2) + Math.pow(point[0] - this.p2[0], 2)
      )
    );
    // return the smallest distance
    return d.sort(function(a, b) {
      return a - b; //causes an array to be sorted numerically and ascending
    })[0];
  };
}

const simplify = function(points, tolerance) {
  var douglasPeucker = function(points, tolerance) {
    if (points.length <= 2) {
      return [points[0]];
    }
    var returnPoints = [],
      // make line from start to end
      line = new Line(points[0], points[points.length - 1]),
      // find the largest distance from intermediate poitns to this line
      maxDistance = 0,
      maxDistanceIndex = 0,
      p;
    for (var i = 1; i <= points.length - 2; i++) {
      var distance = line.distanceToPoint(points[i]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceIndex = i;
      }
    }
    // check if the max distance is greater than our tollerance allows
    if (maxDistance >= tolerance) {
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      // include this point in the output
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance)
      );
      // returnPoints.push( points[maxDistanceIndex] );
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance)
      );
    } else {
      // ditching this point
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      returnPoints = [points[0]];
    }
    return returnPoints;
  };
  var result = douglasPeucker(points, tolerance);
  // always have to push the very last point on so it doesn't get left off
  result.push(points[points.length - 1]);
  return result;
};

const distanceBetween = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

const convertDirections = (directions, offset) => {
  if (directions) {
    return directions.map(item => {
      const TRIP = item.routes[0].legs[0];
      const TRIP_DISTANCE = TRIP.distance.value;
      const TRIP_DURATION = TRIP.duration_in_traffic.value;

      const OFFSET = item.start_time;
      const START_TIME = 1577836800 - OFFSET;
      let total = START_TIME;
      let duration = 0;
      let trip = [];
      const STEPS = TRIP.steps.map(step => {
        const step_distance = step.distance.value;
        const step_duration = step.duration.value;
        const line = polyline.decode(step.polyline.points);
        const line_simplified = simplify(line, 0.00001);
        const points = [];
        line_simplified.forEach((point, i) => {
          if (line_simplified[i + 1]) {
            const next_point = line_simplified[i + 1];
            const distance_between =
              distanceBetween(
                point[0],
                point[1],
                next_point[0],
                next_point[1],
                "K"
              ) * 1000;
            const percent = distance_between / step_distance;
            duration = round(percent * step_duration, 0);
          }
          const timestamp = total;
          total = duration + total;
          if (
            line_simplified[i - 1] &&
            line_simplified[i - 1].timestamp !== timestamp
          ) {
            trip.push({
              coordinates: point,
              timestamp: offset ? timestamp : timestamp
            });
          }
        });
      });
      return {
        trip,
        start: START_TIME,
        end: START_TIME + TRIP_DURATION,
        origin: TRIP.start_address,
        destination: TRIP.end_address,
        speed: round((TRIP_DISTANCE / TRIP_DURATION) * 3.6, 0)
      };
    });
  }
  return [];
};

export default convertDirections;
