function formatDate(dateTime) {
  // Split the date into date and time
  const [date, unfilteredTime] = dateTime.split('T');

  // Split the date and time
  const [year, month, day] = date.split('-');
  const [hour, minute] = unfilteredTime.split('.')[0].split(':');

  // Return formatted date
  return `${hour}:${minute} • ${month}/${day}/${year}`;
}

export default formatDate;
