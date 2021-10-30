import date from 'date-and-time';

export const utcToLocal = (dateTime, dtFormat = 'DD MMM YYYY hh:mmA') => {
	if (dateTime != '' && dateTime != null && dateTime != undefined) {
		let dt = date.format(new Date(dateTime), 'YYYY/MM/DD HH:mm:ss')
		let hr = date.format(new Date(dateTime), 'HH')
		dt = dt + ' ' + (hr >= 12 ? 'PM' : 'AM') + ' UTC'
		dt = new Date(dt)
		dt = date.format(new Date(dt), dtFormat);
		return dt
	} else {
		return ''
	}
}