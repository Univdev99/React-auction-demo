import { all } from 'redux-saga/effects'

import auth from './auth'
import adminCharities from './admin/charities'
import adminDonors from './admin/donors'
import adminProducts from './admin/products'
import adminAuctions from './admin/auctions'
import adminTags from './admin/tags'
import adminUsers from './admin/users'
import adminMedia from './admin/media'
import donors from './donors'


export default function* rootSaga() {
  yield all([
    auth(),
    adminCharities(),
    adminDonors(),
    adminProducts(),
    adminAuctions(),
    adminTags(),
    adminUsers(),
    adminMedia(),
    donors()
  ])
}
