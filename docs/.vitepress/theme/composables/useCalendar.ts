interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
}

const formatDateForGoogle = (date: Date): string => {
  // Google Calendar uses YYYYMMDDTHHMMSSZ format (UTC)
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

const formatDateForICS = (date: Date): string => {
  // ICS uses YYYYMMDDTHHMMSS format with timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

const formatDateForOutlook = (date: Date): string => {
  // Outlook uses ISO format
  return date.toISOString()
}

const formatDateForYahoo = (date: Date): string => {
  // Yahoo uses YYYYMMDDTHHMMSSZ format (UTC)
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function useCalendar() {
  const event: CalendarEvent = {
    title: '승현 ♥ 서영 결혼식',
    description: '로프트가든344 10층\\n\\n예식장 10층 · 연회장 9층\\n식사는 식 전 10시 30분부터 가능합니다',
    location: '로프트가든344 10층, 서울 양천구 오목로 344',
    startDate: new Date(2026, 3, 19, 11, 0, 0), // April 19, 2026, 11:00 AM KST
    endDate: new Date(2026, 3, 19, 12, 30, 0) // April 19, 2026, 12:30 PM KST (1.5 hours)
  }

  // Google Calendar
  const openGoogleCalendar = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDateForGoogle(event.startDate)}/${formatDateForGoogle(event.endDate)}`,
      details: event.description.replace(/\\n/g, '\n'),
      location: event.location,
      ctz: 'Asia/Seoul'
    })
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank')
  }

  // Apple Calendar / Generic ICS download
  const downloadICS = () => {
    const uid = `wedding-2026-04-19-${Date.now()}@wedding.pet`
    const dtstamp = formatDateForICS(new Date())

    // Create ICS content with proper line breaks
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//Mobile Invitation//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Seoul',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZOFFSETFROM:+0900',
      'TZOFFSETTO:+0900',
      'TZNAME:KST',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=Asia/Seoul:${formatDateForICS(event.startDate)}`,
      `DTEND;TZID=Asia/Seoul:${formatDateForICS(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:내일 결혼식이 있습니다',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:2시간 후 결혼식입니다',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = '승현_서영_결혼식.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Outlook.com (Web)
  const openOutlookCalendar = () => {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      body: event.description.replace(/\\n/g, '\n'),
      location: event.location,
      startdt: formatDateForOutlook(event.startDate),
      enddt: formatDateForOutlook(event.endDate)
    })
    window.open(`https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`, '_blank')
  }

  // Yahoo Calendar
  const openYahooCalendar = () => {
    const params = new URLSearchParams({
      v: '60',
      title: event.title,
      st: formatDateForYahoo(event.startDate),
      et: formatDateForYahoo(event.endDate),
      desc: event.description.replace(/\\n/g, '\n'),
      in_loc: event.location
    })
    window.open(`https://calendar.yahoo.com/?${params.toString()}`, '_blank')
  }

  // Naver Calendar
  const openNaverCalendar = () => {
    const formatNaverDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}${month}${day}T${hours}${minutes}00`
    }

    const params = new URLSearchParams({
      title: event.title,
      location: event.location,
      content: event.description.replace(/\\n/g, '\n'),
      from: formatNaverDate(event.startDate),
      to: formatNaverDate(event.endDate)
    })
    window.open(`https://calendar.naver.com/calendar/eventCreation?${params.toString()}`, '_blank')
  }

  return {
    event,
    openGoogleCalendar,
    downloadICS,
    openOutlookCalendar,
    openYahooCalendar,
    openNaverCalendar
  }
}
