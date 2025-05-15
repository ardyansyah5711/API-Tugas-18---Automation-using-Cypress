describe('Reqres API Tests', () => {
  const apiKey = 'reqres-free-v1'; 

   const baseUrl = 'https://reqres.in/api';

  // Get list users
  it('GET - List Users', () => {
    cy.request(`${baseUrl}/users?page=2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.length.greaterThan(0);
    });
  });

  // Get single user
  it('GET - Single User', () => {
    cy.request(`${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('id', 2);
    });
  });

  // Get single user not found
  
    it('GET non-existent user should return 404', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/users/23',
      failOnStatusCode: false,
      headers: {
        'x-api-key': apiKey
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

    // Get List <resource> 

  it('GET - List <resource> ', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/unknown`,
      headers: {
        'x-api-key': apiKey
      },
    }).then((response) => {
      //Status harus 200
      expect(response.status).to.eq(200);

      //Pastikan struktur respons sesuai
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');

      //Periksa properti di dalam data
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.all.keys(
          'id',
          'name',
          'year',
          'color',
          'pantone_value'
        );
      }
    });
  });

// Get single <resource>
  it('GET Single <resource>', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/unknown/2`,
      headers: {
        'x-api-key': apiKey
      },
    }).then((response) => {
      // Pastikan status 200
      expect(response.status).to.eq(200);

      //Pastikan ada objek data
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('object');

      //Validasi data yang dikembalikan sesuai ID 2
      expect(response.body.data).to.include({
        id: 2,
        name: 'fuchsia rose',
        year: 2001,
        color: '#C74375',
        pantone_value: '17-2031'
      });
    });
  });


  // Get single <resource> user not found
  it('GET - Single <resource> user not found', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/unknown/23`,
      headers: {
        'x-api-key': apiKey
      },
      failOnStatusCode: false // agar test tidak langsung gagal jika status bukan 2xx
    }).then((response) => {
      //Verifikasi status 404
      expect(response.status).to.eq(404);
      expect(response.body).to.be.empty;
    });
  });


    //POST - Create user
  it('POST - Create User', () => {
    cy.request({
      method: 'POST',
      url: 'https://reqres.in/api/users',
      headers: {
        'x-api-key': apiKey
      },
      body: {
        name: 'morpheus',
        job: 'leader'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include.keys('name', 'job', 'id', 'createdAt');
    });
  });

  // PUT  - Update User Data
  it('PUT - Update User Data', () => {
    cy.request({
      method: 'PUT',
      url: 'https://reqres.in/api/users/2',
      headers: {
        'x-api-key': apiKey
      },
      body: {
        name: 'morpheus',
        job: 'zion resident'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include.keys('name', 'job', 'updatedAt');
    });
  });


  // PATCH  - Update User Data
  it('PATCH - Update User Data', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://reqres.in/api/users/2',
      headers: {
        'x-api-key': apiKey
      },
      body: {
        name: 'morpheus',
        job: 'zion resident'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include.keys('name','job', 'updatedAt');
    });
  });


  // DELETE - Delete user
  it('DELETE - Delete User Data', () => {
      cy.request({
        method: 'DELETE',
        url: 'https://reqres.in/api/users/2',
        headers: {
          'x-api-key': apiKey
        },
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

  // POST - Register user (successful)

  it('POST - Register Successful', () => {
      cy.request({
      method: 'POST',
      url: 'https://reqres.in/api/register',
      headers: {
        'x-api-key': apiKey
      },
      body: {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
    });
  });

    
  // POST - Register user (unsuccessful)
  it('POST - Register Unsuccessful', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      headers: {
        'x-api-key': apiKey
      },
      body: {
        email: 'sydney@fife'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });


  // POST - Login successful
    it('POST - Login Successful', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        headers: {
        'x-api-key': apiKey
        },
        body:{
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        }
        
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });

    // POST - Login unsuccessful
  it('POST - Login Unsuccessful', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      headers: {
        'x-api-key': apiKey
        },
      body: {
        email: 'peter@klaven'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  // GET - Delayed Response
  it('GET - Delayed Response', () => {
  cy.request({
    method: 'GET',
    url: `${baseUrl}/users?delay=3`, // URL dengan delay
    headers: {
      'x-api-key': apiKey 
    }
  }).then((response) => {
    expect(response.status).to.eq(200); // Verifikasi status code 200
    expect(response.body).to.have.property('data'); // Verifikasi adanya data di response
  });
});


});
