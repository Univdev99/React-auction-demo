export const WS_BACKEND_URL = 'ws://localhost:8000'
export const SERVER_URL = process.env.NODE_ENV === 'production' ?
  'http://ec2-54-235-235-0.compute-1.amazonaws.com' :
  'http://localhost:8000'
export const BASE_API_URL = `${SERVER_URL}/api/v1/`

export const FACEBOOK_APP_ID = '147173285892300'
export const FACEBOOK_API_VERSION = 'v2.10'

export const PAGE_SIZE = 8
export const MEDIUM_PAGE_SIZE = 12
export const AUCTION_BID_PAGE_SIZE = 10
export const ACCOUNT_BID_AUCTIONS_PAGE_SIZE = 4

/* Donor constants */

export const DONOR_TYPES = [
  { key: 'company', value: 'Company' },
  { key: 'celebrity', value: 'Celebrity' },
  { key: 'other', value: 'Other' },
]

/* Auction constants */

export const AUCTION_STATUS_PREVIEW = 'preview'
export const AUCTION_STATUS_OPEN = 'open'
export const AUCTION_STATUS_FINISHED = 'finished'
export const AUCTION_STATUS_CANCELLED = 'cancelled'

/* Bid constants */

export const BID_STATUS_ACTIVE = 'active'
export const BID_STATUS_WON = 'won'
export const BID_STATUS_LOST = 'lost'
export const BID_STATUS_REJECTED = 'rejected'

/* Medium constants */

export const MEDIUM_TYPES = [
  { key: 'image', value: 'Image' },
  { key: 'video', value: 'Video' },
  { key: 'audio', value: 'Audio' },
]

/* Notification constants */

export const NOTIFICATION_TYPE_AUCTION = 'auction'
export const NOTIFICATION_AUCTION_NEW = `${NOTIFICATION_TYPE_AUCTION}/new`
export const NOTIFICATION_AUCTION_NEW_BID = `${NOTIFICATION_TYPE_AUCTION}/new-bid`
export const NOTIFICATION_AUCTION_CLOSE = `${NOTIFICATION_TYPE_AUCTION}/close`
export const NOTIFICATION_AUCTION_PAYMENT = `${NOTIFICATION_TYPE_AUCTION}/payment`

/* Product constants */

export const PRODUCT_WEIGHT_UNIT_OUNCE = 'oz'
export const PRODUCT_WEIGHT_UNIT_POUND = 'lb'
export const PRODUCT_WEIGHT_UNIT_KG = 'kg'
export const PRODUCT_WEIGHT_UNIT_GRAM = 'g'

export const PRODUCT_WEIGHT_UNIT_CHOICES = [
  PRODUCT_WEIGHT_UNIT_OUNCE,
  PRODUCT_WEIGHT_UNIT_POUND,
  PRODUCT_WEIGHT_UNIT_KG,
  PRODUCT_WEIGHT_UNIT_GRAM,
]
