import { getFirstName } from '../src/utils/user.js'

test('Should return first name when given fullname', () => {
    const firstName = getFirstName('Idward luo')
    expect(firstName).toBe('Idward')
})

