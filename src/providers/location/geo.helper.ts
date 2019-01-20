export function compassHeading(alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);
  
    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    // var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);
  
    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    // var rC = - cB * cG;
  
    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);
  
    // Convert from half unit circle to whole unit circle
    if(rB < 0) {
      compassHeading += Math.PI;
    }else if(rA < 0) {
      compassHeading += 2 * Math.PI;
    }
  
    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;
  
    return compassHeading;
}

export function getDistanceinKm(origin,target) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(target.latitude-origin.latitude); 
  var dLon = deg2rad(target.longitude-origin.longitude); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(origin.latitude)) * Math.cos(deg2rad(target.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}