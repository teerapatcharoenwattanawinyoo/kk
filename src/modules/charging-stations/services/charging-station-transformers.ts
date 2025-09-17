'use client'

import {
  type ChargingStationDetail,
  type ChargingStationFormWithGallery,
  type DayOfWeek,
  type PartnerStationGalleryDetail,
} from '@/modules/charging-stations/schemas/charging-stations.schema'

const DAY_MAPPING: Record<string, DayOfWeek> = {
  '0': 'sunday',
  '1': 'monday',
  '2': 'tuesday',
  '3': 'wednesday',
  '4': 'thursday',
  '5': 'friday',
  '6': 'saturday',
}

const DEFAULT_DAY_CONFIG = {
  enabled: false,
  open: '00:00',
  close: '00:00',
}

export function convertStationDetailToFormData(
  detail: ChargingStationDetail,
): ChargingStationFormWithGallery {
  const englishDesc = detail.partner_station_description?.find((desc) => desc.language_id === 1)
  const thaiDesc = detail.partner_station_description?.find((desc) => desc.language_id === 2)
  const laoDesc = detail.partner_station_description?.find((desc) => desc.language_id === 3)

  let openCloseString = ''

  if (detail.partner_station_work && detail.partner_station_work.length > 0) {
    const days: Record<string, { enabled: boolean; open: string; close: string }> = {
      monday: { ...DEFAULT_DAY_CONFIG },
      tuesday: { ...DEFAULT_DAY_CONFIG },
      wednesday: { ...DEFAULT_DAY_CONFIG },
      thursday: { ...DEFAULT_DAY_CONFIG },
      friday: { ...DEFAULT_DAY_CONFIG },
      saturday: { ...DEFAULT_DAY_CONFIG },
      sunday: { ...DEFAULT_DAY_CONFIG },
    }

    detail.partner_station_work.forEach((work) => {
      const dayName = DAY_MAPPING[work.work_day]
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
  }

  const existingGallery: PartnerStationGalleryDetail[] = (detail.partner_station_gallery || []).map(
    (item, index) => ({
      id: item.id,
      image: item.image,
      sort_order: item.sort_order || index + 1,
    }),
  )

  return {
    station_name: englishDesc?.station_name || detail.station_name || '',
    station_name_th: thaiDesc?.station_name || '',
    station_name_lao: laoDesc?.station_name || '',
    station_detail: englishDesc?.station_detail || detail.station_detail || '',
    station_detail_th: thaiDesc?.station_detail || '',
    station_detail_lao: laoDesc?.station_detail || '',
    address: detail.address || '',
    coordinates: {
      lat: Number.parseFloat(detail.latitude) || 0,
      lng: Number.parseFloat(detail.longtitude) || 0,
    },
    station_type_id:
      typeof detail.station_type_id === 'string'
        ? Number.parseInt(detail.station_type_id, 10)
        : detail.station_type_id || 1,
    status: detail.status || 1,
    show_on_map: true,
    openClose: openCloseString,
    contact: detail.contact || '',
    existingGallery,
  }
}

export function formatStationDateTime(date: string, time: string) {
  return `${date}\n${time}`
}
