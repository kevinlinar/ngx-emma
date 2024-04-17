import { User } from '@demo/interfaces/user/user';
import { faker } from '@faker-js/faker';

function createRandomUser(count: number): User[] {
  /* if (count > 10000) {
    count = 10000;
  } */
  const user: User[] = [];
  for (let i = 0; i < count; i++) {
    user[i] = {
      id: i + 1,
      name: faker.person.firstName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      address: {
        street: faker.location.street(),
        suite: faker.location.secondaryAddress(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        geo: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
      },
      phone: faker.phone.number(),
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.buzzPhrase(),
      },
      website: faker.internet.url(),
    };
  }
  return user;
}

export const users: User[] = createRandomUser(1001);
