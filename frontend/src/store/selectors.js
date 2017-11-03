export const authSelector = state => 
  state.get('auth')

export const adminCharitiesSelector = state =>
  state.get('adminCharities')

export const adminDonorsSelector = state =>
  state.get('adminDonors')

export const adminProductsSelector = state =>
  state.get('adminProducts')

export const adminAuctionsSelector = state =>
  state.get('adminAuctions')

export const adminUsersSelector = state =>
  state.get('adminUsers')

export const adminMediaSelector = state =>
  state.get('adminMedia')

export const accountSelector = state =>
  state.get('account')

export const donorsSelector = state => 
  state.get('donors')

export const jobsSelector = state => 
  state.get('jobs')

export const countriesSelector = state =>
	state.get('settings').get('countries').toJS()