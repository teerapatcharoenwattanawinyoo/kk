import {
  CreateTaxInformationApiData,
  ITaxType,
  TaxInformationResponse,
  TaxInvoiceReceiptFullData,
  TaxInvoiceReceiptResponse,
} from '@/app/[locale]/(back-office)/team/[teamId]/settings/_schemas/tax.schema'
import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../config/axios'
import { IResponse } from '../config/model'

export {
  createTaxInformation,
  createTaxInvoiceReceipt,
  deleteTaxInformation,
  deleteTaxInvoiceReceipt,
  getTaxInformation,
  getTaxInvoiceReceipt,
  getTaxTypeList,
  updateTaxInformation,
  updateTaxInvoiceReceipt,
}

// ฟังก์ชันสำหรับ Tax Information (เดิม)
const getTaxTypeList = async (): Promise<IResponse<ITaxType[]>> => {
  return api.get(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.TYPES.LIST)
}

const getTaxInformation = async (
  teamGroupId: string,
): Promise<IResponse<TaxInformationResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.LIST.replace(
    '{team_group_id}',
    teamGroupId,
  )
  return api.get(url)
}

const createTaxInformation = async (data: CreateTaxInformationApiData): Promise<IResponse> => {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('last_name', data.last_name)
  if (data.company_name) {
    formData.append('company_name', data.company_name)
  }
  if (data.branch) {
    formData.append('branch', data.branch)
  }
  formData.append('tax_id', data.tax_id)
  formData.append('country', data.country)
  formData.append('address', data.address)
  formData.append('province', data.province)
  formData.append('district', data.district)
  formData.append('sub_district', data.sub_district)
  formData.append('post_code', data.post_code)
  formData.append('individual_type_id', data.individual_type_id.toString())
  formData.append('team_group_id', data.team_group_id.toString())

  if (data.file_id_card) {
    formData.append('file_id_card', data.file_id_card)
  }
  if (data.file_twenty) {
    formData.append('file_twenty', data.file_twenty)
  }
  if (data.file_certificate) {
    formData.append('file_certificate', data.file_certificate)
  }

  return api.post(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const updateTaxInformation = async (
  teamGroupId: string,
  data: CreateTaxInformationApiData,
): Promise<IResponse> => {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('last_name', data.last_name)
  if (data.company_name) {
    formData.append('company_name', data.company_name)
  }
  if (data.branch) {
    formData.append('branch', data.branch)
  }
  formData.append('tax_id', data.tax_id)
  formData.append('country', data.country)
  formData.append('address', data.address)
  formData.append('province', data.province)
  formData.append('district', data.district)
  formData.append('sub_district', data.sub_district)
  formData.append('post_code', data.post_code)
  formData.append('individual_type_id', data.individual_type_id.toString())
  formData.append('team_group_id', data.team_group_id.toString())

  if (data.file_id_card) {
    formData.append('file_id_card', data.file_id_card)
  }
  if (data.file_twenty) {
    formData.append('file_twenty', data.file_twenty)
  }
  if (data.file_certificate) {
    formData.append('file_certificate', data.file_certificate)
  }

  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.UPDATE.replace(
    '{team_group_id}',
    teamGroupId,
  )

  return api.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const deleteTaxInformation = async (taxId: string): Promise<IResponse> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.DELETE.replace('{id}', taxId)
  return api.delete(url)
}

// ฟังก์ชันสำหรับ TaxInvoiceReceipt (จาก invoice.ts)
const getTaxInvoiceReceipt = async (
  teamGroupId: string,
): Promise<IResponse<TaxInvoiceReceiptResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.LIST.replace(
    '{team_group_id}',
    teamGroupId,
  )
  return api.get(url)
}

const createTaxInvoiceReceipt = async (data: TaxInvoiceReceiptFullData): Promise<IResponse> => {
  const formData = new FormData()

  // ส่วนของ invoice-number-prefix
  formData.append('format_document', String(data.format_document))
  formData.append('header_document', data.header_document)
  formData.append('center_document', data.center_document || '')
  formData.append('end_document', data.end_document)
  formData.append('status_document', String(data.status_document))
  formData.append('team_group_id', data.team_group_id)

  // ส่วนของ receipt-tax-invoice
  if (data.tax_title) formData.append('tax_title', data.tax_title)
  if (data.tax_code) formData.append('tax_code', data.tax_code)
  if (data.tax_fullname) formData.append('tax_fullname', data.tax_fullname)
  if (data.tax_branch) formData.append('tax_branch', data.tax_branch)
  if (data.tax_payee_name) formData.append('tax_payee_name', data.tax_payee_name)
  if (data.tax_position) formData.append('tax_position', data.tax_position)
  if (data.tax_country) formData.append('tax_country', data.tax_country)
  if (data.tax_address) formData.append('tax_address', data.tax_address)
  if (data.province) formData.append('province', data.province)
  if (data.district) formData.append('district', data.district)
  if (data.sub_district) formData.append('sub_district', data.sub_district)
  if (data.post_code) formData.append('post_code', data.post_code)
  if (data.tax_note) formData.append('tax_note', data.tax_note)

  // Handle file uploads
  if (data.tax_logo && data.tax_logo instanceof File) {
    formData.append('tax_logo', data.tax_logo)
  }
  if (data.tax_signature && data.tax_signature instanceof File) {
    formData.append('tax_signature', data.tax_signature)
  }

  return api.post(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const updateTaxInvoiceReceipt = async (
  teamGroupId: string,
  data: TaxInvoiceReceiptFullData,
): Promise<IResponse> => {
  const formData = new FormData()

  // ส่วนของ invoice-number-prefix
  formData.append('format_document', String(data.format_document))
  formData.append('header_document', data.header_document)
  formData.append('center_document', data.center_document || '')
  formData.append('end_document', data.end_document)
  formData.append('status_document', String(data.status_document))
  formData.append('team_group_id', data.team_group_id)

  // ส่วนของ receipt-tax-invoice
  if (data.tax_title) formData.append('tax_title', data.tax_title)
  if (data.tax_code) formData.append('tax_code', data.tax_code)
  if (data.tax_fullname) formData.append('tax_fullname', data.tax_fullname)
  if (data.tax_branch) formData.append('tax_branch', data.tax_branch)
  if (data.tax_payee_name) formData.append('tax_payee_name', data.tax_payee_name)
  if (data.tax_position) formData.append('tax_position', data.tax_position)
  if (data.tax_country) formData.append('tax_country', data.tax_country)
  if (data.tax_address) formData.append('tax_address', data.tax_address)
  if (data.province) formData.append('province', data.province)
  if (data.district) formData.append('district', data.district)
  if (data.sub_district) formData.append('sub_district', data.sub_district)
  if (data.post_code) formData.append('post_code', data.post_code)
  if (data.tax_note) formData.append('tax_note', data.tax_note)

  // Handle file uploads
  if (data.tax_logo && data.tax_logo instanceof File) {
    formData.append('tax_logo', data.tax_logo)
  }
  if (data.tax_signature && data.tax_signature instanceof File) {
    formData.append('tax_signature', data.tax_signature)
  }

  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.UPDATE.replace(
    '{team_group_id}',
    teamGroupId,
  )

  return api.patch(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const deleteTaxInvoiceReceipt = async (id: string): Promise<IResponse> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.DELETE.replace('{id}', id)
  return api.delete(url)
}
