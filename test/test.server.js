const request = require('supertest');
const app = require('../server.js');
const should = require('should');
const expect = require('expect');


describe('GET /signup' , ()=>{
	it('should return signup page', (done)=>{
		request(app)
		.get('/signup')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

/*describe('POST /signup' , () => {
	it('should create a user' , (done)=>{
		let testuser = {
		'Nom' : 'toto',
		'Prenom' : 'eustache',
		'Mail' : 'signup@test.com',
		'password' : 'testtest',
		'Pays' : 'Paris',
		'Ville' : 'France',
		'date_naissance' : '1980-05-05'
	}

		request(app)
		.post('/signup')
		.send(testuser)
		.expect(200)
		.expect(res => {

		})
		.end(err=>{
			if(err){
				return done(err)
			}
		})

		.done()

		.end((err,res)=> {
			should.exist(res);
			res.status.should.be.equal(200);
			res.body.email.should.be.equal('signup@test.com');
			done();
		}); 

	});
}); */

describe('GET /' , ()=>{
	it('should return homepage', (done)=>{
		request(app)
		.get('/')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

describe('GET /dashboard' , ()=>{
	it('should return dashboard page', (done)=>{
		request(app)
		.get('/dashboard')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});



