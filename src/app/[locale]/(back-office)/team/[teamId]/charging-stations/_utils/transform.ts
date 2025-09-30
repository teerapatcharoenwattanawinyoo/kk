import {
  type ChargingStationDetail,
  type ChargingStationFormData,
  type PartnerStationGalleryDetail,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'

export function convertStationDetailToFormData(
  detail: ChargingStationDetail,
): ChargingStationFormData & {
  existingGallery: PartnerStationGalleryDetail[]
} {
  const englishDesc = detail.partner_station_description?.find((desc) => desc.language_id === 1)
  const thaiDesc = detail.partner_station_description?.find((desc) => desc.language_id === 2)
  const laoDesc = detail.partner_station_description?.find((desc) => desc.language_id === 3)

  let openCloseString = ''
  if (detail.partner_station_work && detail.partner_station_work.length > 0) {
    const days: Record<string, { enabled: boolean; open: string; close: string }> = {
      sunday: { enabled: false, open: '00:00', close: '00:00' },
      monday: { enabled: false, open: '00:00', close: '00:00' },
      tuesday: { enabled: false, open: '00:00', close: '00:00' },
      wednesday: { enabled: false, open: '00:00', close: '00:00' },
      thursday: { enabled: false, open: '00:00', close: '00:00' },
      friday: { enabled: false, open: '00:00', close: '00:00' },
      saturday: { enabled: false, open: '00:00', close: '00:00' },
    }

    const dayMapping: Record<string, string> = {
      '0': 'sunday',
      '1': 'monday',
      '2': 'tuesday',
      '3': 'wednesday',
      '4': 'thursday',
      '5': 'friday',
      '6': 'saturday',
    }

    detail.partner_station_work.forEach((work) => {
      const dayName = dayMapping[work.work_day]
      if (dayName && days[dayName]) {
        days[dayName] = {
          enabled: work.work_status === '1',
          open: work.work_time_start,
          close: work.work_time_end,
        }
      }
    })

    const openCloseData = {
      open24hrs: false,
      sameEveryday: false,
      days,
    }

    openCloseString = JSON.stringify(openCloseData)
  } else {
    console.warn('⚠️ No partner_station_work data found, using default openClose')
  }

  const formData = {
    station_name: englishDesc?.station_name || detail.station_name || '',
    station_name_th: thaiDesc?.station_name || '',
    station_name_lao: laoDesc?.station_name || '',
    station_detail: englishDesc?.station_detail || detail.station_detail || '',
    station_detail_th: thaiDesc?.station_detail || '',
    station_detail_lao: laoDesc?.station_detail || '',
    address: detail.address || '',
    coordinates: {
      lat: parseFloat(detail.latitude) || 0,
      lng: parseFloat(detail.longtitude) || 0,
    },
    station_type_id:
      typeof detail.station_type_id === 'string'
        ? parseInt(detail.station_type_id)
        : detail.station_type_id || 1,
    status: detail.status || 1,
    show_on_map: true,
    openClose: openCloseString,
    contact: detail.contact || '',
    existingGallery: (detail.partner_station_gallery || []).map((item, index) => ({
      id: item.id,
      image: item.image,
      sort_order: item.sort_order || index + 1,
    })),
  }

  return formData
}
