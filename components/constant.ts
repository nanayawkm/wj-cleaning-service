export const CONTACT_DETAILS = {
    /**
     * Three forms on purpose, rather than deriving them from one another:
     *   phone     — what a Dutch reader expects to see, matching the flyer
     *   phoneTel  — E.164, so tel: works from abroad as well as domestically
     *   phoneWa   — digits only, no plus; what wa.me requires
     * Stripping non-digits from the display form gives "0644576593", which is
     * domestic-only for tel: and simply invalid for WhatsApp.
     */
    phone: '06-44576593',
    phoneTel: '+31644576593',
    phoneWa: '31644576593',
    email: 'info@wjcleaningservices.nl',
    address: '',
    city: 'Lelystad',
    country: 'Netherlands',
    googlemap: 'https://share.google.com/QzPrr87bBH8Hui1VK'
}

// Dutch law (BW 3:15d) requires commercial websites to display the KVK and BTW
// numbers. Fill these in and the footer will render them automatically; left
// empty, they are omitted rather than shown as placeholders.
export const BUSINESS_DETAILS = {
    kvk: '',
    btw: '',
    insurer: '',
}

// Working hours used by the site and, later, by the booking availability rules.
export const OPENING_HOURS = {
    weekdays: 'Mon - Sat, 09:00 - 18:00',
    closed: 'Sunday',
}
