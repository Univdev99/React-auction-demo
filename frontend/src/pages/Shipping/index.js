import React from 'react'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'
import Breadcrumb from 'components/Breadcrumb'
import ContactTextLink from 'components/ContactTextLink'
import moveToTopOnMount from 'utils/moveToTopOnMount'

const breadcrumbPath = [
  { route: '/', text: 'Home' },
  { text: 'Shipping' },
]

const Shipping = () => (
  <AppLayout1>
    <AppContainerLayout>
      <Breadcrumb className="mb-5" path={breadcrumbPath} />

      <h3 className="mb-5">Shipping</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut nibh dictum, auctor libero ac,
        varius sem. Aenean in augue sed enim pulvinar ultricies eget at nibh. Sed ac iaculis lorem. Donec
        faucibus sodales risus, ac scelerisque urna tristique at. Etiam non nulla molestie mi pellentesque
        rutrum. Fusce sodales tellus sit amet facilisis dictum. Sed sagittis vel dui condimentum dictum.
        Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
        neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis. Morbi pulvinar at
        ante sed vestibulum. Sed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit
        leo, vel malesuada quam aliquam et.
      </p>

      <h5 className="mb-3">Section Title</h5>
      <p>
        Pellentesque faucibus urna id nulla varius convallis. Interdum et malesuada fames ac ante ipsum
        primis in faucibus. In congue hendrerit ex vel tincidunt. Suspendisse potenti. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Maecenas vestibulum tempor lacinia. Mauris orci libero,
        fermentum eu varius eget, commodo eu ipsum. Integer ornare vitae odio egestas varius. Cras egestas
        iaculis ligula, sit amet dignissim massa elementum et. Proin ut suscipit tellus, vel viverra orci.
        Donec orci neque, laoreet nec risus non, imperdiet efficitur mauris. Duis a enim non neque sagittis
        tempus quis vel diam. Cras hendrerit velit eget odio suscipit, suscipit tincidunt nibh tincidunt.
      </p>
      <p>
        Donec ut elit in enim imperdiet vehicula ut vel ex. Pellentesque enim purus, malesuada sed tempor in,
        aliquet ut dolor. Aliquam gravida, leo eget bibendum gravida, nisl dui viverra lectus, quis pharetra
        nulla sem et eros. Sed in purus sed eros euismod pellentesque ac eu metus. In viverra laoreet metus a
        sodales. Quisque pulvinar sem sit amet enim molestie, in congue erat ultricies. Donec nec dolor nisl.
        Nunc sed aliquet diam. Cras aliquam orci in placerat feugiat. Maecenas id justo nibh.
      </p>

      <ContactTextLink />
    </AppContainerLayout>
  </AppLayout1>
)

export default moveToTopOnMount(Shipping)
