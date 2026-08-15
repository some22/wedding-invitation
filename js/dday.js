function daysUntil(targetISODate, fromDate) {
  var from = fromDate || new Date();
  var parts = targetISODate.split('-').map(Number);
  var target = new Date(parts[0], parts[1] - 1, parts[2]);
  var fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  var msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target - fromMidnight) / msPerDay);
}
window.daysUntil = daysUntil;
