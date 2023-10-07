import { environment } from "src/environments/environment"

/**
 * Generates a public URL for accessing files stored in Firebase Storage.
 * 
 * @param fullpath The path of the file in Firebase Storage.
 * @param condition (Optional) A condition used to modify the URL generation.
 * @returns string
 */
export function getFirebasePublicUrl(fullpath: string, condition?: string): string {
    if (fullpath) {
        if (condition && fullpath.includes(condition)) fullpath = fullpath.replace(/\//g, '%2F')
        else fullpath = 'tmp%2F' + fullpath
        return environment.firebaseStorageUrl + fullpath + '?alt=media'
    } else {
        return null
    }
}

/**
 * Converts a UTC date/time string to local date/time string.
 *
 * @param dateTimeString - The UTC date/time string to be converted.
 * @returns The converted local date/time string.
 */
export const UTC_TO_LOCAL_TIME = (dateTimeString) => {
    const stringDate = new Date(dateTimeString).toLocaleString()
    const rawDate = new Date(stringDate)
    const hour = rawDate.getHours() < 10 ? `0${rawDate.getHours()}` : rawDate.getHours()
    const minute = rawDate.getMinutes() < 10 ? `0${rawDate.getMinutes()}` : rawDate.getMinutes()

    return `${hour}:${minute}`
}

/**
 * Formats the given date into a custom local date string.
 * This function takes a date and an optional separator to format the date into a custom local date string.
 * 
 * @param date - The date to be formatted. Can be a Date object or a string representing a valid date.
 * @param separator - Optional. The separator to be used in the formatted date string.
 * @returns A formatted local date string based on the provided date and separator.
 */
export const LOCAL_DATE_FORMAT = (date: any, separator?: string) => {       
    date = new Date(date)
    const year  = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day   = date.getDate().toString().padStart(2, '0')

    if (typeof separator !== 'undefined') {
        return `${day}${separator}${MONTH_NAME[month]}${separator}${year}`
    } else {
        return `${day} ${MONTH_NAME[month]} ${year}`
    }
}

export const MONTH_NAME = {
    '01': 'Januari',
    '02': 'Februari',
    '03': 'Maret',
    '04': 'April',
    '05': 'Mei',
    '06': 'Juni',
    '07': 'Juli',
    '08': 'Agustus',
    '09': 'September',
    '10': 'Oktober',
    '11': 'November',
    '12': 'Desember',
}

export type SUCCESS_API_RESPONSE = {
    status: number,
    message: string,
    data: any
}

export type ERROR_API_RESPONSE = {
    error: {
        errors: any,
        message: string
    },
    status: number
}
