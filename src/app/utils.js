function getBaseUrl() {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = 50000;

  return `${protocol}//${hostname}:${port}/api/`;
}

export function getToday() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getRelatedOuList() {
  return `${getBaseUrl()}me?fields=organisationUnits`;
}

export function getDonutChartData(year, week, ou) {
  return `${getBaseUrl()}data_completeness?week=${year}W${week - 1}&ou=${ou}`
}
